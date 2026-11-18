const path = require("path");
const { THEME, HEX, newDeck, card, bullets, tableRows } = require("./common");
const { applyTheme } = require(process.env.SKILL_DIR + "/scripts/apply_theme.js");

const OUT = process.argv[2];
const DECK = "先行研究レビュー｜味覚・嗅覚・アルコール代謝遺伝子と脳神経疾患";
const { pres, C } = newDeck(DECK);

// ---------- 1. タイトル ----------
pres.addSection({ title: "導入" });
let s = pres.addSlide({ masterName: "TITLE", sectionTitle: "導入" });
s.addText("味覚・嗅覚・アルコール代謝遺伝子と脳神経疾患", { placeholder: "title" });
s.addText("先行研究レビュー（BBJ 研究準備）\n2026-11-18｜PubMed（NCBI E-utilities）検索に基づく", { placeholder: "body" });
s.addNotes("BBJ を用いた候補遺伝子研究の準備として実施した文献調査の結果。抄録レベルの確認であり、引用前に全文を確認すること。");

// ---------- 2. 結論 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "導入" });
s.addText("新規性は TAS2R38・OR にあり、ALDH2 は差別化が必要", { placeholder: "title" });
const W = 3.85, G = 0.3, X0 = 0.6, Y0 = 1.6, H = 4.6;
card(s, pres, C, { name: "taste", x: X0, y: Y0, w: W, h: H, badge: "味", badgeColor: C.accent2,
  head: "TAS2R38｜新規性 高", body: bullets([
    "日本人の大規模疾患研究は見当たらない",
    "Su 2026：taster 型で AD リスク低下、MGAM を介したリポジショニングを提唱",
    "日本人の PAV/AVI 頻度は 0.58/0.42",
  ]) });
card(s, pres, C, { name: "olf", x: X0 + W + G, y: Y0, w: W, h: H, badge: "嗅", badgeColor: C.accent5,
  head: "OR｜新規性 高・難", body: bullets([
    "嗅覚低下は認知症の早期マーカー（地域コホートで再現）",
    "日本人で遺伝子レベルの報告はほぼない",
    "CNV・偽遺伝子が多く、アレイでは捉えにくい → WGS が前提",
  ]) });
card(s, pres, C, { name: "alc", x: X0 + 2 * (W + G), y: Y0, w: W, h: H, badge: "酒", badgeColor: C.accent1,
  head: "ALDH2 等｜既報 多", body: bullets([
    "BBJ でも PheWAS 済み（Matoba 2020、Sakaue 2021）",
    "AD との関連は一貫しない。脳卒中は MR で確立",
    "差別化：オミクス媒介・希少バリアント・交互作用・MR",
  ]) });

// ---------- 3. 位置づけ ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "導入" });
s.addText("小規模コホートの限界を BBJ の規模で克服する", { placeholder: "title" });
const steps = [
  ["これまで", "約 100 例の小規模コホートで、ワイン嗜好と味覚・嗅覚・アルコール代謝 SNP を解析", C.accent4],
  ["課題", "統計学的検出力の不足と、特定疾患の患者リクルートの困難", C.accent3],
  ["本研究", "BBJ（最大 約 27 万人）の SNP アレイ・WGS・プロテオーム・メタボローム", C.accent1],
  ["対象", "脳梗塞、脳動脈瘤・SAH、てんかん、認知症、ALS、脳出血", C.accent2],
];
steps.forEach(([h, b, col], i) => {
  const x = 0.6 + i * 3.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 2.75, h: 3.3, rectRadius: 0.12, fill: { color: C.background2 },
    line: { color: C.background2 }, objectName: `step ${i + 1} card` });
  s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 2.25, w: 0.6, h: 0.6, fill: { color: col }, line: { color: col },
    objectName: `step ${i + 1} badge` });
  s.addText(String(i + 1), { x: x + 0.25, y: 2.25, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.background1,
    align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: `step ${i + 1} number` });
  s.addText(h, { x: x + 1.0, y: 2.25, w: 1.6, h: 0.6, fontSize: 20, bold: true, color: C.text2, valign: "middle",
    margin: 0, isTextBox: true, objectName: `step ${i + 1} head` });
  s.addText(b, { x: x + 0.25, y: 3.1, w: 2.3, h: 2.0, fontSize: 16, color: C.text1, valign: "top", margin: 0,
    isTextBox: true, objectName: `step ${i + 1} body` });
  if (i < steps.length - 1) {
    s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 2.8, y: 3.6, w: 0.3, h: 0.4, fill: { color: C.accent4 },
      line: { color: C.accent4 }, objectName: `arrow ${i + 1}` });
  }
});
s.addText("後ろ向き横断研究：候補遺伝子 PheWAS ＋ マルチオミックス統合解析", { x: 0.6, y: 5.8, w: 12.1, h: 0.5,
  fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "design caption" });

