import React, { useState, useMemo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Svg2DView from "../Svg2DView";
import ThreeView from "../ThreeView";
import FlatPatternView from "../FlatPatternView";
import ReadoutPanel from "../ReadoutPanel";
import FormulaBar from "../FormulaBar";
import { calcCross, fmt, deg2rad } from "../utils/calculations";
import {
  defsBlock,
  gridRect,
  angleArc,
  dimHorizontal,
  dimVertical,
  AMBER,
  STEEL,
  STEEL_L,
  CYAN,
} from "../utils/svgHelpers";
import { flatPattern_cross } from "../utils/flatPatterns";
import { build3D_cross } from "../threeBuilders";

export default function CrossTab() {
  const [W1, setW1] = useState(200);
  const [W2, setW2] = useState(150);
  const [alpha, setAlpha] = useState(90);
  const [view, setView] = useState("3d");

  const result = useMemo(() => calcCross(W1, W2, alpha), [W1, W2, alpha]);

  const svgContent = useMemo(() => {
    const { notch } = result;
    const a = deg2rad(alpha);
    const scale = 0.7;
    const mainY = 170,
      mainH = 44 * scale * 2;
    const mainLeft = 60,
      mainRight = 580;
    const cx = (mainLeft + mainRight) / 2;
    const notchPx = notch * scale;
    const halfN = notchPx / 2;

    let svg = defsBlock() + gridRect(640, 340);
    svg += `<rect x="${mainLeft}" y="${mainY - mainH / 2}" width="${mainRight - mainLeft}" height="${mainH}" fill="none" stroke="${STEEL}" stroke-width="3"/>`;

    function branch(sign) {
      const edgeY = sign > 0 ? mainY - mainH / 2 : mainY + mainH / 2;
      const nx1 = cx - Math.cos(a) * halfN,
        nx2 = cx + Math.cos(a) * halfN;
      let s = `<line x1="${nx1}" y1="${edgeY}" x2="${nx2}" y2="${edgeY}" stroke="${AMBER}" stroke-width="4"/>`;
      const bdx = Math.cos(a),
        bdy = -Math.sin(a) * sign;
      const branchLen = 110;
      const b1 = { x: nx1, y: edgeY },
        b2 = { x: nx2, y: edgeY };
      const b1e = { x: b1.x + bdx * branchLen, y: b1.y + bdy * branchLen };
      const b2e = { x: b2.x + bdx * branchLen, y: b2.y + bdy * branchLen };
      s += `<path d="M${b1.x},${b1.y} L${b1e.x.toFixed(1)},${b1e.y.toFixed(1)} L${b2e.x.toFixed(1)},${b2e.y.toFixed(1)} L${b2.x},${b2.y}" fill="none" stroke="${STEEL_L}" stroke-width="3"/>`;
      return s;
    }
    svg += branch(1);
    svg += branch(-1);
    svg += dimHorizontal(
      cx - halfN,
      cx + halfN,
      mainY - mainH / 2 - 26,
      "khấc = " + fmt(notch) + " mm",
    );
    svg += dimVertical(
      mainLeft - 24,
      mainY - mainH / 2,
      mainY + mainH / 2,
      "W1=" + fmt(W1) + " mm",
    );

    const branchAngle = Math.atan2(-Math.sin(a), Math.cos(a));
    const verticalAngle = -Math.PI / 2;
    svg += angleArc(
      cx,
      mainY - mainH / 2,
      34,
      verticalAngle,
      branchAngle,
      CYAN,
      alpha + "°",
    );

    return svg;
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [W1, W2, alpha, result]);

  const flatData = useMemo(
    () => flatPattern_cross(W1, W2, alpha),
    [W1, W2, alpha],
  );

  const buildScene = useCallback(
    (THREE, objGroup, setTarget) => {
      build3D_cross(THREE, objGroup, setTarget, W1, W2, alpha);
    },
    [W1, W2, alpha],
  );

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
          <Input
            type="number"
            value={W1}
            min={10}
            max={1000}
            step={5}
            onChange={(e) => setW1(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Bề rộng 2 nhánh — W2
            <span className="font-mono text-amber-400">{fmt(W2)} mm</span>
          </Label>
          <Input
            type="number"
            value={W2}
            min={10}
            max={1000}
            step={5}
            onChange={(e) => setW2(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Góc nhánh — α
            <span className="font-mono text-amber-400">{fmt(alpha)}°</span>
          </Label>
          <Slider
            value={[alpha]}
            min={20}
            max={160}
            step={1}
            onValueChange={(v) => setAlpha(Array.isArray(v) ? v[0] : v)}
          />
        </div>
        <p className="text-xs text-muted-foreground border-t border-dashed border-border pt-3">
          Chữ thập = 2 khấc cắt đối xứng hai bên thân máng chính, mỗi bên tính
          như một mối tê.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-1.5">
          <button
            onClick={() => setView("3d")}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === "3d" ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            3D mô phỏng
          </button>
          <button
            onClick={() => setView("2d")}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === "2d" ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            2D mặt cắt
          </button>
          <button
            onClick={() => setView("flat")}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${view === "flat" ? "border-red-400 text-red-400 bg-red-400/10" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            ✂ Trải tấm
          </button>
        </div>

        {view === "3d" ? (
          <ThreeView buildScene={buildScene} deps={[W1, W2, alpha]} />
        ) : view === "2d" ? (
          <Svg2DView svgContent={svgContent} viewBox="0 0 640 340" />
        ) : (
          <FlatPatternView
            svgContent={flatData.svg}
            viewBox={flatData.viewBox}
          />
        )}

        <div className="flex gap-4 flex-wrap text-[11px] text-muted-foreground px-0.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gray-400 inline-block" />
            Máng chính / 2 nhánh
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 inline-block"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#ff7a6b 0 5px,transparent 5px 9px)",
              }}
            />
            Khấc cắt 2 bên
          </span>
        </div>

        <FormulaBar
          html={`<b>Khấc</b> = W2 / sin(α) = ${fmt(W2)} / sin(${fmt(alpha)}°) = <b>${fmt(result.notch)} mm</b> <span style="color:${STEEL_L}">(áp dụng cho cả 2 bên)</span>`}
        />
        <ReadoutPanel
          items={[
            {
              label: "Chiều dài khấc mỗi bên",
              value: fmt(result.notch),
              unit: "mm",
            },
            { label: "Góc nhánh", value: fmt(alpha), unit: "°" },
          ]}
        />
      </div>
    </div>
  );
}
