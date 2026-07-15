// 3D builder functions for duct calculator (uses Three.js)

const STEEL_HEX = 0x8a9ba6;
const STEEL_DARK_HEX = 0x4b5960;
const CUT_HEX = 0xff5a4d;
const AMBER_HEX = 0xffb020;

export function mmToUnits(v) { return v / 70; }

/** Create a U-shaped duct segment. Local axes: length along +Z, width along X, height along Y */
export function makeUSegment(THREE, length, width, wallH) {
  const g = new THREE.Group();
  const t = Math.max(width * 0.035, 0.012);
  const mat = new THREE.MeshStandardMaterial({ color: STEEL_HEX, metalness: 0.35, roughness: 0.55 });
  const matDark = new THREE.MeshStandardMaterial({ color: STEEL_DARK_HEX, metalness: 0.3, roughness: 0.6 });
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(width, t, length), mat);
  bottom.position.set(0, t / 2, length / 2);
  const left = new THREE.Mesh(new THREE.BoxGeometry(t, wallH, length), matDark);
  left.position.set(-width / 2 + t / 2, wallH / 2, length / 2);
  const right = new THREE.Mesh(new THREE.BoxGeometry(t, wallH, length), matDark);
  right.position.set(width / 2 - t / 2, wallH / 2, length / 2);
  g.add(bottom, left, right);
  return g;
}

/** Align segment so its local Z axis goes from A to B */
export function alignSegment(THREE, group, A, B, upHint) {
  const dir = new THREE.Vector3().subVectors(B, A).normalize();
  let up = (upHint || new THREE.Vector3(0, 1, 0)).clone();
  if (Math.abs(dir.dot(up)) > 0.995) up = new THREE.Vector3(1, 0, 0);
  const xAxis = new THREE.Vector3().crossVectors(up, dir).normalize();
  const yAxis = new THREE.Vector3().crossVectors(dir, xAxis).normalize();
  const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, dir);
  group.quaternion.setFromRotationMatrix(m);
  group.position.copy(A);
}

/** Dashed U-shaped cut marker at a given point */
export function cutMarker(THREE, point, dirVec, width, wallH) {
  const dir = dirVec.clone().normalize();
  let up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(dir.dot(up)) > 0.995) up = new THREE.Vector3(1, 0, 0);
  const xAxis = new THREE.Vector3().crossVectors(up, dir).normalize();
  const yAxis = new THREE.Vector3().crossVectors(dir, xAxis).normalize();
  const pts = [
    new THREE.Vector3().addScaledVector(xAxis, -width / 2).addScaledVector(yAxis, wallH),
    new THREE.Vector3().addScaledVector(xAxis, -width / 2),
    new THREE.Vector3().addScaledVector(xAxis, width / 2),
    new THREE.Vector3().addScaledVector(xAxis, width / 2).addScaledVector(yAxis, wallH),
  ].map(v => v.add(point));
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineDashedMaterial({ color: CUT_HEX, dashSize: 0.055, gapSize: 0.04, linewidth: 2 });
  const line = new THREE.Line(geo, mat);
  line.computeLineDistances();
  return line;
}

function dashLine(THREE, p1, p2, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const mat = new THREE.LineDashedMaterial({ color: color || CUT_HEX, dashSize: 0.05, gapSize: 0.04, linewidth: 2 });
  const line = new THREE.Line(geo, mat);
  line.computeLineDistances();
  return line;
}

/** Create a translucent red triangle mesh for cut visualization */
function cutTriangleMesh(THREE, p1, p2, p3) {
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z,
  ]);
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: CUT_HEX,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

/** Create a cut quad (2 triangles) for flat cut areas */
function cutQuadMesh(THREE, p1, p2, p3, p4) {
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z,
    p1.x, p1.y, p1.z,
    p3.x, p3.y, p3.z,
    p4.x, p4.y, p4.z,
  ]);
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: CUT_HEX,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

/** Create edges around a cut triangle */
function cutTriangleEdges(THREE, p1, p2, p3) {
  const geo = new THREE.BufferGeometry().setFromPoints([p1, p2, p3, p1]);
  const mat = new THREE.LineDashedMaterial({ color: CUT_HEX, dashSize: 0.04, gapSize: 0.03, linewidth: 2 });
  const line = new THREE.Line(geo, mat);
  line.computeLineDistances();
  return line;
}

