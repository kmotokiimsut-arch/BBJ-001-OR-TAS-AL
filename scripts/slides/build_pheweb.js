const { THEME, HEX, newDeck, card, bullets, tableRows } = require("./common");
const { applyTheme } = require(process.env.SKILL_DIR + "/scripts/apply_theme.js");

const OUT = process.argv[2];
const DECK = "予備解析｜BBJ 公開サマリー統計（PheWeb）による候補遺伝子の検討";
const { pres, C } = newDeck(DECK);

// フォレストプロット（図形で描画、対数軸）
function forest(slide, rows, o) {
  const { x, y, w, rowH, lo, hi, ticks, labelW, textW } = o;
  const px = x + labelW, pw = w - labelW - textW;
  const pos = (v) => px + (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * pw;
  const yEnd = y + rowH * rows.length;
  // OR = 1 の基準線
  slide.addShape(pres.shapes.LINE, { x: pos(1), y: y - 0.1, w: 0, h: yEnd - y + 0.1,
    line: { color: HEX.accent4, width: 1, dashType: "dash" }, objectName: "forest null line" });
  slide.addShape(pres.shapes.LINE, { x: px, y: yEnd, w: pw, h: 0, line: { color: HEX.accent4, width: 1 },
    objectName: "forest axis" });
  ticks.forEach((t) => {
    slide.addText(t.toFixed(1), { x: pos(t) - 0.4, y: yEnd + 0.05, w: 0.8, h: 0.3, fontSize: 12, align: "center",
      color: C.accent4, margin: 0, isTextBox: true, objectName: `tick ${t}` });
  });
  slide.addText(o.axisLabel, { x: px, y: yEnd + 0.35, w: pw, h: 0.3, fontSize: 12, align: "center", color: C.accent4,
    margin: 0, isTextBox: true, objectName: "forest axis label" });
  slide.addText("OR (95%CI)　P", { x: px + pw + 0.2, y: y - 0.45, w: textW - 0.2, h: 0.35, fontSize: 12, bold: true,
    color: C.accent4, margin: 0, isTextBox: true, objectName: "forest stat header" });
  rows.forEach((r, i) => {
    const cy = y + rowH * i + rowH / 2;
    const col = r.sig === "B" ? HEX.accent2 : r.sig === "n" ? HEX.accent3 : HEX.accent4;
    slide.addText(r.label, { x, y: cy - rowH / 2, w: labelW - 0.15, h: rowH, fontSize: 15, color: C.text1,
      valign: "middle", margin: 0, isTextBox: true, objectName: `row ${i + 1} label` });
    slide.addShape(pres.shapes.LINE, { x: pos(r.l), y: cy, w: pos(r.u) - pos(r.l), h: 0, line: { color: col, width: 2.5 },
      objectName: `row ${i + 1} ci` });
    const d = 0.13 + Math.min(0.12, r.n ? Math.log10(r.n) * 0.025 : 0.05);
    slide.addShape(pres.shapes.DIAMOND, { x: pos(r.or) - d, y: cy - d, w: 2 * d, h: 2 * d, fill: { color: col },
      line: { color: col }, objectName: `row ${i + 1} point` });
    slide.addText([{ text: `${r.or.toFixed(2)} (${r.l.toFixed(2)}–${r.u.toFixed(2)})　`, options: {} },
      { text: r.p, options: { bold: r.sig === "B", color: r.sig === "B" ? C.accent2 : C.text1 } }],
      { x: px + pw + 0.2, y: cy - rowH / 2, w: textW - 0.2, h: rowH, fontSize: 14, color: C.text1, valign: "middle",
        margin: 0, isTextBox: true, objectName: `row ${i + 1} stats` });
  });
}

function legend(slide, x, y) {
  [["Bonferroni 有意", HEX.accent2], ["名目上 P < 0.05", HEX.accent3], ["有意差なし", HEX.accent4]].forEach(([t, c], i) => {
    slide.addShape(pres.shapes.DIAMOND, { x: x + i * 2.3, y: y + 0.07, w: 0.22, h: 0.22, fill: { color: c }, line: { color: c },
      objectName: `legend ${i + 1} mark` });
    slide.addText(t, { x: x + i * 2.3 + 0.3, y, w: 1.9, h: 0.36, fontSize: 12, color: C.text1, valign: "middle", margin: 0,
      isTextBox: true, objectName: `legend ${i + 1} text` });
  });
}

// ---------- 1. タイトル ----------
pres.addSection({ title: "導入" });
let s = pres.addSlide({ masterName: "TITLE", sectionTitle: "導入" });
s.addText("BBJ 公開サマリー統計による候補遺伝子の予備解析", { placeholder: "title" });
s.addText("味覚・嗅覚・アルコール代謝遺伝子 × 脳神経疾患\n2026-11-18｜データ：BBJ PheWeb（pheweb.jp, GRCh37）｜個票データは不使用", { placeholder: "body" });

// ---------- 2. 結論 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "導入" });
s.addText("確かなシグナルは ALDH2 のみ、味覚・嗅覚は効果が小さい", { placeholder: "title" });
[["3 疾患", "ALDH2 rs671 が Bonferroni 有意", "脳梗塞 OR 0.90・脳出血 0.80・てんかん 0.85。てんかんは新規知見の候補", C.accent2],
 ["0 件", "OR / TAS2R / TAS1R の FDR 有意", "対象 5 疾患では FDR 有意な領域なし。効果は OR 1.05 未満と小さい", C.accent4],
 ["2 疾患", "ALS・認知症は公開データなし", "個票データの申請が必須で、本研究の最大の付加価値になる", C.accent6]].forEach(([n, h, d, col], i) => {
  const x = 0.6 + i * 4.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 3.85, h: 4.2, rectRadius: 0.12, fill: { color: C.background2 },
    line: { color: C.background2 }, objectName: `kpi ${i + 1} card` });
  s.addText(n, { x: x + 0.3, y: 1.9, w: 3.25, h: 1.3, fontSize: 54, bold: true, color: col, margin: 0, valign: "middle",
    isTextBox: true, objectName: `kpi ${i + 1} number` });
  s.addText(h, { x: x + 0.3, y: 3.3, w: 3.25, h: 0.9, fontSize: 18, bold: true, color: C.text2, margin: 0, valign: "top",
    isTextBox: true, objectName: `kpi ${i + 1} head` });
  s.addText(d, { x: x + 0.3, y: 4.3, w: 3.25, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top",
    isTextBox: true, objectName: `kpi ${i + 1} desc` });
});
s.addText("TAS2R38 の苦味を感じやすい型（PAV）は飲酒経験者がやや少ない（P ≈ 2×10⁻⁵）→ ワイン嗜好研究とつながる", {
  x: 0.6, y: 6.1, w: 12.1, h: 0.45, fontSize: 15, italic: true, color: C.accent1, margin: 0, isTextBox: true,
  objectName: "summary caption" });

