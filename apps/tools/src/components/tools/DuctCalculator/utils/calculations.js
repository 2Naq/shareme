// Utility functions for duct calculator math
export function fmt(n, d = 1) {
  return Number(n).toFixed(d).replace(/\.0+$/, "");
}

export function deg2rad(d) {
  return (d * Math.PI) / 180;
}

/**
 * Find intersection of two 2D lines (p1+t*d1) and (p2+s*d2).
 * Returns the intersection point.
 */
export function lineIntersect(p1, d1, p2, d2) {
  const denom = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(denom) < 1e-9) return { x: p1.x, y: p1.y };
  const t = ((p2.x - p1.x) * d2.y - (p2.y - p1.y) * d2.x) / denom;
  return { x: p1.x + t * d1.x, y: p1.y + t * d1.y };
}

// ── Tab 1: Offset 1 khúc ──
export function calcOffset1(A, beta) {
  const b = deg2rad(beta);
  return {
    L: A / Math.sin(b),
    run: A / Math.tan(b),
  };
}

// ── Tab 2: Offset 2 khúc (khấc chữ V) ──
export function calcOffset2(A, phi) {
  const p = deg2rad(phi);
  const t = Math.tan(p);
  return {
    X: A * t,
    L2a: A * (1 - t),
    L2b: A * (1 + t),
  };
}

// ── Tab 3: Co ngang (Elbow) ──
export function calcElbow(A, theta) {
  const phi = deg2rad(theta) / 2;
  return {
    L: A / Math.cos(phi),
  };
}

// ── Tab 4: Tê nhánh (T) ──
export function calcTee(W1, W2, alpha) {
  const a = deg2rad(alpha);
  return {
    notch: W2 / Math.sin(a),
  };
}

// ── Tab 5: Chữ thập (Cross) — same formula, applied on both sides ──
export function calcCross(W1, W2, alpha) {
  const a = deg2rad(alpha);
  return {
    notch: W2 / Math.sin(a),
  };
}
