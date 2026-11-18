"""BBJ 公開サマリー統計（pheweb.jp）を使った候補遺伝子の予備解析。

個票データは使わない。PheWeb の公開 API から、次の 2 つを行う。
  A) 事前に指定した候補 SNP の PheWAS（BBJ の全形質）
  B) 候補遺伝子領域（遺伝子の前後 ±WINDOW）のスキャン（対象疾患ごと）
     → 領域内の最小 P 値、Bonferroni 補正した領域 P 値、全体での BH-FDR

使い方:
  python3 scripts/pilot/pilot_bbj_pheweb.py            # 実行（キャッシュあり）
出力:
  data/external/pheweb/cache/   API 応答のキャッシュ（Git 管理外）
  docs/pilot/*.tsv              集計結果（公開データ由来の集計値）
"""
import json, os, re, sys, time, math, csv, urllib.request, urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE = os.path.join(ROOT, "data", "external", "pheweb", "cache")
OUT = os.path.join(ROOT, "docs", "pilot")
os.makedirs(CACHE, exist_ok=True); os.makedirs(OUT, exist_ok=True)

PHEWEB = "https://pheweb.jp"
EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
GRCH37 = "GCF_000001405.25"
WINDOW = 50_000
MIN_AF, MIN_R2 = 0.005, 0.7   # 領域スキャンで使うバリアントのフィルター

# 対象疾患（BBJ PheWeb の phenocode）。ALS・認知症は PheWeb に存在しない
TARGET = {
    "IS": "Ischemic stroke（脳梗塞）",
    "CeAn": "Cerebral aneurysm（脳動脈瘤）",
    "Subarachnoid_Hemorrhage": "Subarachnoid hemorrhage（クモ膜下出血）",
    "Intracerebral_Hemorrhage": "Intracerebral hemorrhage（脳出血）",
    "Epilepsy": "Epilepsy（てんかん）",
}
EXPLORATORY = {"Parkinsons_Disease": "Parkinson's disease（探索的）"}
POSITIVE_CONTROL = {"Drinking_Ever_Never": "Drinking ever/never（陽性対照）"}
REGION_PHENOS = {**TARGET, **EXPLORATORY, **POSITIVE_CONTROL}

# 事前に指定する候補 SNP（文献で機能が知られているもの）
CANDIDATE_SNPS = [
    ("rs671", "ALDH2", "Glu504Lys（ALDH2*2, 不活性型）", "アルコール代謝"),
    ("rs1229984", "ADH1B", "His48Arg（ADH1B*2, 高活性型）", "アルコール代謝"),
    ("rs3043", "ALDH1B1", "BBJ 飲酒 GWAS のリード SNP（Matoba 2020）", "アルコール代謝"),
    ("rs713598", "TAS2R38", "A49P（PAV/AVI ハプロタイプ）", "味覚"),
    ("rs1726866", "TAS2R38", "V262A（PAV/AVI ハプロタイプ）", "味覚"),
    ("rs10246939", "TAS2R38", "I296V（PAV/AVI ハプロタイプ）", "味覚"),
    ("rs10772420", "TAS2R19", "R299C（キニーネ・グレープフルーツの苦味）", "味覚"),
    ("rs35874116", "TAS1R2", "I191V（甘味）", "味覚"),
    ("rs307355", "TAS1R3", "プロモーター（甘味の感度）", "味覚"),
    ("rs34160967", "TAS1R1", "A372T（旨味）", "味覚"),
    ("rs61729907", "OR7D4", "R88W（アンドロステノン）", "嗅覚"),
    ("rs5020278", "OR7D4", "T133M（アンドロステノン）", "嗅覚"),
    ("rs6591536", "OR5A1", "N183D（β-イオノン）", "嗅覚"),
    ("rs28757581", "OR2J3", "T113A（cis-3-hexen-1-ol）", "嗅覚"),
    ("rs72921001", "OR6A2", "近傍 SNP（コリアンダーの嗜好）", "嗅覚"),
]

ALDH = ["ALDH1A1", "ALDH1A2", "ALDH1A3", "ALDH1B1", "ALDH1L1", "ALDH1L2", "ALDH2",
        "ALDH3A1", "ALDH3A2", "ALDH3B1", "ALDH3B2", "ALDH4A1", "ALDH5A1", "ALDH6A1",
        "ALDH7A1", "ALDH8A1", "ALDH9A1", "ALDH16A1", "ALDH18A1"]
