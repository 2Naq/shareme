import React, { useState, useMemo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Svg2DView from "../Svg2DView";
import ThreeView from "../ThreeView";
import FlatPatternView from "../FlatPatternView";
import ReadoutPanel from "../ReadoutPanel";
import FormulaBar from "../FormulaBar";
import { calcOffset2, fmt, deg2rad } from "../utils/calculations";
import {
  defsBlock,
  gridRect,
  trayPath,
  angleArc,
  dimHorizontal,
  dimVertical,
  dimAlong,
  labelPill,
  AMBER,
  STEEL,
  STEEL_L,
  CYAN,
} from "../utils/svgHelpers";
import { flatPattern_offset2 } from "../utils/flatPatterns";
import { build3D_offset2 } from "../threeBuilders";

export default function Offset2Tab() {
  const [A, setA] = useState(100);
  const [phi, setPhi] = useState(22.5);
  const [view, setView] = useState("3d");

  const result = useMemo(() => calcOffset2(A, phi), [A, phi]);

  const svgContent = useMemo(() => {
    const { X, L2a, L2b } = result;
    const p = deg2rad(phi);
    const unitA = 70;
    const notchPx = unitA * Math.tan(p);
    const barLen = 260;
    const cx = 170;
    const topY = 70,
      botY = topY + unitA;

    let svg = defsBlock() + gridRect(640, 380);

    const barLeft = cx - barLen / 2,
      barRight = cx + barLen / 2;
    const notchL = [cx - notchPx, topY],
      notchR = [cx + notchPx, topY],
      apex = [cx, botY];
    svg += `<path d="M${barLeft},${topY} L${notchL[0]},${notchL[1]} L${apex[0]},${apex[1]} L${notchR[0]},${notchR[1]} L${barRight},${topY}
             L${barRight},${botY} L${barLeft},${botY} Z" fill="none" stroke="${STEEL}" stroke-width="3"/>`;
    svg += `<line x1="${notchL[0]}" y1="${notchL[1]}" x2="${apex[0]}" y2="${apex[1]}" stroke="${AMBER}" stroke-width="2.6"/>`;
    svg += `<line x1="${notchR[0]}" y1="${notchR[1]}" x2="${apex[0]}" y2="${apex[1]}" stroke="${AMBER}" stroke-width="2.6"/>`;
    svg += angleArc(
      apex[0],
      apex[1],
      30,
      -Math.PI / 2 - p,
      -Math.PI / 2 + p,
      CYAN,
      phi + "°+" + phi + "°",
    );
    svg += dimHorizontal(cx, notchR[0], topY - 22, "X = " + fmt(X) + " mm");
    svg += dimVertical(barLeft - 30, topY, botY, "A = " + fmt(A) + " mm");
    svg += labelPill(
      cx,
      topY - 46,
      "MẶT PHẲNG THÀNH MÁNG — CẮT KHẤC CHỮ V",
      STEEL_L,
    );

    const fy = 250;
    const foldLegLen = 140;
    const bendAngleTotal = 2 * p;
    const f0 = [80, fy + 80];
    const f1 = [f0[0] + foldLegLen, fy + 80];
    const f2 = [
      f1[0] + foldLegLen * Math.cos(bendAngleTotal),
      fy + 80 - foldLegLen * Math.sin(bendAngleTotal),
    ];
    svg += trayPath([f0, f1, f2], STEEL, 16);
    svg += `<circle cx="${f1[0]}" cy="${f1[1]}" r="4" fill="${AMBER}"/>`;
    svg += dimAlong(
      f0[0],
      f0[1] + 26,
      f1[0],
      f1[1] + 26,
      "L2 trong = " + fmt(L2a) + " mm",
      CYAN,
      2,
    );
    svg += dimAlong(
      f1[0] + (f2[0] - f1[0]) * 0.15,
      f1[1] + (f2[1] - f1[1]) * 0.15 + 18,
      f2[0] - (f2[0] - f1[0]) * 0.1,
      f2[1] - (f2[1] - f1[1]) * 0.1 + 18,
      "L2 ngoài = " + fmt(L2b) + " mm",
      AMBER,
      2,
    );
    svg += labelPill(
      f1[0],
      fy + 40,
      "SAU KHI GẤP LẠI (2 KHÚC " + fmt(phi) + "°)",
      STEEL_L,
    );
    return svg;
  }, [A, phi, result]);

  const flatData = useMemo(() => flatPattern_offset2(A, phi), [A, phi]);

  const buildScene = useCallback(
    (THREE, objGroup, setTarget) => {
      build3D_offset2(THREE, objGroup, setTarget, A, phi);
    },
    [A, phi],
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
            Chiều cao thành máng — A
            <span className="font-mono text-amber-400">{fmt(A)} mm</span>
          </Label>
          <Input
            type="number"
            value={A}
            min={10}
            max={600}
            step={5}
            onChange={(e) => setA(Math.max(10, Number(e.target.value) || 10))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex justify-between">
            Góc mỗi khúc — φ
            <span className="font-mono text-amber-400">{fmt(phi)}°</span>
          </Label>
          <Slider
            value={[phi]}
            min={5}
            max={40}
            step={0.5}
            onValueChange={(v) => setPhi(Array.isArray(v) ? v[0] : v)}
          />
        </div>
        <p className="text-xs text-yellow-600 border-t border-dashed border-yellow-600/30 pt-3">
          Công thức khấc cắt X = A·tan(φ) đã được kiểm chứng khớp với bảng tra
          gốc. Riêng 2 giá trị mép cắt trong/ngoài (L2) là suy ra theo hình học
          nhất quán — nên đối chiếu với bảng tra hoặc đo thử trên vật liệu thật
          trước khi cắt hàng loạt.
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
          <ThreeView buildScene={buildScene} deps={[A, phi]} />
        ) : view === "2d" ? (
          <Svg2DView svgContent={svgContent} viewBox="0 0 640 380" />
        ) : (
          <FlatPatternView
            svgContent={flatData.svg}
            viewBox={flatData.viewBox}
          />
        )}

        <div className="flex gap-4 flex-wrap text-[11px] text-muted-foreground px-0.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gray-400 inline-block" />
            Thành máng
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 inline-block"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#ff7a6b 0 5px,transparent 5px 9px)",
              }}
            />
            Đường cắt khấc chữ V
          </span>
        </div>

        <FormulaBar
          html={`<b>X</b> = A·tan(φ) = ${fmt(A)}×tan(${fmt(phi)}°) = <b>${fmt(result.X)} mm</b>`}
        />
        <ReadoutPanel
          items={[
            { label: "Độ sâu khấc cắt (X)", value: fmt(result.X), unit: "mm" },
            { label: "Mép cắt trong (L2)", value: fmt(result.L2a), unit: "mm" },
            { label: "Mép cắt ngoài (L2)", value: fmt(result.L2b), unit: "mm" },
            { label: "Tổng góc lệch tầng", value: fmt(2 * phi), unit: "°" },
          ]}
        />
      </div>
    </div>
  );
}