// ---------- 3. 方法 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "導入" });
s.addText("方法：候補 SNP の PheWAS と遺伝子領域のスキャン", { placeholder: "title" });
const flow = [["入力", "候補 15 SNP（文献で機能が既知）\n候補 460 遺伝子 → 101 領域\n（OR 406・TAS2R 25・ALDH 19・ADH 7・TAS1R 3、±50 kb）", C.accent5],
  ["データ", "BBJ PheWeb の公開 API\n対象 5 疾患 ＋ PD（探索）\n＋ 飲酒歴（陽性対照）", C.accent1],
  ["フィルター", "アレル頻度 ≥ 0.005\nインピュテーション r² ≥ 0.7", C.accent3],
  ["多重検定", "SNP：75 検定で Bonferroni\n（P < 6.7×10⁻⁴）\n領域：最小 P × バリアント数\n→ BH-FDR", C.accent2]];
flow.forEach(([h, b, col], i) => {
  const x = 0.6 + i * 3.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 2.75, h: 4.4, rectRadius: 0.12, fill: { color: C.background2 },
    line: { color: C.background2 }, objectName: `flow ${i + 1} card` });
  s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 1.85, w: 0.6, h: 0.6, fill: { color: col }, line: { color: col },
    objectName: `flow ${i + 1} badge` });
  s.addText(String(i + 1), { x: x + 0.25, y: 1.85, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.background1, align: "center",
    valign: "middle", margin: 0, isTextBox: true, objectName: `flow ${i + 1} number` });
  s.addText(h, { x: x + 1.0, y: 1.85, w: 1.6, h: 0.6, fontSize: 20, bold: true, color: C.text2, valign: "middle", margin: 0,
    isTextBox: true, objectName: `flow ${i + 1} head` });
  s.addText(b, { x: x + 0.25, y: 2.7, w: 2.35, h: 3.1, fontSize: 14, color: C.text1, valign: "top", margin: 0,
    paraSpaceAfter: 6, isTextBox: true, objectName: `flow ${i + 1} body` });
  if (i < flow.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 2.8, y: 3.6, w: 0.3, h: 0.4,
    fill: { color: C.accent4 }, line: { color: C.accent4 }, objectName: `flow arrow ${i + 1}` });
});
s.addText("スクリプト：scripts/pilot/pilot_bbj_pheweb.py｜結果：docs/pilot/*.tsv", { x: 0.6, y: 6.3, w: 12.1, h: 0.4,
  fontSize: 12, color: C.accent4, margin: 0, isTextBox: true, objectName: "method source" });