function deg2rad(d) { return d * Math.PI / 180; }

// ── Tab 1: Offset 1 khúc ──
export function build3D_offset1(THREE, objGroup, setTarget, A, beta) {
  const b = deg2rad(beta);
  const legLen = 1.6;
  const rise = Math.max(0.7, Math.min(2.6, mmToUnits(A)));
  const run = rise / Math.tan(b);
  const width = 0.9, wallH = 0.28;

  const p0 = new THREE.Vector3(-legLen - run / 2, 0, 0);
  const p1 = new THREE.Vector3(p0.x + legLen, 0, 0);
  const p2 = new THREE.Vector3(p1.x + run, rise, 0);
  const p3 = new THREE.Vector3(p2.x + legLen, rise, 0);

  const seg1 = makeUSegment(THREE, p1.distanceTo(p0), width, wallH); alignSegment(THREE, seg1, p0, p1);
  const seg2 = makeUSegment(THREE, p2.distanceTo(p1), width, wallH); alignSegment(THREE, seg2, p1, p2);

  // Shift top horizontal segment (seg3) so its top edge meets seg2's top edge (hinge at top)
  const p2_shifted = new THREE.Vector3(p2.x - wallH * Math.sin(b), rise - wallH * (1 - Math.cos(b)), 0);
  const p3_shifted = new THREE.Vector3(p3.x - wallH * Math.sin(b), p2_shifted.y, 0);
  const seg3 = makeUSegment(THREE, p3_shifted.distanceTo(p2_shifted), width, wallH); alignSegment(THREE, seg3, p2_shifted, p3_shifted);
  objGroup.add(seg1, seg2, seg3);

  const dirDiag = new THREE.Vector3().subVectors(p2, p1).normalize();
  const dirH = new THREE.Vector3(1, 0, 0);
  objGroup.add(cutMarker(THREE, p1, dirDiag.clone().multiplyScalar(0.4), width, wallH));
  objGroup.add(cutMarker(THREE, p2_shifted, dirH.clone().multiplyScalar(0.4), width, wallH));

  // --- Cut Visualization at Junction p1 (Bend UP: cut side walls from top down) ---
  const halfW = width / 2;
  const p1_top_left = new THREE.Vector3(p1.x, wallH, -halfW);
  const p1_top_right = new THREE.Vector3(p1.x, wallH, halfW);
  const p1_top_seg2_left = new THREE.Vector3(p1.x - wallH * Math.sin(b), wallH * Math.cos(b), -halfW);
  const p1_top_seg2_right = new THREE.Vector3(p1.x - wallH * Math.sin(b), wallH * Math.cos(b), halfW);

  // Left wall V-notch (apex at bottom p1)
  const p1_bot_left = new THREE.Vector3(p1.x, 0, -halfW);
  objGroup.add(cutTriangleMesh(THREE, p1_bot_left, p1_top_left, p1_top_seg2_left));
  objGroup.add(cutTriangleEdges(THREE, p1_bot_left, p1_top_left, p1_top_seg2_left));

  // Right wall V-notch (apex at bottom p1)
  const p1_bot_right = new THREE.Vector3(p1.x, 0, halfW);
  objGroup.add(cutTriangleMesh(THREE, p1_bot_right, p1_top_right, p1_top_seg2_right));
  objGroup.add(cutTriangleEdges(THREE, p1_bot_right, p1_top_right, p1_top_seg2_right));

  // --- Cut Visualization at Junction p2 (Bend DOWN: cut from bottom up) ---
  // Hinge at top edge: p2_top
  const p2_top_left = new THREE.Vector3(p2.x - wallH * Math.sin(b), rise + wallH * Math.cos(b), -halfW);
  const p2_top_right = new THREE.Vector3(p2.x - wallH * Math.sin(b), rise + wallH * Math.cos(b), halfW);
  
  // Left wall V-notch (apex at top)
  const p2_bot1_left = new THREE.Vector3(p2.x, rise, -halfW);
  const p2_bot2_left = new THREE.Vector3(p2_shifted.x, p2_shifted.y, -halfW);
  objGroup.add(cutTriangleMesh(THREE, p2_top_left, p2_bot1_left, p2_bot2_left));
  objGroup.add(cutTriangleEdges(THREE, p2_top_left, p2_bot1_left, p2_bot2_left));

  // Right wall V-notch (apex at top)
  const p2_bot1_right = new THREE.Vector3(p2.x, rise, halfW);
  const p2_bot2_right = new THREE.Vector3(p2_shifted.x, p2_shifted.y, halfW);
  objGroup.add(cutTriangleMesh(THREE, p2_top_right, p2_bot1_right, p2_bot2_right));
  objGroup.add(cutTriangleEdges(THREE, p2_top_right, p2_bot1_right, p2_bot2_right));

  // Bottom plate V-notch cut (at p2 since bottom opens up)
  objGroup.add(cutQuadMesh(THREE, p2_bot1_left, p2_bot1_right, p2_bot2_right, p2_bot2_left));

  setTarget(new THREE.Vector3((p0.x + p3.x) / 2, rise / 2, 0), Math.max(4.5, legLen * 2 + run + 1.5));
}

