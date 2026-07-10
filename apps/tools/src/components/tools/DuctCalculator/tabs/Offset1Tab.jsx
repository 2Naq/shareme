import React, { useState, useMemo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Svg2DView from '../Svg2DView';
import ThreeView from '../ThreeView';
import ReadoutPanel from '../ReadoutPanel';
import FormulaBar from '../FormulaBar';
import { calcOffset1, fmt, deg2rad } from '../utils/calculations';
import { defsBlock, gridRect, trayPath, angleArc, dimAlong, dimVertical, dimHorizontal, AMBER, STEEL, STEEL_L, CYAN } from '../utils/svgHelpers';
import { build3D_offset1 } from '../threeBuilders';

export default function Offset1Tab() {
  const [A, setA] = useState(300);
  const [beta, setBeta] = useState(45);
  const [view, setView] = useState('3d');

  const result = useMemo(() => calcOffset1(A, beta), [A, beta]);

  const svgContent = useMemo(() => {
    const { L, run } = result;
    const b = deg2rad(beta);
    const unitA = 90;
    const runPx = unitA / Math.tan(b);
    const legLen = 105;
    const baseX = 60, baseY = 290;
    const p0 = [baseX, baseY];
    const p1 = [baseX + legLen, baseY];
    const p2 = [p1[0] + runPx, baseY - unitA];
    const p3 = [p2[0] + legLen, p2[1]];

    let svg = defsBlock() + gridRect(640, 360);
    svg += trayPath([p0, p1], STEEL, 18);
    svg += trayPath([p1, p2], AMBER, 18);
    svg += trayPath([p2, p3], STEEL, 18);
    svg += angleArc(p1[0], p1[1], 38, Math.PI, Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), CYAN, beta + '°');
    svg += dimAlong(
      p1[0] + (p2[0] - p1[0]) * 0.18, p1[1] + (p2[1] - p1[1]) * 0.18 - 14,
      p2[0] - (p2[0] - p1[0]) * 0.18, p2[1] - (p2[1] - p1[1]) * 0.18 - 14,
      'L = ' + fmt(L) + ' mm', AMBER
    );
    svg += dimVertical(p3[0] + 34, p1[1], p2[1], 'A = ' + fmt(A) + ' mm');
    svg += dimHorizontal(p1[0], p2[0], baseY + 34, 'chạy ngang = ' + fmt(run) + ' mm', STEEL_L);
    return svg;
  }, [A, beta, result]);

  const buildScene = useCallback((THREE, objGroup, setTarget) => {
    build3D_offset1(THREE, objGroup, setTarget, A, beta);
  }, [A, beta]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
      {/* Panel bên trái */}
      <div className="space-y-5 bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-card-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-amber-400 rotate-45 inline-block" />
          Thông số
        </h3>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Chiều cao lệch tầng — A
            <span className="font-mono text-amber-400">{fmt(A)} mm</span>
          </Label>
          <Input
            type="number" value={A} min={10} max={2000} step={5}
            onChange={e => setA(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Góc nghiêng đường chéo — β
            <span className="font-mono text-amber-400">{fmt(beta)}°</span>
          </Label>
          <Slider
            value={[beta]} min={10} max={80} step={0.5}
            onValueChange={v => setBeta(v[0])}
          />
        </div>
        <p className="text-xs text-muted-foreground border-t border-dashed border-border pt-3">
          Dùng khi cần nâng/hạ cao độ máng bằng một đoạn chéo duy nhất (1 khúc gấp). Góc càng nhỏ, đường chéo càng dài nhưng độ dốc càng thoải.
        </p>
      </div>

      {/* Stage bên phải */}
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
          <ThreeView buildScene={buildScene} deps={[A, beta]} />
        ) : (
          <Svg2DView svgContent={svgContent} viewBox="0 0 640 360" />
        )}

        <div className="flex gap-4 flex-wrap text-[11px] text-muted-foreground px-0.5">
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 bg-gray-400 inline-block" />Đoạn máng giữ nguyên</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block" style={{ background: 'repeating-linear-gradient(90deg,#ff7a6b 0 5px,transparent 5px 9px)' }} />Đường cắt</span>
        </div>

        <FormulaBar html={`<b>L</b> = A / sin(β) = ${fmt(A)} / sin(${fmt(beta)}°) = <b>${fmt(result.L)} mm</b>`} />
        <ReadoutPanel items={[
          { label: 'Chiều dài đoạn chéo (L)', value: fmt(result.L), unit: 'mm' },
          { label: 'Chạy ngang (hình chiếu)', value: fmt(result.run), unit: 'mm' },
          { label: 'Góc cắt 2 đầu đoạn chéo', value: fmt(beta), unit: '°' },
        ]} />
      </div>
    </div>
  );
}
