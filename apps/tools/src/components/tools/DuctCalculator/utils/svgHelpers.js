// SVG helper functions for 2D duct diagrams
const AMBER = "#ffb020";
const STEEL = "#7f97a3";
const STEEL_L = "#c3d3da";
const CYAN = "#57c7c7";
const LINE = "#26313a";
const BG = "#0d1418";

export { AMBER, STEEL, STEEL_L, CYAN, LINE, BG };

export function defsBlock() {
  return `<defs>
    <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
      <path d="M22 0H0V22" fill="none" stroke="${LINE}" stroke-width="0.6"/>
    </pattern>
    <marker id="arrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${AMBER}"/>
    </marker>
    <marker id="arrowSteel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="${STEEL_L}"/>
    </marker>
  </defs>`;
}

export function gridRect(w, h) {
  return `<rect width="${w}" height="${h}" fill="${BG}"/><rect width="${w}" height="${h}" fill="url(#grid)"/>`;
}

export function trayPath(points, color, width) {
  const d = points
    .map(
      (p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1),
    )
    .join(" ");
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

export function centerlinePath(points, color) {
  const d = points
    .map(
      (p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1),
    )
    .join(" ");
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.5"/>`;
}

export function labelPill(x, y, text, color) {
  const w = text.length * 7.2 + 16;
  return `<g transform="translate(${x - w / 2},${y - 11})">
    <rect width="${w}" height="22" rx="4" fill="#0d1418" stroke="${color}" stroke-width="1" opacity="0.95"/>
    <text x="${w / 2}" y="15" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" fill="${color}" font-weight="700">${text}</text>
  </g>`;
}

export function angleArc(cx, cy, r, a1, a2, color, label) {
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const p2 = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
  const large = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  const mid = (a1 + a2) / 2;
  const lx = cx + (r + 16) * Math.cos(mid);
  const ly = cy + (r + 16) * Math.sin(mid);
  return (
    `<path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.6"/>` +
    labelPill(lx + 10, ly, label, color)
  );
}

export function dimVertical(x, y1, y2, text, color = STEEL_L) {
  const tick = 7;
  return `
    <line x1="${x - tick}" y1="${y1}" x2="${x + tick}" y2="${y1}" stroke="${color}" stroke-width="1.3"/>
    <line x1="${x - tick}" y1="${y2}" x2="${x + tick}" y2="${y2}" stroke="${color}" stroke-width="1.3"/>
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="1.3" marker-start="url(#arrowSteel)" marker-end="url(#arrowSteel)"/>
    ${labelPill(x, (y1 + y2) / 2, text, color)}
  `;
}

export function dimHorizontal(x1, x2, y, text, color = STEEL_L) {
  const tick = 7;
  return `
    <line x1="${x1}" y1="${y - tick}" x2="${x1}" y2="${y + tick}" stroke="${color}" stroke-width="1.3"/>
    <line x1="${x2}" y1="${y - tick}" x2="${x2}" y2="${y + tick}" stroke="${color}" stroke-width="1.3"/>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1.3" marker-start="url(#arrowSteel)" marker-end="url(#arrowSteel)"/>
    ${labelPill((x1 + x2) / 2, y, text, color)}
  `;
}

export function dimAlong(x1, y1, x2, y2, text, color = AMBER, width = 2.4) {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" marker-start="url(#arrowAmber)" marker-end="url(#arrowAmber)"/>` +
    labelPill(mx, my, text, color)
  );
}