ADH = ["ADH1A", "ADH1B", "ADH1C", "ADH4", "ADH5", "ADH6", "ADH7"]
TAS1R = ["TAS1R1", "TAS1R2", "TAS1R3"]


def http_json(url, cache_name=None, tries=4):
    path = os.path.join(CACHE, cache_name) if cache_name else None
    if path and os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=120) as r:
                data = json.loads(r.read())
            if path:
                with open(path, "w") as f:
                    json.dump(data, f)
            time.sleep(0.3)
            return data
        except Exception as e:  # noqa
            err = e
            time.sleep(2 * (i + 1))
    raise RuntimeError(f"failed: {url}: {err}")


# ---------------- 遺伝子座標（NCBI Gene → GRCh37） ----------------
def ncbi_gene_ids(term):
    q = urllib.parse.urlencode(dict(db="gene", term=term, retmax=2000, retmode="json"))
    return http_json(EUTILS + "esearch.fcgi?" + q)["esearchresult"]["idlist"]


def ncbi_gene_coords(ids):
    out = []
    for i in range(0, len(ids), 200):
        q = urllib.parse.urlencode(dict(db="gene", id=",".join(ids[i:i + 200]), retmode="json"))
        res = http_json(EUTILS + "esummary.fcgi?" + q)["result"]
        for gid in res.get("uids", []):
            r = res[gid]
            h37 = [x for x in r.get("locationhist", []) if x.get("assemblyaccver") == GRCH37]
            if not h37:
                continue
            x = h37[0]
            chrom = r.get("chromosome") or (r["genomicinfo"][0]["chrloc"] if r.get("genomicinfo") else "")
            s, e = sorted([int(x["chrstart"]) + 1, int(x["chrstop"]) + 1])
            out.append(dict(gene=r["name"], chrom=chrom, start=s, end=e))
    return out


def get_genes():
    cache = os.path.join(CACHE, "genes_grch37.json")
    if os.path.exists(cache):
        return json.load(open(cache))
    base = 'AND "Homo sapiens"[orgn] AND alive[prop] AND "genetype protein coding"[prop]'
    genes = []
    named = {g: fam for fam, lst in (("ALDH", ALDH), ("ADH", ADH), ("TAS1R", TAS1R)) for g in lst}
    ids = ncbi_gene_ids(" OR ".join(f"{g}[sym]" for g in named) + " " + base)
    for g in ncbi_gene_coords(ids):
        if g["gene"] in named:
            genes.append({**g, "family": named[g["gene"]]})
    for fam, pat, term in (("TAS2R", r"^TAS2R\d+$", "TAS2R*[sym]"),
                           ("OR", r"^OR\d+[A-Z]+\d+[A-Z]?$", "\"olfactory receptor\"[title]")):
        ids = ncbi_gene_ids(term + " " + base)
        for g in ncbi_gene_coords(ids):
            if re.match(pat, g["gene"]):
                genes.append({**g, "family": fam})
    # 重複除去
    seen, uniq = set(), []
    for g in genes:
        if g["gene"] not in seen and g["chrom"] not in ("", "X|Y", "Un"):
            seen.add(g["gene"]); uniq.append(g)
    json.dump(uniq, open(cache, "w"), indent=0)
    return uniq


def merge_regions(genes):
    """ファミリー内で ±WINDOW が重なる遺伝子をまとめて 1 領域にする。"""
    regs = []
    for fam in sorted({g["family"] for g in genes}):
        gs = sorted([g for g in genes if g["family"] == fam], key=lambda g: (g["chrom"], g["start"]))
        cur = None
        for g in gs:
            s, e = max(1, g["start"] - WINDOW), g["end"] + WINDOW
            if cur and cur["chrom"] == g["chrom"] and s <= cur["end"]:
                cur["end"] = max(cur["end"], e); cur["genes"].append(g["gene"])
            else:
                if cur: regs.append(cur)
                cur = dict(family=fam, chrom=g["chrom"], start=s, end=e, genes=[g["gene"]])
        if cur: regs.append(cur)
    for r in regs:
        g = r["genes"]
        r["label"] = g[0] if len(g) == 1 else f"{g[0]}..{g[-1]} ({len(g)} genes)"
    return regs