// ---------- 4. データの有無 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "導入" });
s.addText("公開データで解析できたのは 5 疾患、ALS と認知症はなし", { placeholder: "title" });
s.addChart(pres.charts.BAR, [{ name: "症例数", labels: ["脳梗塞", "脳動脈瘤", "てんかん", "脳出血", "クモ膜下出血", "パーキンソン病"],
  values: [22664, 3132, 2466, 1456, 1203, 340] }], {
  x: 0.6, y: 1.5, w: 7.4, h: 5.2, barDir: "bar", showTitle: true, title: "BBJ PheWeb の症例数（対照 約 15〜18 万人）",
  titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt", chartColors: [HEX.accent1], showValue: true,
  dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFormatCode: "#,##0",
  dataLabelFontFace: "+mn-lt", catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
  valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisOrientation: "maxMin",
  showLegend: false, objectName: "PheWeb case counts chart",
});
card(s, pres, C, { name: "missing", x: 8.4, y: 1.5, w: 4.3, h: 5.2, badge: "×", badgeColor: C.accent6,
  head: "公開 GWAS がない疾患", headColor: C.accent6, body: bullets([
    "ALS：BBJ 登録は 782 例あるが、公開されていない",
    "認知症：BBJ の対象 47 疾患に含まれない",
    { text: "→ この 2 疾患は個票データの申請が必須", options: { bold: true, color: C.accent1 } },
    "パーキンソン病（340 例）は探索的に追加した",
  ]) });

// ---------- 5. rs671 ----------
pres.addSection({ title: "候補 SNP" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "候補 SNP" });
s.addText("ALDH2*2 は脳梗塞・脳出血・てんかんのリスク低下と関連", { placeholder: "title" });
s.addText("ALDH2 rs671（効果アレル A = ALDH2*2、不活性型、頻度 0.25）", { x: 0.6, y: 1.3, w: 12.1, h: 0.4, fontSize: 15,
  bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "rs671 subtitle" });
forest(s, [
  { label: "脳梗塞", or: 0.896, l: 0.873, u: 0.919, p: "2×10⁻¹⁸", sig: "B", n: 22664 },
  { label: "脳出血", or: 0.795, l: 0.727, u: 0.868, p: "2×10⁻⁷", sig: "B", n: 1456 },
  { label: "てんかん", or: 0.852, l: 0.797, u: 0.911, p: "5.9×10⁻⁶", sig: "B", n: 2466 },
  { label: "脳動脈瘤", or: 0.933, l: 0.878, u: 0.992, p: "0.024", sig: "n", n: 3132 },
  { label: "クモ膜下出血", or: 0.908, l: 0.824, u: 0.999, p: "0.046", sig: "n", n: 1203 },
  { label: "PD（探索的）", or: 0.905, l: 0.759, u: 1.079, p: "0.25", sig: "", n: 340 },
], { x: 0.6, y: 2.3, w: 9.1, rowH: 0.6, lo: 0.7, hi: 1.15, ticks: [0.7, 0.8, 0.9, 1.0, 1.1], labelW: 1.9, textW: 3.2,
  axisLabel: "オッズ比（対数軸）" });
legend(s, 0.6, 6.55);
card(s, pres, C, { name: "rs671 interp", x: 9.9, y: 2.0, w: 2.8, h: 4.4, head: "解釈", body: bullets([
  "CKB の MR と同じ方向 → 飲酒の減少を介した効果",
  "てんかんの報告は少なく、新規知見の候補",
  "12q24 は LD が長い → 条件付き解析で確認",
], 14), bodySize: 14 });

// ---------- 6. TAS2R38 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "候補 SNP" });
s.addText("TAS2R38：脳血管疾患とは関連なし、PD と飲酒に弱い傾向", { placeholder: "title" });
s.addText("TAS2R38 rs10246939（効果アレル C = PAV 型 = 苦味を感じやすい taster、頻度 0.57）", { x: 0.6, y: 1.3, w: 12.1,
  h: 0.4, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "tas2r38 subtitle" });