// ---------- 4. TAS2R38 ----------
pres.addSection({ title: "味覚" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "味覚" });
s.addText("TAS2R38：欧米で AD・PD との関連、日本人の報告はない", { placeholder: "title" });
s.addTable(tableRows(C, ["文献", "対象", "主な結果", "示唆"], [
  ["Su 2026\nFront Aging Neurosci", "ADNI / ROSMAP / NACC", "supertaster で AD リスク低下。nontaster アレルが脳の MGAM 発現を上げる", "リポジショニングの根拠"],
  ["Joseph 2024\nSci Rep", "アフリカ系米国人", "味覚関連遺伝子の SNP が AD と関連", "非欧米集団でも関連"],
  ["Yamaki 2023\nJ Nutr Sci Vitaminol", "ToMMo 2KJPN\n（n = 2,047）", "AVI/PAV = 0.42/0.58。飲酒頻度・野菜摂取と関連なし", "ハプロタイプで解析"],
  ["Cossu 2018\nMov Disord", "パーキンソン病", "PROP 味覚障害と nontaster 型が関連", "神経変性疾患へ拡張"],
], { size: 13 }), { x: 0.6, y: 1.5, w: 12.1, colW: [2.4, 2.4, 4.6, 2.7], rowH: 0.85,
  border: { type: "solid", pt: 0.5, color: HEX.lt2 }, objectName: "TAS2R38 evidence table" });
s.addText("PMID：41858791 / 39284855 / 37940575 / 29575306", { x: 0.6, y: 6.4, w: 12.1, h: 0.35, fontSize: 11,
  color: C.accent4, margin: 0, isTextBox: true, objectName: "PMIDs" });

// ---------- 5. Su 2026 の機序 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "味覚" });
s.addText("Su 2026：TAS2R38 → MGAM → 既存薬の転用という仮説", { placeholder: "title" });
const chain = [
  ["TAS2R38\nnontaster アレル", C.accent5],
  ["脳の MGAM\n発現 ↑（eQTL）", C.accent1],
  ["タウ蓄積 ↑\nミトコンドリア障害", C.accent6],
  ["MGAM 阻害薬\nアカルボース・ミグリトール", C.accent2],
];
chain.forEach(([t, col], i) => {
  const x = 0.6 + i * 3.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 2.75, h: 1.5, rectRadius: 0.12, fill: { color: col },
    line: { color: col }, objectName: `chain ${i + 1}` });
  s.addText(t, { x: x + 0.15, y: 1.6, w: 2.45, h: 1.5, fontSize: 16, bold: true, color: C.background1, align: "center",
    valign: "middle", margin: 0, isTextBox: true, objectName: `chain ${i + 1} text` });
  if (i < chain.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 2.8, y: 2.15, w: 0.3, h: 0.4,
    fill: { color: C.accent4 }, line: { color: C.accent4 }, objectName: `chain arrow ${i + 1}` });
});
card(s, pres, C, { name: "su result", x: 0.6, y: 3.5, w: 5.9, h: 3.2, head: "報告された結果",
  body: bullets(["ADNI：supertaster は加齢に伴う AD リスクが低い（p < 0.001）",
    "ROSMAP：nontaster で MGAM の発現 ↑、MGAM はタウ量と相関",
    "NACC：MGAM 阻害薬の服用群で CDR の進行が緩やか（p < 0.01）"]) });
card(s, pres, C, { name: "su bbj", x: 6.8, y: 3.5, w: 5.9, h: 3.2, head: "BBJ で検証できること", headColor: C.accent2,
  body: bullets(["日本人での TAS2R38 ハプロタイプ × 認知症の関連",
    "服薬情報（α-GI）× 遺伝型 × 認知症の交互作用",
    "プロテオームによる MGAM の pQTL 確認"]) });

// ---------- 6. 嗅覚 ----------
pres.addSection({ title: "嗅覚" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "嗅覚" });
s.addText("嗅覚低下は認知症の早期マーカー、遺伝子は技術的な難所", { placeholder: "title" });
card(s, pres, C, { name: "olf clin", x: 0.6, y: 1.5, w: 5.9, h: 4.6, badge: "臨", badgeColor: C.accent5,
  head: "臨床・疫学", body: bullets([
    "Devanand 2015 Neurology：嗅覚識別能の低下が認知機能低下と AD を予測",
    "Windon 2020、Sun 2012（SR）、Liao 2024（総説）：早期マーカーとして支持",
    "日本人：Kouzuki 2018、DESK study 2022 → 嗅覚・味覚障害を報告、遺伝子の検討なし",
  ]) });