# ---------------- PheWeb API ----------------
def region_variants(pheno, chrom, start, end):
    f = (f"analysis in 3 and chromosome in  '{chrom}' and position ge {start} and position le {end}")
    url = f"{PHEWEB}/api/region/{pheno}/lz-results/?" + urllib.parse.urlencode({"filter": f})
    d = http_json(url, f"region_{pheno}_{chrom}_{start}_{end}.json")["data"]
    keys = list(d.keys())
    return [dict(zip(keys, vals)) for vals in zip(*[d[k] for k in keys])]


def resolve_rsid(rsid):
    res = http_json(f"{PHEWEB}/api/autocomplete?query={rsid}", f"ac_{rsid}.json")
    for x in res:
        if x["display"].split(" ")[0] == rsid:
            return x["value"]  # "chr:pos-ref-alt"
    return None


def variant_phewas(vid):
    chrom, rest = vid.split(":")
    url = f"{PHEWEB}/api/variant/{chrom}-{rest}"
    return http_json(url, f"variant_{vid.replace(':', '_')}.json")


def bh(pvals):
    n = len(pvals); order = sorted(range(n), key=lambda i: pvals[i]); q = [1.0] * n; prev = 1.0
    for rank, i in reversed(list(enumerate(order, 1))):
        prev = min(prev, pvals[i] * n / rank); q[i] = prev
    return q


def write_tsv(name, rows, cols):
    with open(os.path.join(OUT, name), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, delimiter="\t", extrasaction="ignore")
        w.writeheader(); [w.writerow(r) for r in rows]


Z_A_80 = 0.8416  # 検出力 80%


def z_two_sided(alpha):
    # 正規分布の上側分位点（二分法）
    lo, hi = 0.0, 40.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if math.erfc(mid / math.sqrt(2)) > alpha: lo = mid
        else: hi = mid
    return mid


