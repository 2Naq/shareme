// Flat pattern SVG generators for duct cutting visualization
// Shows unfolded sheet metal with cut lines, fold lines, and dimensions
import { fmt, deg2rad } from "./calculations";

const AMBER = "#ffb020";
const STEEL = "#7f97a3";
const STEEL_L = "#c3d3da";
const CYAN = "#57c7c7";
const CUT_RED = "#ff5a4d";
const CUT_FILL = "rgba(255,90,77,0.18)";
const FOLD_COLOR = "#4dc9f6";
const BG = "#0d1418";
const LINE = "#26313a";

function defsBlock() {
  return `<defs>
    <pattern id="flatGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="${LINE}" stroke-width="0.5"/>
    </pattern>
    <marker id="dimArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${STEEL_L}"/>
    </marker>
    <marker id="dimArrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${AMBER}"/>
    </marker>
    <marker id="dimArrowCyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${CYAN}"/>
    </marker>
    <marker id="dimArrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${CUT_RED}"/>
    </marker>
  </defs>`;
}

function bgRect(w, h) {
  return `<rect width="${w}" height="${h}" fill="${BG}"/><rect width="${w}" height="${h}" fill="url(#flatGrid)"/>`;
}

function labelPill(x, y, text, color, fontSize = 11) {
  const w = text.length * (fontSize * 0.58) + 14;
  return `<g transform="translate(${x - w / 2},${y - 10})">
    <rect width="${w}" height="20" rx="3" fill="${BG}" stroke="${color}" stroke-width="0.8" opacity="0.95"/>
    <text x="${w / 2}" y="14" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${fontSize}" fill="${color}" font-weight="600">${text}</text>
  </g>`;
}

function dimH(x1, x2, y, text, color = STEEL_L) {
  const markerId =
    color === AMBER
      ? "dimArrowAmber"
      : color === CYAN
        ? "dimArrowCyan"
        : color === CUT_RED
          ? "dimArrowRed"
          : "dimArrow";
  const tick = 5;
  return `
    <line x1="${x1}" y1="${y - tick}" x2="${x1}" y2="${y + tick}" stroke="${color}" stroke-width="1"/>
    <line x1="${x2}" y1="${y - tick}" x2="${x2}" y2="${y + tick}" stroke="${color}" stroke-width="1"/>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    ${labelPill((x1 + x2) / 2, y, text, color)}`;
}

function dimV(x, y1, y2, text, color = STEEL_L) {
  const markerId =
    color === AMBER
      ? "dimArrowAmber"
      : color === CYAN
        ? "dimArrowCyan"
        : color === CUT_RED
          ? "dimArrowRed"
          : "dimArrow";
  const tick = 5;
  return `
    <line x1="${x - tick}" y1="${y1}" x2="${x + tick}" y2="${y1}" stroke="${color}" stroke-width="1"/>
    <line x1="${x - tick}" y1="${y2}" x2="${x + tick}" y2="${y2}" stroke="${color}" stroke-width="1"/>
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="1" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    ${labelPill(x, (y1 + y2) / 2, text, color)}`;
}

function angleArc(cx, cy, r, a1, a2, color, label) {
  const p1x = cx + r * Math.cos(a1),
    p1y = cy + r * Math.sin(a1);
  const p2x = cx + r * Math.cos(a2),
    p2y = cy + r * Math.sin(a2);
  const large = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  const mid = (a1 + a2) / 2;
  const lx = cx + (r + 14) * Math.cos(mid);
  const ly = cy + (r + 14) * Math.sin(mid);
  return (
    `<path d="M${p1x.toFixed(1)},${p1y.toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${p2x.toFixed(1)},${p2y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.4"/>` +
    labelPill(lx, ly, label, color, 10)
  );
}