forest(s, [
  { label: "脳梗塞", or: 1.010, l: 0.989, u: 1.032, p: "0.34", sig: "", n: 22664 },
  { label: "脳動脈瘤", or: 1.001, l: 0.951, u: 1.053, p: "0.98", sig: "", n: 3132 },
  { label: "クモ膜下出血", or: 1.016, l: 0.936, u: 1.103, p: "0.71", sig: "", n: 1203 },
  { label: "脳出血", or: 1.044, l: 0.969, u: 1.125, p: "0.26", sig: "", n: 1456 },
  { label: "てんかん", or: 0.995, l: 0.940, u: 1.053, p: "0.86", sig: "", n: 2466 },
  { label: "PD（探索的）", or: 0.827, l: 0.710, u: 0.964, p: "0.016", sig: "n", n: 340 },
], { x: 0.6, y: 2.3, w: 9.1, rowH: 0.6, lo: 0.7, hi: 1.15, ticks: [0.7, 0.8, 0.9, 1.0, 1.1], labelW: 1.9, textW: 3.2,
  axisLabel: "オッズ比（対数軸）" });
legend(s, 0.6, 6.55);
card(s, pres, C, { name: "tas interp", x: 9.9, y: 2.0, w: 2.8, h: 4.4, head: "読み取れること", body: bullets([
  "3 つの SNP の方向はすべて一致",
  "PD：PAV で OR 0.83。nontaster 型が多いという報告と同じ方向",
  "飲酒歴：PAV で経験者がやや少ない（P ≈ 2×10⁻⁵）",
], 14) });

// ---------- 7. その他の名目上のシグナル ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "候補 SNP" });
s.addText("その他は名目上の P < 0.05 にとどまる", { placeholder: "title" });
s.addTable(tableRows(C, ["SNP（遺伝子）", "効果アレル", "疾患", "OR (95%CI)", "P"], [
  ["rs1229984（ADH1B）", "C = Arg48（ADH1B*1、低活性型）", "クモ膜下出血", "1.14 (1.03–1.26)", "0.0099"],
  ["rs3043（ALDH1B1）", "C", "脳動脈瘤", "0.94 (0.89–1.00)", "0.035"],
  ["rs72921001（OR6A2 近傍）", "A", "てんかん", "0.91 (0.86–0.97)", "0.0041"],
  ["rs35874116（TAS1R2）", "C", "てんかん", "1.10 (1.00–1.20)", "0.043"],
  ["rs34160967（TAS1R1）", "A", "パーキンソン病", "1.21 (1.04–1.41)", "0.016"],
], { size: 14, headSize: 14 }), { x: 0.6, y: 1.5, w: 12.1, colW: [3.2, 3.6, 1.9, 2.2, 1.2], rowH: 0.55,
  border: { type: "solid", pt: 0.5, color: HEX.lt2 }, objectName: "nominal signals table" });
s.addText("いずれも 75 検定の Bonferroni（P < 6.7×10⁻⁴）は満たさない。個票データで再検証する候補として扱う", { x: 0.6, y: 5.9,
  w: 12.1, h: 0.6, fontSize: 15, italic: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "nominal caption" });

// ---------- 8. 領域スキャン ----------
pres.addSection({ title: "領域スキャン" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "領域スキャン" });
s.addText("領域スキャン：FDR 有意は 3 件、うち 1 件は隣の既知座位", { placeholder: "title" });
s.addTable(tableRows(C, ["領域", "疾患", "リードバリアント", "OR", "P", "FDR q"], [
  ["ALDH2", "脳梗塞", "rs671", "0.90", "2×10⁻¹⁸", "2×10⁻¹³"],
  ["ALDH2", "脳出血", "rs671", "0.80", "2×10⁻⁷", "0.008"],
  ["OR8U8..OR8U9（11p15.5）", "脳動脈瘤", "rs73392700（SIRT3 近傍）", "1.32", "4×10⁻¹²", "2×10⁻⁷"],
], { size: 14, headSize: 14 }), { x: 0.6, y: 1.5, w: 12.1, colW: [3.2, 1.6, 3.3, 1.0, 1.5, 1.5], rowH: 0.55,
  border: { type: "solid", pt: 0.5, color: HEX.lt2 }, objectName: "region hits table" });
card(s, pres, C, { name: "sirt3", x: 0.6, y: 3.9, w: 3.85, h: 2.8, badge: "!", badgeColor: C.accent3, head: "SIRT3 の混入",
  body: "11p15.5 のシグナルは OR 遺伝子ではなく、既知の動脈瘤座位 SIRT3 によるもの。±50 kb の窓は隣の遺伝子の座位を拾う", bodySize: 14 });
card(s, pres, C, { name: "gap", x: 4.75, y: 3.9, w: 3.85, h: 2.8, badge: "×", badgeColor: C.accent6, head: "8 領域は評価不可",
  body: "OR4F（サブテロメア）、OR11H1、OR9G9 などは、フィルターを通るバリアントが 0。アレイの限界を実データで確認 → WGS が必要", bodySize: 14 });
