import React, { useState, useMemo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Svg2DView from '../Svg2DView';
import ThreeView from '../ThreeView';
import FlatPatternView from '../FlatPatternView';
import ReadoutPanel from '../ReadoutPanel';
import FormulaBar from '../FormulaBar';
import { calcElbow, fmt, deg2rad, lineIntersect } from '../utils/calculations';
import { defsBlock, angleArc, labelPill, AMBER, STEEL, STEEL_L, CYAN } from '../utils/svgHelpers';
import { flatPattern_elbow } from '../utils/flatPatterns';
import { build3D_elbow } from '../threeBuilders';

export default function ElbowTab() {
  const [A, setA] = useState(150);
  const [theta, setTheta] = useState(90);
  const [view, setView] = useState('3d');

  const result = useMemo(() => calcElbow(A, theta), [A, theta]);

  const svgContent = useMemo(() => {
    const { L } = result;
    const thetaRad = deg2rad(theta);
    const Apx = 70;
    const legLen = 150;
    const cx = 320, cy = 210;

    const fwd1 = { x: 1, y: 0 };
    const dir2 = { x: Math.cos(thetaRad), y: -Math.sin(thetaRad) };

    function perp(d) { return { x: -d.y, y: d.x }; }
    const left1 = perp(fwd1);
    const left2 = perp(dir2);

    const half = Apx / 2;
    const p1_left_pt = { x: cx + left1.x * half, y: cy + left1.y * half };
    const p1_right_pt = { x: cx - left1.x * half, y: cy - left1.y * half };
    const p2_left_pt = { x: cx + left2.x * half, y: cy + left2.y * half };
    const p2_right_pt = { x: cx - left2.x * half, y: cy - left2.y * half };

    const outer = lineIntersect(p1_left_pt, fwd1, p2_left_pt, dir2);
    const inner = lineIntersect(p1_right_pt, fwd1, p2_right_pt, dir2);

    const far1_top = { x: p1_left_pt.x - fwd1.x * legLen, y: p1_left_pt.y - fwd1.y * legLen };
    const far1_bot = { x: p1_right_pt.x - fwd1.x * legLen, y: p1_right_pt.y - fwd1.y * legLen };
    const far2_top = { x: p2_left_pt.x + dir2.x * legLen, y: p2_left_pt.y + dir2.y * legLen };
    const far2_bot = { x: p2_right_pt.x + dir2.x * legLen, y: p2_right_pt.y + dir2.y * legLen };

    let svg = defsBlock() + `<rect width="640" height="380" fill="#0d1418"/><rect width="640" height="380" fill="url(#grid)"/>`;

    function polyPath(pts, color) {
      const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ') + ' Z';
      return `<path d="${d}" fill="${color}" fill-opacity="0.14" stroke="${STEEL}" stroke-width="2.2" stroke-linejoin="round"/>`;
    }

    const leg1poly = [far1_top, outer, inner, far1_bot];
    const leg2poly = [outer, far2_top, far2_bot, inner];
    svg += polyPath(leg1poly, STEEL_L);
    svg += polyPath(leg2poly, STEEL_L);

    svg += `<line x1="${outer.x.toFixed(1)}" y1="${outer.y.toFixed(1)}" x2="${inner.x.toFixed(1)}" y2="${inner.y.toFixed(1)}" stroke="${AMBER}" stroke-width="3" marker-start="url(#arrowAmber)" marker-end="url(#arrowAmber)"/>`;
    svg += labelPill((outer.x + inner.x) / 2 + (dir2.x - fwd1.x) * 22, (outer.y + inner.y) / 2 - 30, 'L = ' + fmt(L) + ' mm', AMBER);

    const a1 = Math.atan2(-fwd1.y, -fwd1.x);
    const a2 = Math.atan2(dir2.y, dir2.x);
    svg += angleArc(cx, cy, 44, a1, a2, CYAN, theta + '°');

    const dm = {
      x: (far1_top.x + far1_bot.x) / 2 - fwd1.x * 30,
      y: (far1_top.y + far1_bot.y) / 2 - fwd1.y * 30
    };
    svg += `<line x1="${far1_top.x - fwd1.x * 30}" y1="${far1_top.y - fwd1.y * 30}" x2="${far1_bot.x - fwd1.x * 30}" y2="${far1_bot.y - fwd1.y * 30}" stroke="${STEEL_L}" stroke-width="1.3" marker-start="url(#arrowSteel)" marker-end="url(#arrowSteel)"/>`;
    svg += labelPill(dm.x, dm.y, 'A = ' + fmt(A) + ' mm', STEEL_L);

    return svg;
  }, [A, theta, result]);

  const flatData = useMemo(() => flatPattern_elbow(A, theta), [A, theta]);

  const buildScene = useCallback((THREE, objGroup, setTarget) => {
    build3D_elbow(THREE, objGroup, setTarget, A, theta);
  }, [A, theta]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
      <div className="space-y-5 bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-card-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-amber-400 rotate-45 inline-block" />
          Thông số
        </h3>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Chiều rộng máng — A
            <span className="font-mono text-amber-400">{fmt(A)} mm</span>
          </Label>
          <Input type="number" value={A} min={10} max={1000} step={5}
            onChange={e => setA(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Góc rẽ — Θ
            <span className="font-mono text-amber-400">{fmt(theta)}°</span>
          </Label>
          <Slider value={[theta]} min={10} max={170} step={1} onValueChange={(v) => setTheta(Array.isArray(v) ? v[0] : v)} />
        </div>
        <p className="text-xs text-muted-foreground border-t border-dashed border-border pt-3">
          Co ngang (elbow) đổi hướng máng trong cùng một mặt phẳng. Đường cắt vát (miter) chia đôi góc rẽ Θ. Θ = 90° là co vuông góc phổ biến nhất.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-1.5">
          <button onClick={() => setView('3d')} className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === '3d' ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            3D mô phỏng
          </button>
          <button onClick={() => setView('2d')} className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === '2d' ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            2D mặt cắt
          </button>
          <button onClick={() => setView('flat')} className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === 'flat' ? 'border-red-400 text-red-400 bg-red-400/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            ✂ Trải tấm
          </button>
        </div>

        {view === '3d' ? (
          <ThreeView buildScene={buildScene} deps={[A, theta]} />
        ) : view === '2d' ? (
          <Svg2DView svgContent={svgContent} viewBox="0 0 640 380" />
        ) : (
          <FlatPatternView svgContent={flatData.svg} viewBox={flatData.viewBox} />
        )}

        <div className="flex gap-4 flex-wrap text-[11px] text-muted-foreground px-0.5">
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 bg-gray-400 inline-block" />2 đoạn máng</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block" style={{ background: 'repeating-linear-gradient(90deg,#ff7a6b 0 5px,transparent 5px 9px)' }} />Đường cắt vát (miter)</span>
        </div>

        <FormulaBar html={`<b>L</b> = A / cos(Θ/2) = ${fmt(A)} / cos(${fmt(theta / 2)}°) = <b>${fmt(result.L)} mm</b>`} />
        <ReadoutPanel items={[
          { label: 'Chiều dài đường cắt vát (L)', value: fmt(result.L), unit: 'mm' },
          { label: 'Góc cắt mỗi bên (Θ/2)', value: fmt(theta / 2), unit: '°' },
          { label: 'Chênh lệch so với A', value: fmt(result.L - A), unit: 'mm' },
        ]} />
      </div>
    </div>
  );
}
