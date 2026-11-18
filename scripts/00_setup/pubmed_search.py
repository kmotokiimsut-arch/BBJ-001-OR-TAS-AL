"""PubMed を NCBI E-utilities 経由で検索する簡易スクリプト。
使い方: python3 scripts/00_setup/pubmed_search.py "TAS2R38 AND Alzheimer" "ALDH2 rs671 AND stroke"
各クエリの上位20件（関連度順）の PMID / 第一著者 / 年 / 雑誌 / タイトルを表示する。
"""
import sys, json, time, urllib.request, urllib.parse
B="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
def get(u):
    for i in range(3):
        try: return urllib.request.urlopen(u, timeout=30).read()
        except Exception as e: time.sleep(2)
    raise
for q in sys.argv[1:]:
    n="20"
    r=json.loads(get(B+"esearch.fcgi?"+urllib.parse.urlencode(dict(db="pubmed",term=q,retmax=n,retmode="json",sort="relevance"))))
    ids=r["esearchresult"]["idlist"]; print(f"\n### {q}  (hits={r['esearchresult']['count']})")
    if not ids: continue
    time.sleep(0.4)
    s=json.loads(get(B+"esummary.fcgi?"+urllib.parse.urlencode(dict(db="pubmed",id=",".join(ids),retmode="json"))))["result"]
    for i in ids:
        d=s[i]; au=d["authors"][0]["name"] if d["authors"] else ""
        print(f"PMID {i} | {au} | {d['pubdate'][:4]} | {d['source']} | {d['title']}")
    time.sleep(0.4)