def main():
    phenos = {p["phenocode"]: p for p in http_json(f"{PHEWEB}/api/phenotypes.json", "phenotypes.json")}

    # ---- A) 候補 SNP の PheWAS ----
    n_tests_A = len(CANDIDATE_SNPS) * len(TARGET)
    thr_A = 0.05 / n_tests_A
    z_thr_A = z_two_sided(thr_A)
    rowsA, rows_top = [], []
    for rsid, gene, desc, grp in CANDIDATE_SNPS:
        vid = resolve_rsid(rsid)
        if not vid:
            for code in TARGET:
                rowsA.append(dict(rsid=rsid, gene=gene, group=grp, note=desc, phenocode=code,
                                  phenotype=TARGET[code], status="PheWeb に収載なし"))
            continue
        v = variant_phewas(vid)
        byp = {p["phenocode"]: p for p in v["phenos"]}
        for code in list(TARGET) + list(EXPLORATORY) + list(POSITIVE_CONTROL):
            p = byp.get(code)
            if not p or p.get("beta") is None:
                rowsA.append(dict(rsid=rsid, gene=gene, group=grp, note=desc, variant=vid,
                                  phenocode=code, phenotype=REGION_PHENOS[code], status="欠測"))
                continue
            b, se = p["beta"], p["sebeta"]
            rowsA.append(dict(
                rsid=rsid, gene=gene, group=grp, note=desc, variant=vid, effect_allele=vid.split("-")[-1],
                phenocode=code, phenotype=REGION_PHENOS[code], af=p["af"], imp_r2=p.get("r2"),
                cases=p.get("num_cases"), controls=p.get("num_controls"),
                OR=round(math.exp(b), 3), CI95=f"{math.exp(b-1.96*se):.3f}-{math.exp(b+1.96*se):.3f}",
                pval=p["pval"],
                sig=("Bonferroni" if p["pval"] < thr_A and code in TARGET else
                     ("nominal" if p["pval"] < 0.05 else "")),
                # 観測 SE から、80% 検出力で検出できる最小 OR（両方向の大きい方）
                MDE_OR=round(math.exp((z_thr_A + Z_A_80) * se), 3) if code in TARGET else "",
                status="ok"))
        # 全形質の中で上位
        for p in sorted(v["phenos"], key=lambda x: x["pval"])[:8]:
            rows_top.append(dict(rsid=rsid, gene=gene, variant=vid, phenocode=p["phenocode"],
                                 phenotype=p["phenostring"],
                                 OR=round(math.exp(p["beta"]), 3) if p.get("beta") is not None else "",
                                 pval=p["pval"], af=p.get("af", "")))
    colsA = ["rsid", "gene", "group", "note", "variant", "effect_allele", "phenocode", "phenotype", "af",
             "imp_r2", "cases", "controls", "OR", "CI95", "pval", "sig", "MDE_OR", "status"]
    write_tsv("A_candidate_snps.tsv", rowsA, colsA)
    write_tsv("A_candidate_snps_top_phenotypes.tsv", rows_top,
              ["rsid", "gene", "variant", "phenocode", "phenotype", "OR", "pval", "af"])
    print(f"[A] tests={n_tests_A}, Bonferroni threshold={thr_A:.2e}")

    # ---- B) 候補遺伝子領域のスキャン ----
    genes = get_genes()
    regs = merge_regions(genes)
    write_tsv("B_regions.tsv", regs, ["family", "label", "chrom", "start", "end", "genes"])
    print(f"[B] genes={len(genes)} regions={len(regs)}")
    rowsB = []
    for k, r in enumerate(regs, 1):
        for code in REGION_PHENOS:
            try:
                vs = region_variants(code, r["chrom"], r["start"], r["end"])
            except Exception as e:
                print("  skip", r["label"], code, e, file=sys.stderr); continue
            vs = [x for x in vs if x["pvalue"] is not None
                  and MIN_AF <= x["af"] <= 1 - MIN_AF and (x.get("r2") or 0) >= MIN_R2]
            if not vs:
                rowsB.append(dict(family=r["family"], region=r["label"], chrom=r["chrom"], start=r["start"],
                                  end=r["end"], phenocode=code, n_variants=0)); continue
            best = min(vs, key=lambda x: x["pvalue"])
            n = len(vs)
            rowsB.append(dict(
                family=r["family"], region=r["label"], chrom=r["chrom"], start=r["start"], end=r["end"],
                phenocode=code, phenotype=REGION_PHENOS[code], n_variants=n,
                lead=best.get("rsid") or best["id"], lead_pos=best["position"],
                lead_nearest=best.get("nearest_genes"), lead_af=best["af"],
                lead_OR=round(math.exp(best["beta"]), 3), lead_p=best["pvalue"],
                region_p_bonf=min(1.0, best["pvalue"] * n),
                n_p_lt_5e8=sum(x["pvalue"] < 5e-8 for x in vs)))
        if k % 10 == 0:
            print(f"  {k}/{len(regs)} regions done", flush=True)
    # FDR は「対象 5 疾患 × 領域」の範囲で計算する（探索的・陽性対照は別枠）
    for scope in (set(TARGET), set(EXPLORATORY), set(POSITIVE_CONTROL)):
        idx = [i for i, r in enumerate(rowsB) if r["phenocode"] in scope and r.get("n_variants")]
        q = bh([rowsB[i]["region_p_bonf"] for i in idx])
        for i, qq in zip(idx, q):
            rowsB[i]["fdr_q"] = qq
    colsB = ["family", "region", "chrom", "start", "end", "phenocode", "phenotype", "n_variants", "lead",
             "lead_pos", "lead_nearest", "lead_af", "lead_OR", "lead_p", "region_p_bonf", "fdr_q", "n_p_lt_5e8"]
    rowsB.sort(key=lambda r: (r.get("fdr_q", 9), r.get("lead_p", 9)))
    write_tsv("B_region_scan.tsv", rowsB, colsB)

    # ---- 検出力：ALS・認知症を想定したシナリオ ----
    rows_pw = []
    n_ctrl = 150_000
    for label, n_case in (("ALS（BBJ 登録 782 例）", 782), ("認知症（仮定）", 500), ("認知症（仮定）", 1000),
                          ("認知症（仮定）", 3000), ("脳出血（PheWeb）", 1456), ("脳梗塞（PheWeb）", 22664)):
        for maf in (0.05, 0.25, 0.42):
            neff = n_case * n_ctrl / (n_case + n_ctrl)
            se = 1 / math.sqrt(2 * maf * (1 - maf) * neff)
            rows_pw.append(dict(scenario=label, cases=n_case, controls=n_ctrl, maf=maf,
                                MDE_OR_bonf=round(math.exp((z_thr_A + Z_A_80) * se), 3),
                                MDE_OR_p05=round(math.exp((1.96 + Z_A_80) * se), 3)))
    write_tsv("C_power.tsv", rows_pw, ["scenario", "cases", "controls", "maf", "MDE_OR_bonf", "MDE_OR_p05"])
    print("done")


if __name__ == "__main__":
    main()