// ── Tab 2: Offset 2 khúc ──
export function build3D_offset2(THREE, objGroup, setTarget, A, phi) {
  const p = deg2rad(phi);
  const Aunit = Math.max(0.5, Math.min(1.8, mmToUnits(A) * 1.4));
  const barLen = 2.0;
  const width = 1.5, wallH = Aunit;

  const q0 = new THREE.Vector3(-barLen, 0, 0);
  const q1 = new THREE.Vector3(0, 0, 0);
  const seg1 = makeUSegment(THREE, barLen, width, wallH); alignSegment(THREE, seg1, q0, q1);
  objGroup.add(seg1);

  const bend = 2 * p;
  const dir2 = new THREE.Vector3(Math.cos(bend), Math.sin(bend), 0);
  const q2 = new THREE.Vector3().addVectors(q1, dir2.clone().multiplyScalar(barLen));
  const seg2 = makeUSegment(THREE, barLen, width, wallH); alignSegment(THREE, seg2, q1, q2);
  objGroup.add(seg2);

  const notchDepth = wallH * Math.tan(p);
  const hingeL = new THREE.Vector3(q1.x, 0, -width / 2 + 0.001);
  const hingeR = new THREE.Vector3(q1.x, 0, width / 2 - 0.001);
  const topL = new THREE.Vector3(q1.x - notchDepth, wallH, -width / 2 + 0.001);
  const topR = new THREE.Vector3(q1.x - notchDepth, wallH, width / 2 - 0.001);
  objGroup.add(dashLine(THREE, hingeL, topL));
  objGroup.add(dashLine(THREE, hingeR, topR));

  // V-notch cut triangle on each side wall
  const apexL = new THREE.Vector3(q1.x, 0, -width / 2 + 0.002);
  objGroup.add(cutTriangleMesh(THREE, topL, new THREE.Vector3(q1.x, wallH, -width / 2 + 0.001), apexL));
  objGroup.add(cutTriangleEdges(THREE, topL, new THREE.Vector3(q1.x, wallH, -width / 2 + 0.001), apexL));
  const apexR = new THREE.Vector3(q1.x, 0, width / 2 - 0.002);
  objGroup.add(cutTriangleMesh(THREE, topR, new THREE.Vector3(q1.x, wallH, width / 2 - 0.001), apexR));
  objGroup.add(cutTriangleEdges(THREE, topR, new THREE.Vector3(q1.x, wallH, width / 2 - 0.001), apexR));

  const hingeGeo = new THREE.BufferGeometry().setFromPoints([hingeL, hingeR]);
  const hingeMat = new THREE.LineBasicMaterial({ color: AMBER_HEX, linewidth: 2 });
  objGroup.add(new THREE.Line(hingeGeo, hingeMat));

  setTarget(new THREE.Vector3(q1.x, wallH * 0.4, 0), 4.2);
}