card(s, pres, C, { name: "olf gen", x: 6.8, y: 1.5, w: 5.9, h: 4.6, badge: "遺", badgeColor: C.accent1,
  head: "遺伝学", body: bullets([
    "Förster 2025 Nat Commun、Imtiaz 2025：嗅覚識別能・嗅覚障害の GWAS メタ解析 → 候補座位",
    "Shaw 2011 Neurology：OR 遺伝子のコピー数が AD の発症年齢と関連",
    "Young 2008、Hasin 2008：OR 遺伝子群は CNV・分離偽遺伝子が非常に多い",
    { text: "→ SNP アレイ・インピュテーションの限界。WGS と遺伝子単位の検定が前提", options: { bold: true, color: C.accent1 } },
  ]) });

// ---------- 7. ALDH2 / ADH1B ----------
pres.addSection({ title: "アルコール代謝" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "アルコール代謝" });
s.addText("ALDH2 rs671：脳卒中は確立、認知症は未確定", { placeholder: "title" });
card(s, pres, C, { name: "aldh dem", x: 0.6, y: 1.5, w: 5.9, h: 4.6, badge: "認", badgeColor: C.accent3,
  head: "認知症・AD｜結果が一貫しない", body: bullets([
    "Wang 2024 Nat Commun：剖検脳 469 例でアミロイド斑 ↑、ただし AD の独立した危険因子ではない",
    "Ueno 2022、Chen 2019：日本人を含むメタ解析で結果がばらつく",
    "Tokiya 2024：日本人で MCI のリスク ↑（横断研究）",
    "Seike 2023（総説）：ALDH2*2 × 飲酒で AD 様の病態が悪化（マウス）",
  ]) });
card(s, pres, C, { name: "aldh cvd", x: 6.8, y: 1.5, w: 5.9, h: 4.6, badge: "脳", badgeColor: C.accent2,
  head: "脳血管疾患・てんかん｜MR の根拠", body: bullets([
    "Millwood 2019 Lancet（CKB 50 万人）：飲酒は脳卒中、特に脳出血を用量依存的に増やす",
    "Im 2023 Nat Med：200 以上の疾患を対象にした遺伝学的解析 → PheWAS 型デザインの先行例",
    "Chen 2025：脳動脈瘤の破裂 ↓／Lin 2021：ADH1B × 脳出血",
    "Yang 2014：rs671 と脳卒中後てんかん（報告は少ない）",
  ]) });

// ---------- 8. BBJ の先行研究と症例数 ----------
pres.addSection({ title: "BBJ" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "BBJ" });
s.addText("認知症と脳出血は BBJ の対象 47 疾患に含まれない", { placeholder: "title" });
s.addChart(pres.charts.BAR, [{ name: "症例数", labels: ["脳梗塞", "脳動脈瘤", "てんかん", "ALS"],
  values: [16534, 2710, 2303, 782] }], {
  x: 0.6, y: 1.5, w: 7.0, h: 4.0, barDir: "bar", showTitle: true, title: "BBJ 第1コホートのベースライン症例数（Nagai 2017）",
  titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt", chartColors: [HEX.accent1], showValue: true,
  dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFormatCode: "#,##0",
  dataLabelFontFace: "+mn-lt", catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
  valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisOrientation: "maxMin",
  showLegend: false, objectName: "BBJ case counts chart",
});
s.addText("認知症・脳出血：対象 47 疾患外 → 既往歴・合併症欄での症例数を BBJ に要照会", { x: 0.6, y: 5.7, w: 7.0, h: 0.9, fontSize: 13, bold: true, color: C.accent6,
  margin: 0, valign: "middle", isTextBox: true, objectName: "not target note" });
card(s, pres, C, { name: "bbj prior", x: 8.0, y: 1.5, w: 4.7, h: 5.1, head: "BBJ で既に実施された研究", body: bullets([
  "Matoba 2020：16.5 万人の食習慣 GWAS（ADH1B, ALDH2, ALDH1B1, ALDH1A1）＋ PheWAS",
  "Sakaue 2021：220 形質の GWAS、サマリー統計は公開済み",
  "Kojima 2025、Dofuku 2023：脳卒中 PRS、頭蓋内動脈狭窄",
  { text: "→ ALDH2 × 疾患は一部が既報", options: { bold: true, color: C.accent1 } },
]) });