card(s, pres, C, { name: "mgam", x: 8.9, y: 3.9, w: 3.8, h: 2.8, badge: "+", badgeColor: C.accent2, head: "MGAM × 飲酒歴",
  body: "陽性対照の飲酒歴で TAS2R38–MGAM 領域（7q34）が FDR 0.009。MGAM は Su 2026 が挙げたリポジショニング標的", bodySize: 14 });

// ---------- 9. 検出力 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "領域スキャン" });
s.addText("ALS・認知症が千例規模なら、検出できるのは OR 1.2 以上", { placeholder: "title" });
s.addChart(pres.charts.BAR, [{ name: "検出可能な最小 OR", labels: ["脳梗塞 22,664 例", "認知症 3,000 例（仮定）", "脳出血 1,456 例",
  "認知症 1,000 例（仮定）", "ALS 782 例", "認知症 500 例（仮定）"], values: [1.051, 1.136, 1.200, 1.246, 1.282, 1.364] }], {
  x: 0.6, y: 1.5, w: 7.6, h: 5.2, barDir: "bar", showTitle: true,
  title: "80% の検出力で検出できる最小 OR（MAF 0.25、α = 6.7×10⁻⁴、対照 15 万人）", titleFontSize: 13, titleColor: HEX.dk2,
  titleFontFace: "+mn-lt", chartColors: [HEX.accent5], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12,
  dataLabelColor: HEX.dk1, dataLabelFormatCode: "0.00", dataLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12,
  catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMinVal: 1.0, valAxisMaxVal: 1.45,
  valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisOrientation: "maxMin", showLegend: false,
  objectName: "power chart",
});
card(s, pres, C, { name: "power interp", x: 8.5, y: 1.5, w: 4.2, h: 5.2, head: "観測された効果との比較", body: bullets([
  "ALDH2 × 脳出血（OR 0.80 → 逆数 1.26）程度の効果は、1,000 例でぎりぎり検出できる水準",
  "TAS2R38（OR 1.05 未満）は、どの疾患でも検出できない",
  { text: "→ 認知症は 3,000 例以上を目標に症例数を照会", options: { bold: true, color: C.accent1 } },
], 15) });

// ---------- 10. 示唆 ----------
pres.addSection({ title: "まとめ" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "まとめ" });
s.addText("本解析では ALDH2 × てんかんと TAS2R38 × 飲酒行動を軸に", { placeholder: "title" });
card(s, pres, C, { name: "priority", x: 0.6, y: 1.5, w: 5.9, h: 4.4, badge: "1", badgeColor: C.accent2, head: "仮説の優先順位", body: bullets([
  "確度が高い：ALDH2 rs671 × 脳梗塞・脳出血・てんかん（てんかんは新規性あり）",
  "探索的：TAS2R38 × 飲酒行動、PD・認知症 → 嗜好研究と疾患をつなぐ",
  "ALS・認知症：公開データがないことが最大の付加価値",
]) });
card(s, pres, C, { name: "todo", x: 6.8, y: 1.5, w: 5.9, h: 4.4, badge: "2", badgeColor: C.accent1, head: "次のステップ", body: bullets([
  "BBJ に照会：ALS・認知症・脳出血の症例数、WGS の有無",
  "rs671 × てんかん：飲酒歴で層別化、MR、条件付き解析",
  "OR 遺伝子：WGS による遺伝子単位の検定",
  "飲酒歴は媒介因子として扱う（主解析の共変量にしない）",
]) });

// ---------- 11. 限界 ----------
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "まとめ" });
s.addText("限界：公開値は BBJ の解析条件に依存する", { placeholder: "title" });
card(s, pres, C, { name: "limits", x: 0.6, y: 1.5, w: 12.1, h: 4.2, badge: "!", badgeColor: C.accent3, head: "解釈上の注意", body: bullets([
  "共変量・対照の定義は PheWeb の解析によるもので、本計画とは異なる",
  "飲酒形質は線形モデルの beta とみられる → 効果の方向だけを参照する。男女別の飲酒形質の値が全体と同一（API 側の問題の可能性）",
  "rs671・rs1229984 は飲酒 GWAS の variant API に収載がなく、陽性対照には γ-GTP・HDL-C と領域 API の結果を使った",
  "領域 P 値は単純な Bonferroni で保守的（LD を考慮した有効検定数 Meff は未使用）",
  "PD（340 例）の結果は探索的で、多重検定の補正後は有意でない",
]) });

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