// ── Tab 3: Elbow (Co ngang) ──
export function build3D_elbow(THREE, objGroup, setTarget, A, theta) {
  const thetaRad = deg2rad(theta);
  const width = Math.max(0.6, Math.min(2.2, mmToUnits(A)));
  const wallH = width * 0.28;
  const legLen = 1.7;

  const cx = 0, cz = 0;
  const fwd1 = new THREE.Vector2(1, 0);
  const dir2 = new THREE.Vector2(Math.cos(thetaRad), -Math.sin(thetaRad));

  function left(d) { return new THREE.Vector2(-d.y, d.x); }
  const left1 = left(fwd1), left2 = left(dir2);
  const half = width / 2;
  const p1L = new THREE.Vector2(cx + left1.x * half, cz + left1.y * half);
  const p1R = new THREE.Vector2(cx - left1.x * half, cz - left1.y * half);
  const p2L = new THREE.Vector2(cx + left2.x * half, cz + left2.y * half);
  const p2R = new THREE.Vector2(cx - left2.x * half, cz - left2.y * half);

  function isect(pA, dA, pB, dB) {
    const denom = dA.x * dB.y - dA.y * dB.x;
    if (Math.abs(denom) < 1e-9) return pA.clone();
    const t = ((pB.x - pA.x) * dB.y - (pB.y - pA.y) * dB.x) / denom;
    return new THREE.Vector2(pA.x + t * dA.x, pA.y + t * dA.y);
  }

  const outer2 = isect(p1L, fwd1, p2L, dir2);
  const inner2 = isect(p1R, fwd1, p2R, dir2);
  function to3(v2) { return new THREE.Vector3(v2.x, 0, v2.y); }
  const outer = to3(outer2), inner = to3(inner2);

  const far1_top2 = new THREE.Vector2(p1L.x - fwd1.x * legLen, p1L.y - fwd1.y * legLen);
  const far1_bot2 = new THREE.Vector2(p1R.x - fwd1.x * legLen, p1R.y - fwd1.y * legLen);
  const far2_top2 = new THREE.Vector2(p2L.x + dir2.x * legLen, p2L.y + dir2.y * legLen);
  const far2_bot2 = new THREE.Vector2(p2R.x + dir2.x * legLen, p2R.y + dir2.y * legLen);
  const far1Mid = to3(new THREE.Vector2((far1_top2.x + far1_bot2.x) / 2, (far1_top2.y + far1_bot2.y) / 2));
  const far2Mid = to3(new THREE.Vector2((far2_top2.x + far2_bot2.x) / 2, (far2_top2.y + far2_bot2.y) / 2));
  const jointMid = new THREE.Vector3((outer.x + inner.x) / 2, 0, (outer.z + inner.z) / 2);

  const seg1 = makeUSegment(THREE, far1Mid.distanceTo(jointMid), width, wallH);
  alignSegment(THREE, seg1, far1Mid, jointMid);
  const seg2 = makeUSegment(THREE, far2Mid.distanceTo(jointMid), width, wallH);
  alignSegment(THREE, seg2, jointMid, far2Mid);
  objGroup.add(seg1, seg2);

  const outerTop = outer.clone().setY(wallH), innerTop = inner.clone().setY(wallH);
  objGroup.add(dashLine(THREE, outer, inner));
  objGroup.add(dashLine(THREE, outerTop, innerTop));
  objGroup.add(dashLine(THREE, outer, outerTop));
  objGroup.add(dashLine(THREE, inner, innerTop));

  // Cut plane triangle visualization (miter cut area)
  objGroup.add(cutQuadMesh(THREE, outer, inner, innerTop, outerTop));

  setTarget(new THREE.Vector3(0, wallH * 0.6, 0), legLen * 1.8 + 1.5);
}