// ---------- 9. マルチオミックス ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "BBJ" });
s.addText("オミクスは一部の参加者だけ、WGS の規模は要照会", { placeholder: "title" });
const stats = [["3,050 人", "プロテオーム", "血清。Olink Explore 3072 / Target 96 / SomaScan", C.accent1],
  ["40,907 人", "NMR メタボローム", "Nightingale。脂質・アミノ酸が中心で、アルデヒド類は測定外", C.accent5],
  ["要照会", "WGS", "公開情報では BBJ の WGS の規模を確認できず", C.accent6]];
stats.forEach(([n, l, d, col], i) => {
  const x = 0.6 + i * 4.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 3.85, h: 3.4, rectRadius: 0.12, fill: { color: C.background2 },
    line: { color: C.background2 }, objectName: `omics ${i + 1} card` });
  s.addText(n, { x: x + 0.3, y: 1.85, w: 3.25, h: 1.1, fontSize: 36, bold: true, color: col, margin: 0, valign: "middle",
    isTextBox: true, objectName: `omics ${i + 1} number` });
  s.addText(l, { x: x + 0.3, y: 3.0, w: 3.25, h: 0.5, fontSize: 18, bold: true, color: C.text2, margin: 0,
    isTextBox: true, objectName: `omics ${i + 1} label` });
  s.addText(d, { x: x + 0.3, y: 3.6, w: 3.25, h: 1.2, fontSize: 14, color: C.text1, margin: 0, valign: "top",
    isTextBox: true, objectName: `omics ${i + 1} desc` });
});
s.addText(bullets(["人数は公開情報からの概数。疾患の症例のうちオミクスが測られている人は限られる（特に ALS・認知症）",
  "バリアント → タンパク・代謝物：全員での pQTL / mQTL として解析する",
  "タンパク・代謝物 → 疾患：MR・colocalization・媒介分析として組み立てる"], 14),
  { x: 0.6, y: 5.25, w: 12.1, h: 1.5, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "omics implications" });

// ---------- 10. 新規性マップ ----------
pres.addSection({ title: "まとめ" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "まとめ" });
s.addText("新規性の評価：遺伝子群ごとの既報の量と勝ち筋", { placeholder: "title" });
const hi = { color: HEX.accent2, bold: true }, mid = { color: HEX.accent3, bold: true };
s.addTable(tableRows(C, ["遺伝子群", "日本人での既報", "新規性", "勝ち筋"], [
  ["TAS2R38 / TAS2R", "ほぼなし", { text: "高", options: hi }, "Su 2026 の日本人での再現、MGAM・α-GI の視点"],
  ["OR ファミリー", "ほぼなし", { text: "高（技術的に難）", options: hi }, "WGS による遺伝子単位のバーデン検定、CNV の考慮"],
  ["ALDH2 / ADH1B", "多い（BBJ で PheWAS 済み）", { text: "中〜低", options: mid }, "オミクス媒介・希少バリアント・交互作用・MR"],
], { size: 15, headSize: 15 }), { x: 0.6, y: 1.6, w: 12.1, colW: [2.6, 3.0, 2.0, 4.5], rowH: 1.1,
  border: { type: "solid", pt: 0.5, color: HEX.lt2 }, objectName: "novelty table" });
s.addText("ALS・認知症は日本人の大規模データが少なく、症例数が確保できれば最大の付加価値になる", { x: 0.6, y: 5.9, w: 12.1,
  h: 0.6, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "novelty caption" });

// ---------- 11. 次のステップ ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "まとめ" });
s.addText("計画書の確認事項と次のステップ", { placeholder: "title" });
card(s, pres, C, { name: "check", x: 0.6, y: 1.5, w: 5.9, h: 4.6, badge: "!", badgeColor: C.accent3,
  head: "方法論の確認事項", body: bullets([
    "飲酒歴は rs671 / rs1229984 の媒介因子 → 主解析の共変量から外す",
    "PC は 1〜10 にし、SAIGE / REGENIE で症例と対照の不均衡に対応",
    "多重検定：事前仮説（Bonferroni）と探索（FDR）を分ける",
    "6 疾患だけなら「PheWAS」という呼称は要検討",
  ]) });
card(s, pres, C, { name: "next", x: 6.8, y: 1.5, w: 5.9, h: 4.6, badge: "→", badgeColor: C.accent2,
  head: "次のステップ", body: bullets([
    "BBJ に照会：認知症・脳出血の症例数、WGS・オミクスの対象者",
    "公開サマリー統計で候補 SNP を予備解析（実施済み → 別資料）",
    "解析計画の事前登録（OSF など）",
    "引用文献の全文確認",
  ]) });

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