// Cut triangle with hatching
function cutTriangle(pts, id) {
  const d =
    pts
      .map(
        (p, i) =>
          (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1),
      )
      .join(" ") + " Z";
  return `<defs>
    <pattern id="hatch${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="${CUT_RED}" stroke-width="0.8" opacity="0.5"/>
    </pattern>
  </defs>
  <path d="${d}" fill="url(#hatch${id})" stroke="${CUT_RED}" stroke-width="1.8" stroke-dasharray="5 3"/>
  <path d="${d}" fill="${CUT_FILL}" stroke="none"/>`;
}

function foldLine(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${FOLD_COLOR}" stroke-width="1.2" stroke-dasharray="8 4 2 4" opacity="0.7"/>`;
}

function sectionTitle(x, y, text) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL}" font-weight="700" letter-spacing="1.5">${text}</text>`;
}

// ═════════════════════════════════════════════════════════
// Tab 1: Offset 1 khúc — Flat pattern
// Shows the angled cut piece (diagonal segment between two horizontal runs)
// ═════════════════════════════════════════════════════════
export function flatPattern_offset1(A, beta) {
  const b = deg2rad(beta);
  const L = A / Math.sin(b);
  const run = A / Math.tan(b);
  const W = 700,
    H = 420;

  // Scale to fit
  const maxDim = Math.max(L, A);
  const scale = Math.min(180 / maxDim, 1.2);
  const Apx = A * scale;
  const Lpx = L * scale;
  // const runPx = run * scale;
  const ductW = 50; // width of duct wall representation

  let svg = defsBlock() + bgRect(W, H);
  svg += sectionTitle(W / 2, 24, "TRẢI TẤM — ĐOẠN CHÉO OFFSET 1 KHÚC");

  // === Part 1: Bottom plate (trải đáy) ===
  const bx = 60,
    by = 80;
  const plateW = Lpx + 60;
  const plateH = ductW;

  // Draw bottom plate rectangle
  svg += `<rect x="${bx}" y="${by}" width="${plateW}" height="${plateH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // Cut lines at both ends (angled)
  const cutDx = plateH / Math.tan(b);
  // Left cut triangle
  const leftTri = [
    [bx, by],
    [bx + cutDx, by],
    [bx, by + plateH],
  ];
  svg += cutTriangle(leftTri, "o1L");
  // Right cut triangle
  const rightTri = [
    [bx + plateW, by + plateH],
    [bx + plateW - cutDx, by + plateH],
    [bx + plateW, by],
  ];
  svg += cutTriangle(rightTri, "o1R");

  // Angle arc at left cut
  svg += angleArc(bx, by + plateH, 22, -Math.PI / 2, -b, CYAN, fmt(beta) + "°");

  // Dimensions
  svg += dimH(bx, bx + plateW, by - 18, "L = " + fmt(L) + " mm", AMBER);
  svg += dimV(bx + plateW + 20, by, by + plateH, "W", STEEL_L);
  svg += dimH(
    bx,
    bx + cutDx,
    by + plateH + 22,
    "cắt = " + fmt(run > 0 ? (ductW / Math.tan(b)) * (A / Apx) : 0, 1) + " mm",
    CUT_RED,
  );

  // Labels
  svg += labelPill(bx + plateW / 2, by + plateH / 2, "ĐÁY MÁNG", STEEL);

  // === Part 2: Side walls (trải thành) ===
  const sy = 200;
  const wallH = Apx * 0.6; // visual wall height
  const wallPlateW = Lpx + 60;

  svg += `<rect x="${bx}" y="${sy}" width="${wallPlateW}" height="${wallH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // Cut triangles at both ends of side wall
  const wallCutDx = wallH / Math.tan(b);
  const wLeftTri = [
    [bx, sy],
    [bx + wallCutDx, sy],
    [bx, sy + wallH],
  ];
  svg += cutTriangle(wLeftTri, "o1WL");
  const wRightTri = [
    [bx + wallPlateW, sy + wallH],
    [bx + wallPlateW - wallCutDx, sy + wallH],
    [bx + wallPlateW, sy],
  ];
  svg += cutTriangle(wRightTri, "o1WR");

  // Fold line at bottom
  svg += foldLine(bx, sy + wallH, bx + wallPlateW, sy + wallH);

  svg += dimV(
    bx + wallPlateW + 20,
    sy,
    sy + wallH,
    "A = " + fmt(A) + " mm",
    AMBER,
  );
  svg += labelPill(
    bx + wallPlateW / 2,
    sy + wallH / 2,
    "THÀNH MÁNG (x2)",
    STEEL,
  );

  // === Part 3: Assembly note after cutting ===
  const ny = sy + wallH + 50;
  svg += `<text x="${bx}" y="${ny}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${CUT_RED}">▲</tspan> Vùng gạch chéo đỏ = phần cắt bỏ
  </text>`;
  svg += `<text x="${bx}" y="${ny + 18}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${FOLD_COLOR}">- - -</tspan> Đường gấp (fold line)
  </text>`;
  svg += `<text x="${bx}" y="${ny + 36}" font-family="JetBrains Mono, monospace" font-size="11" fill="${AMBER}">
    L = A / sin(β) = ${fmt(A)} / sin(${fmt(beta)}°) = ${fmt(L)} mm
  </text>`;

  return { svg, viewBox: `0 0 ${W} ${H}` };
}