// ── Tab 4: Tee ──
export function build3D_tee(THREE, objGroup, setTarget, W1, W2, alpha) {
  const a = deg2rad(alpha);
  const w1 = Math.max(0.7, Math.min(2.4, mmToUnits(W1)));
  const w2 = Math.max(0.5, Math.min(2.0, mmToUnits(W2)));
  const wallH = w1 * 0.24;
  const mainLen = 3.0, branchLen = 1.6;
  const notch = w2 / Math.sin(a);

  const m0 = new THREE.Vector3(-mainLen / 2, 0, 0), m1 = new THREE.Vector3(mainLen / 2, 0, 0);
  const main = makeUSegment(THREE, mainLen, w1, wallH); alignSegment(THREE, main, m0, m1);
  objGroup.add(main);

  const dirBranch = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).normalize();
  const start = new THREE.Vector3(0, wallH, 0);
  const end = new THREE.Vector3().addVectors(start, dirBranch.clone().multiplyScalar(branchLen));
  const branch = makeUSegment(THREE, branchLen, w2, wallH * 0.85);
  alignSegment(THREE, branch, start, end, new THREE.Vector3(0, 0, -1));
  objGroup.add(branch);

  const halfN = notch / 2;
  const c1 = new THREE.Vector3(-dirBranch.x * halfN, wallH, -dirBranch.z * halfN);
  const c2 = new THREE.Vector3(dirBranch.x * halfN, wallH, dirBranch.z * halfN);
  const geo = new THREE.BufferGeometry().setFromPoints([c1, c2]);
  const mat = new THREE.LineDashedMaterial({ color: CUT_HEX, dashSize: 0.05, gapSize: 0.04, linewidth: 2 });
  const line = new THREE.Line(geo, mat); line.computeLineDistances();
  objGroup.add(line);

  // Cut area triangles on the main duct wall (where branch connects)
  const perpBranch = new THREE.Vector3(dirBranch.z, 0, -dirBranch.x).normalize();
  const notchW = w1 * 0.4; // visual depth of notch on wall
  const nc1 = c1.clone();
  const nc2 = c2.clone();
  const nc3 = c2.clone().add(perpBranch.clone().multiplyScalar(notchW));
  const nc4 = c1.clone().add(perpBranch.clone().multiplyScalar(notchW));
  objGroup.add(cutQuadMesh(THREE, nc1, nc2, nc3, nc4));

  setTarget(new THREE.Vector3(0, wallH, 0), mainLen * 0.95);
}

// ── Tab 5: Cross ── (Fixed: branches now properly go to opposite sides)
export function build3D_cross(THREE, objGroup, setTarget, W1, W2, alpha) {
  const a = deg2rad(alpha);
  const w1 = Math.max(0.7, Math.min(2.4, mmToUnits(W1)));
  const w2 = Math.max(0.5, Math.min(2.0, mmToUnits(W2)));
  const wallH = w1 * 0.24;
  const mainLen = 3.0, branchLen = 1.5;
  const notch = w2 / Math.sin(a);
  const halfN = notch / 2;

  const m0 = new THREE.Vector3(-mainLen / 2, 0, 0), m1 = new THREE.Vector3(mainLen / 2, 0, 0);
  const main = makeUSegment(THREE, mainLen, w1, wallH); alignSegment(THREE, main, m0, m1);
  objGroup.add(main);

  function addBranch(sign) {
    // FIX: direction is correctly mirrored for the opposite branch
    const dir = new THREE.Vector3(Math.cos(a), 0, sign * (-Math.sin(a))).normalize();
    const start = new THREE.Vector3(0, wallH, 0);
    const end = new THREE.Vector3().addVectors(start, dir.clone().multiplyScalar(branchLen));
    const branch = makeUSegment(THREE, branchLen, w2, wallH * 0.85);
    alignSegment(THREE, branch, start, end, new THREE.Vector3(0, 0, sign * -1));
    objGroup.add(branch);
    const c1 = new THREE.Vector3(-dir.x * halfN, wallH, -dir.z * halfN);
    const c2 = new THREE.Vector3(dir.x * halfN, wallH, dir.z * halfN);
    const geo = new THREE.BufferGeometry().setFromPoints([c1, c2]);
    const mat = new THREE.LineDashedMaterial({ color: CUT_HEX, dashSize: 0.05, gapSize: 0.04, linewidth: 2 });
    const line = new THREE.Line(geo, mat); line.computeLineDistances();
    objGroup.add(line);

    // Cut area on main duct wall
    const perpBranch = new THREE.Vector3(dir.z, 0, -dir.x).normalize();
    const notchW = w1 * 0.35;
    const nc1 = c1.clone();
    const nc2 = c2.clone();
    const nc3 = c2.clone().add(perpBranch.clone().multiplyScalar(sign * notchW));
    const nc4 = c1.clone().add(perpBranch.clone().multiplyScalar(sign * notchW));
    objGroup.add(cutQuadMesh(THREE, nc1, nc2, nc3, nc4));
  }

  addBranch(1);
  addBranch(-1);

  setTarget(new THREE.Vector3(0, wallH, 0), mainLen * 0.95);
}
