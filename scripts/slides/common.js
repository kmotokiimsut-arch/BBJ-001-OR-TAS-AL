// 2 つのデッキで共通のテーマ・レイアウト・部品
const pptxgen = require("pptxgenjs");

const THEME = {
  name: "BBJ Sensory Genomics",
  headFontFace: "Yu Gothic",
  bodyFontFace: "Yu Gothic",
  colors: {
    dk1: "1F1F24", lt1: "FFFFFF", dk2: "4A1830", lt2: "F3ECEF",
    accent1: "7B2D4A", // burgundy（ワイン）: 主色
    accent2: "2A8C82", // teal: 有意・ポジティブ
    accent3: "C08A1E", // amber: 注意
    accent4: "8A8A94", // gray: 非有意
    accent5: "3D5A80", // slate
    accent6: "D1495B", // red: 欠測・不可
    hlink: "3D5A80", folHlink: "7B2D4A",
  },
};
const HEX = THEME.colors;

function newDeck(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.title = title;
  pres.author = "BBJ-001-OR-TAS-AL";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "TITLE",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 11.7, h: 1.6,
          fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.0, w: 11.7, h: 1.4,
          fontSize: 18, color: C.background2, valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 0.9,
          fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
      { text: { text: title, options: { x: 0.6, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: C.accent4, margin: 0 } } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: C.accent4, align: "right" },
  });
  return { pres, C };
}

// 角丸カード（薄い背景 + 見出し + 本文）
function card(slide, pres, C, o) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.12,
    fill: { color: o.fill || C.background2 }, line: { color: o.fill || C.background2 },
    objectName: o.name + " card",
  });
  let y = o.y + 0.25;
  if (o.badge) {
    slide.addShape(pres.shapes.OVAL, { x: o.x + 0.3, y, w: 0.55, h: 0.55, fill: { color: o.badgeColor || C.accent1 },
      line: { color: o.badgeColor || C.accent1 }, objectName: o.name + " badge" });
    slide.addText(o.badge, { x: o.x + 0.3, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, align: "center",
      valign: "middle", color: C.background1, margin: 0, isTextBox: true, objectName: o.name + " badge text" });
  }
  const tx = o.badge ? o.x + 1.0 : o.x + 0.3;
  if (o.head) {
    slide.addText(o.head, { x: tx, y, w: o.x + o.w - tx - 0.25, h: 0.55, fontSize: o.headSize || 18, bold: true,
      color: o.headColor || C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: o.name + " head" });
    y += 0.7;
  }
  if (o.body) {
    slide.addText(o.body, { x: o.x + 0.3, y, w: o.w - 0.6, h: o.y + o.h - y - 0.2, fontSize: o.bodySize || 16,
      color: C.text1, valign: "top", margin: 0, paraSpaceAfter: 10, isTextBox: true, objectName: o.name + " body" });
  }
}

// 箇条書きの配列を pptxgenjs のテキスト配列に変換
function bullets(items, size) {
  return items.map((t, i) => {
    const run = typeof t === "string" ? { text: t, options: {} } : t;
    return { text: run.text, options: { bullet: true, breakLine: i < items.length - 1, fontSize: size || 16, paraSpaceAfter: 10, ...run.options } };
  });
}

// 表のヘッダー行・本文行
function tableRows(C, header, rows, opts = {}) {
  const head = header.map((h) => ({ text: h, options: { bold: true, color: C.background1, fill: { color: C.accent1 },
    fontSize: opts.headSize || 13, valign: "middle" } }));
  const body = rows.map((r, i) => r.map((c) => {
    const cell = typeof c === "object" && c !== null && c.text !== undefined ? c : { text: String(c) };
    return { text: cell.text, options: { fontSize: opts.size || 12, color: C.text1, valign: "middle",
      fill: { color: i % 2 ? C.background2 : C.background1 }, ...(cell.options || {}) } };
  }));
  return [head, ...body];
}

module.exports = { THEME, HEX, newDeck, card, bullets, tableRows };