// ═════════════════════════════════════════════════════════
// Tab 2: Offset 2 khúc — Flat pattern
// Shows V-notch cut on the wall of the duct
// ═════════════════════════════════════════════════════════
export function flatPattern_offset2(A, phi) {
  const p = deg2rad(phi);
  const X = A * Math.tan(p);
  const L2a = A * (1 - Math.tan(p));
  // const L2b = A * (1 + Math.tan(p));
  const W = 700,
    H = 420;

  const scale = Math.min(200 / A, 1.5);
  const Apx = A * scale;
  const Xpx = X * scale;
  const wallLen = Apx * 3;

  let svg = defsBlock() + bgRect(W, H);
  svg += sectionTitle(W / 2, 24, "TRẢI TẤM — KHẤC CHỮ V (OFFSET 2 KHÚC)");

  // === Side wall flat pattern with V-notch ===
  const bx = 80,
    by = 60;
  const cx = bx + wallLen / 2;

  // Main rectangle outline
  svg += `<rect x="${bx}" y="${by}" width="${wallLen}" height="${Apx}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // V-notch triangle (cut area)
  const notchTop = by; // top edge of wall
  const notchLeft = [cx - Xpx, notchTop];
  const notchRight = [cx + Xpx, notchTop];
  const notchApex = [cx, notchTop + Apx]; // bottom of V

  const vTri = [notchLeft, notchRight, notchApex];
  svg += cutTriangle(vTri, "o2V");

  // Angle arcs at notch
  svg += angleArc(
    notchApex[0],
    notchApex[1],
    24,
    -Math.PI / 2 - p,
    -Math.PI / 2,
    CYAN,
    fmt(phi) + "°",
  );
  svg += angleArc(
    notchApex[0],
    notchApex[1],
    24,
    -Math.PI / 2,
    -Math.PI / 2 + p,
    CYAN,
    fmt(phi) + "°",
  );

  // Dimensions
  svg += dimH(cx, cx + Xpx, by - 18, "X = " + fmt(X) + " mm", AMBER);
  svg += dimV(bx - 24, by, by + Apx, "A = " + fmt(A) + " mm", STEEL_L);

  // Inner/outer edge lengths after fold
  svg += dimH(
    bx,
    cx - Xpx,
    by + Apx + 22,
    "L₂ trong = " + fmt(L2a) + " mm",
    CYAN,
  );
  svg += dimH(cx + Xpx, bx + wallLen, by + Apx + 22, "L₂ trong", CYAN);

  svg += labelPill(cx, by + Apx / 3, "PHẦN CẮT BỎ", CUT_RED, 10);
  svg += labelPill(bx + wallLen / 4, by + Apx / 2, "THÀNH MÁNG", STEEL);

  // === After folding visualization ===
  const fy = by + Apx + 70;
  svg += sectionTitle(W / 2, fy, "SAU KHI GẬP LẠI");

  const foldLen = 120;
  const foldAngle = 2 * p;
  const f0 = [120, fy + 80];
  const f1 = [f0[0] + foldLen, fy + 80];
  const f2x = f1[0] + foldLen * Math.cos(foldAngle);
  const f2y = f1[1] - foldLen * Math.sin(foldAngle);

  svg += `<path d="M${f0[0]},${f0[1]} L${f1[0]},${f1[1]} L${f2x.toFixed(1)},${f2y.toFixed(1)}" fill="none" stroke="${STEEL}" stroke-width="3" stroke-linejoin="round"/>`;
  svg += `<circle cx="${f1[0]}" cy="${f1[1]}" r="4" fill="${AMBER}"/>`;

  // Angle arc at bend point
  svg += angleArc(
    f1[0],
    f1[1],
    30,
    Math.PI,
    Math.atan2(f2y - f1[1], f2x - f1[0]),
    CYAN,
    fmt(2 * phi) + "°",
  );

  svg += labelPill(f1[0], fy + 50, "ĐIỂM GẬP", AMBER, 10);

  // Legend
  const ny = fy + 120;
  svg += `<text x="${bx}" y="${ny}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${CUT_RED}">▲</tspan> Vùng gạch chéo đỏ = phần cắt bỏ (khấc V)
  </text>`;
  svg += `<text x="${bx}" y="${ny + 16}" font-family="JetBrains Mono, monospace" font-size="11" fill="${AMBER}">
    X = A·tan(φ) = ${fmt(A)}×tan(${fmt(phi)}°) = ${fmt(X)} mm
  </text>`;

  return { svg, viewBox: `0 0 ${W} ${H}` };
}

// ═════════════════════════════════════════════════════════
// Tab 3: Elbow — Flat pattern
// Shows miter cut on both segments
// ═════════════════════════════════════════════════════════
export function flatPattern_elbow(A, theta) {
  const halfAngle = deg2rad(theta) / 2;
  const L = A / Math.cos(halfAngle);
  const W = 700,
    H = 400;

  const scale = Math.min(140 / A, 1.2);
  const Apx = A * scale;
  // const Lpx = L * scale;
  const segLen = 160;

  let svg = defsBlock() + bgRect(W, H);
  svg += sectionTitle(
    W / 2,
    24,
    "TRẢI TẤM — CO NGANG (ELBOW " + fmt(theta) + "°)",
  );

  // === Segment 1 (left) ===
  const bx = 50,
    by = 70;
  svg += `<rect x="${bx}" y="${by}" width="${segLen}" height="${Apx}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // Miter cut at right end of segment 1
  const cutH = Apx * Math.tan(halfAngle);
  const miterTri1 = [
    [bx + segLen, by],
    [bx + segLen, by + Apx],
    [bx + segLen - cutH, by + Apx],
  ];
  svg += cutTriangle(miterTri1, "e1");

  // Angle arc
  svg += angleArc(
    bx + segLen,
    by,
    20,
    Math.PI / 2,
    Math.PI / 2 + halfAngle,
    CYAN,
    fmt(theta / 2) + "°",
  );

  svg += dimH(bx, bx + segLen, by - 16, "Đoạn 1", STEEL_L);
  svg += dimV(bx - 18, by, by + Apx, "A=" + fmt(A), STEEL_L);
  svg += labelPill(bx + segLen / 2, by + Apx / 2, "ĐOẠN 1", STEEL);

  // Dimension of miter line
  svg += `<line x1="${bx + segLen}" y1="${by}" x2="${bx + segLen - cutH}" y2="${by + Apx}" stroke="${AMBER}" stroke-width="2" stroke-dasharray="5 3"/>`;
  svg += labelPill(
    bx + segLen - cutH / 2 + 30,
    by + Apx / 2,
    "L=" + fmt(L),
    AMBER,
    10,
  );

  // === Segment 2 (right) — mirror ===
  const gap = 40;
  const bx2 = bx + segLen + gap;
  svg += `<rect x="${bx2}" y="${by}" width="${segLen}" height="${Apx}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // Miter cut at left end of segment 2
  const miterTri2 = [
    [bx2, by],
    [bx2, by + Apx],
    [bx2 + cutH, by + Apx],
  ];
  svg += cutTriangle(miterTri2, "e2");

  svg += angleArc(
    bx2,
    by,
    20,
    Math.PI / 2 - halfAngle,
    Math.PI / 2,
    CYAN,
    fmt(theta / 2) + "°",
  );

  svg += dimH(bx2, bx2 + segLen, by - 16, "Đoạn 2", STEEL_L);
  svg += labelPill(bx2 + segLen / 2, by + Apx / 2, "ĐOẠN 2", STEEL);

  // === After joining visualization ===
  const jy = by + Apx + 50;
  svg += sectionTitle(W / 2, jy, "SAU KHI GHÉP");

  const jx = 140,
    jby = jy + 30;
  const leg1End = [jx + segLen, jby + Apx / 2];
  const dir2x = Math.cos(deg2rad(theta));
  const dir2y = -Math.sin(deg2rad(theta));
  const leg2End = [leg1End[0] + segLen * dir2x, leg1End[1] + segLen * dir2y];

  svg += `<path d="M${jx},${jby + Apx / 2} L${leg1End[0]},${leg1End[1]} L${leg2End[0].toFixed(1)},${leg2End[1].toFixed(1)}" fill="none" stroke="${STEEL}" stroke-width="3" stroke-linejoin="round"/>`;
  svg += `<circle cx="${leg1End[0]}" cy="${leg1End[1]}" r="3" fill="${AMBER}"/>`;
  svg += angleArc(
    leg1End[0],
    leg1End[1],
    28,
    Math.atan2(0, -1),
    Math.atan2(dir2y, dir2x),
    CYAN,
    fmt(theta) + "°",
  );

  // Legend
  const ny = Math.max(jby + Apx / 2 + 60, jby + 100);
  svg += `<text x="${bx}" y="${ny}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${CUT_RED}">▲</tspan> Vùng cắt vát (miter cut)    <tspan fill="${AMBER}">L = A / cos(Θ/2) = ${fmt(L)} mm</tspan>
  </text>`;

  return { svg, viewBox: `0 0 ${W} ${H}` };
}

// ═════════════════════════════════════════════════════════
// Tab 4: Tee — Flat pattern
// Shows notch cut on main duct for branch connection
// ═════════════════════════════════════════════════════════
export function flatPattern_tee(W1, W2, alpha) {
  const a = deg2rad(alpha);
  const notch = W2 / Math.sin(a);
  const W = 700,
    H = 420;

  const scale = Math.min(220 / W1, 1.0);
  const W1px = Math.max(W1 * scale, 100);
  const notchPx = notch * scale;
  const mainLen = 400;
  const wallH = W1px * 0.5;

  let svg = defsBlock() + bgRect(W, H);
  svg += sectionTitle(W / 2, 24, "TRẢI TẤM — TÊ NHÁNH (T)");

  // === Top wall of main duct (where notch is cut) ===
  const bx = 60,
    by = 70;
  const cx = bx + mainLen / 2;

  svg += `<rect x="${bx}" y="${by}" width="${mainLen}" height="${wallH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  // Notch trapezoid/parallelogram on top edge
  const halfN = notchPx / 2;
  // const cosA = Math.cos(a);
  // const notchDx = wallH * cosA;

  // Notch shape — two angled cuts from top edge into the wall
  // const n1Top = cx - halfN * cosA;
  // const n2Top = cx + halfN * cosA;
  // const n1Bot = cx - halfN * cosA - notchDx;
  // const n2Bot = cx + halfN * cosA + notchDx;

  // Simplified: show as rectangle notch for clarity
  const notchShape = [
    [cx - halfN, by],
    [cx + halfN, by],
    [cx + halfN, by + Math.min(wallH * 0.8, notchPx * 0.4)],
    [cx - halfN, by + Math.min(wallH * 0.8, notchPx * 0.4)],
  ];
  svg += cutTriangle(notchShape, "tN");

  // Dimension of notch
  svg += dimH(
    cx - halfN,
    cx + halfN,
    by - 18,
    "khấc = " + fmt(notch) + " mm",
    AMBER,
  );
  svg += dimV(bx - 22, by, by + wallH, "W₁ = " + fmt(W1) + " mm", STEEL_L);

  // Angle lines
  if (Math.abs(alpha - 90) > 1) {
    const angLineLen = wallH * 0.6;
    const ax1 = cx - halfN;
    const ay1 = by;
    const ax2 = ax1 + angLineLen * Math.cos(a);
    const ay2 = ay1 - angLineLen * Math.sin(a);
    svg += `<line x1="${ax1}" y1="${ay1}" x2="${ax2.toFixed(1)}" y2="${ay2.toFixed(1)}" stroke="${CYAN}" stroke-width="1" stroke-dasharray="4 3"/>`;
    svg += angleArc(ax1, ay1, 18, -Math.PI / 2, -a, CYAN, fmt(alpha) + "°");
  }

  svg += labelPill(
    bx + mainLen / 4,
    by + wallH / 2,
    "THÀNH TRÊN MÁNG CHÍNH",
    STEEL,
    9,
  );
  svg += labelPill(
    cx,
    by + Math.min(wallH * 0.4, notchPx * 0.2),
    "CẮT BỎ",
    CUT_RED,
    9,
  );

  // === Branch piece ===
  const brY = by + wallH + 50;
  const brLen = 180;
  const brH = W2 * scale * 0.8;

  svg += `<rect x="${cx - brLen / 2}" y="${brY}" width="${brLen}" height="${brH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;
  svg += dimV(
    cx + brLen / 2 + 18,
    brY,
    brY + brH,
    "W₂ = " + fmt(W2) + " mm",
    CYAN,
  );
  svg += labelPill(cx, brY + brH / 2, "NHÁNH RẼ", STEEL);

  // Fold line
  svg += foldLine(bx, by + wallH, bx + mainLen, by + wallH);

  // Legend
  const ny = brY + brH + 30;
  svg += `<text x="${bx}" y="${ny}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${CUT_RED}">▲</tspan> Khấc cắt = W₂/sin(α) = ${fmt(W2)}/sin(${fmt(alpha)}°) = <tspan fill="${AMBER}">${fmt(notch)} mm</tspan>
  </text>`;
  svg += `<text x="${bx}" y="${ny + 16}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${FOLD_COLOR}">- - -</tspan> Đường gấp
  </text>`;

  return { svg, viewBox: `0 0 ${W} ${H}` };
}

// ═════════════════════════════════════════════════════════
// Tab 5: Cross — Flat pattern
// Shows 2 notches on opposite sides of main duct
// ═════════════════════════════════════════════════════════
export function flatPattern_cross(W1, W2, alpha) {
  const a = deg2rad(alpha);
  const notch = W2 / Math.sin(a);
  const W = 700,
    H = 440;

  const scale = Math.min(200 / W1, 1.0);
  const W1px = Math.max(W1 * scale, 100);
  const notchPx = notch * scale;
  const mainLen = 420;
  const wallH = W1px * 0.45;

  let svg = defsBlock() + bgRect(W, H);
  svg += sectionTitle(W / 2, 24, "TRẢI TẤM — CHỮ THẬP (X)");

  // === Main duct wall flat pattern ===
  const bx = 60,
    by = 60;
  const cx = bx + mainLen / 2;

  svg += `<rect x="${bx}" y="${by}" width="${mainLen}" height="${wallH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;

  const halfN = notchPx / 2;
  const notchDepth = Math.min(wallH * 0.75, notchPx * 0.35);

  // Notch 1 (top edge)
  const n1 = [
    [cx - halfN, by],
    [cx + halfN, by],
    [cx + halfN, by + notchDepth],
    [cx - halfN, by + notchDepth],
  ];
  svg += cutTriangle(n1, "c1");
  svg += labelPill(cx, by + notchDepth / 2, "CẮT 1", CUT_RED, 9);

  // Notch 2 (bottom edge)
  const n2 = [
    [cx - halfN, by + wallH],
    [cx + halfN, by + wallH],
    [cx + halfN, by + wallH - notchDepth],
    [cx - halfN, by + wallH - notchDepth],
  ];
  svg += cutTriangle(n2, "c2");
  svg += labelPill(cx, by + wallH - notchDepth / 2, "CẮT 2", CUT_RED, 9);

  // Dimensions
  svg += dimH(
    cx - halfN,
    cx + halfN,
    by - 18,
    "khấc = " + fmt(notch) + " mm",
    AMBER,
  );
  svg += dimV(bx - 22, by, by + wallH, "W₁ = " + fmt(W1) + " mm", STEEL_L);

  svg += labelPill(
    bx + mainLen / 5,
    by + wallH / 2,
    "THÀNH MÁNG CHÍNH",
    STEEL,
    9,
  );

  // === Two branch pieces ===
  const brY = by + wallH + 50;
  const brLen = 140;
  const brH = W2 * scale * 0.7;
  const brGap = 60;

  // Branch 1
  const br1x = cx - brLen - brGap / 2;
  svg += `<rect x="${br1x}" y="${brY}" width="${brLen}" height="${brH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;
  svg += labelPill(br1x + brLen / 2, brY + brH / 2, "NHÁNH 1", STEEL, 9);

  // Branch 2
  const br2x = cx + brGap / 2;
  svg += `<rect x="${br2x}" y="${brY}" width="${brLen}" height="${brH}" fill="none" stroke="${STEEL}" stroke-width="2"/>`;
  svg += labelPill(br2x + brLen / 2, brY + brH / 2, "NHÁNH 2", STEEL, 9);

  svg += dimV(
    br2x + brLen + 18,
    brY,
    brY + brH,
    "W₂ = " + fmt(W2) + " mm",
    CYAN,
  );

  // Fold lines
  svg += foldLine(bx, by + wallH, bx + mainLen, by + wallH);

  // Angle indicator
  if (Math.abs(alpha - 90) > 1) {
    svg += angleArc(
      cx - halfN,
      by,
      16,
      -Math.PI / 2,
      -a,
      CYAN,
      fmt(alpha) + "°",
    );
  }

  // Legend
  const ny = brY + brH + 30;
  svg += `<text x="${bx}" y="${ny}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    <tspan fill="${CUT_RED}">▲</tspan> Khấc cắt mỗi bên = W₂/sin(α) = ${fmt(W2)}/sin(${fmt(alpha)}°) = <tspan fill="${AMBER}">${fmt(notch)} mm</tspan>
  </text>`;
  svg += `<text x="${bx}" y="${ny + 16}" font-family="JetBrains Mono, monospace" font-size="11" fill="${STEEL_L}">
    Đối xứng: 2 khấc giống nhau trên 2 thành đối diện
  </text>`;

  return { svg, viewBox: `0 0 ${W} ${H}` };
}
