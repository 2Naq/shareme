import React, { useState, useMemo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Svg2DView from '../Svg2DView';
import ThreeView from '../ThreeView';
import ReadoutPanel from '../ReadoutPanel';
import FormulaBar from '../FormulaBar';
import { calcTee, fmt, deg2rad } from '../utils/calculations';
import { defsBlock, gridRect, angleArc, dimHorizontal, dimVertical, labelPill, AMBER, STEEL, STEEL_L, CYAN } from '../utils/svgHelpers';
import { build3D_tee } from '../threeBuilders';

export default function TeeTab() {
  const [W1, setW1] = useState(200);
  const [W2, setW2] = useState(150);
  const [alpha, setAlpha] = useState(90);
  const [view, setView] = useState('3d');

  const result = useMemo(() => calcTee(W1, W2, alpha), [W1, W2, alpha]);

  const svgContent = useMemo(() => {
    const { notch } = result;
    const a = deg2rad(alpha);
    const scale = 0.7;
    const mainY = 170, mainH = 44 * scale * 2;
    const mainLeft = 60, mainRight = 580;
    const cx = (mainLeft + mainRight) / 2;
    const notchPx = notch * scale;
    const halfN = notchPx / 2;

    let svg = defsBlock() + gridRect(640, 340);
    svg += `<rect x="${mainLeft}" y="${mainY - mainH / 2}" width="${mainRight - mainLeft}" height="${mainH}" fill="none" stroke="${STEEL}" stroke-width="3"/>`;

    const nx1 = cx - Math.cos(a) * halfN, nx2 = cx + Math.cos(a) * halfN;
    svg += `<line x1="${nx1}" y1="${mainY - mainH / 2}" x2="${nx2}" y2="${mainY - mainH / 2}" stroke="${AMBER}" stroke-width="4"/>`;

    const branchLen = 130;
    const bdx = Math.cos(a), bdy = -Math.sin(a);
    const b1 = { x: nx1, y: mainY - mainH / 2 };
    const b2 = { x: nx2, y: mainY - mainH / 2 };
    const b1e = { x: b1.x + bdx * branchLen, y: b1.y + bdy * branchLen };
    const b2e = { x: b2.x + bdx * branchLen, y: b2.y + bdy * branchLen };
    svg += `<path d="M${b1.x},${b1.y} L${b1e.x.toFixed(1)},${b1e.y.toFixed(1)} L${b2e.x.toFixed(1)},${b2e.y.toFixed(1)} L${b2.x},${b2.y}" fill="none" stroke="${STEEL_L}" stroke-width="3"/>`;

    // Fix: compute angle arc correctly for any alpha
    const branchAngle = Math.atan2(bdy, bdx);
    const verticalAngle = -Math.PI / 2;
    svg += angleArc(cx, mainY - mainH / 2, 40, verticalAngle, branchAngle, CYAN, alpha + '°');

    svg += dimHorizontal(nx1, nx2, mainY - mainH / 2 - 26, 'khấc = ' + fmt(notch) + ' mm');
    svg += dimVertical(mainLeft - 24, mainY - mainH / 2, mainY + mainH / 2, 'W1=' + fmt(W1) + ' mm');
    svg += labelPill((b1e.x + b2e.x) / 2, (b1e.y + b2e.y) / 2 - 14, 'W2=' + fmt(W2) + ' mm', STEEL_L);
    return svg;
  }, [W1, W2, alpha, result]);

  const buildScene = useCallback((THREE, objGroup, setTarget) => {
    build3D_tee(THREE, objGroup, setTarget, W1, W2, alpha);
  }, [W1, W2, alpha]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
      <div className="space-y-5 bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-card-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-amber-400 rotate-45 inline-block" />
          Thông số
        </h3>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Bề rộng máng chính — W1
            <span className="font-mono text-amber-400">{fmt(W1)} mm</span>
          </Label>
          <Input type="number" value={W1} min={10} max={1000} step={5}
            onChange={e => setW1(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Bề rộng máng nhánh — W2
            <span className="font-mono text-amber-400">{fmt(W2)} mm</span>
          </Label>
          <Input type="number" value={W2} min={10} max={1000} step={5}
            onChange={e => setW2(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Góc nhánh — α
            <span className="font-mono text-amber-400">{fmt(alpha)}°</span>
          </Label>
          <Slider value={[alpha]} min={20} max={160} step={1} onValueChange={v => setAlpha(v[0])} />
        </div>
        <p className="text-xs text-muted-foreground border-t border-dashed border-border pt-3">
          Khấc cắt trên thân máng chính để lắp nhánh rẽ. α = 90° là tê vuông góc thông dụng nhất; α khác 90° cho nhánh xiên.
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
        </div>

        {view === '3d' ? (
          <ThreeView buildScene={buildScene} deps={[W1, W2, alpha]} />
        ) : (
          <Svg2DView svgContent={svgContent} viewBox="0 0 640 340" />
        )}

        <div className="flex gap-4 flex-wrap text-[11px] text-muted-foreground px-0.5">
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 bg-gray-400 inline-block" />Máng chính / nhánh</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block" style={{ background: 'repeating-linear-gradient(90deg,#ff7a6b 0 5px,transparent 5px 9px)' }} />Khấc cắt trên máng chính</span>
        </div>

        <FormulaBar html={`<b>Khấc</b> = W2 / sin(α) = ${fmt(W2)} / sin(${fmt(alpha)}°) = <b>${fmt(result.notch)} mm</b>`} />
        <ReadoutPanel items={[
          { label: 'Chiều dài khấc cắt', value: fmt(result.notch), unit: 'mm' },
          { label: 'Góc nhánh', value: fmt(alpha), unit: '°' },
        ]} />
      </div>
    </div>
  );
}
