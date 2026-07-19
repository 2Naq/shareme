import React, { useState, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResistorSVG from "./component/resistorSVG";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import MathRendererBlock from "@/components/MathRenderer";
import { formatResistance, formatMultiplier } from "./utils";

const COLOR_BANDS = [
  {
    name: "Đen",
    nameEn: "Black",
    hex: "#1a1a1a",
    digit: 0,
    multiplier: 1,
    tolerance: null,
  },
  {
    name: "Nâu",
    nameEn: "Brown",
    hex: "#8B4513",
    digit: 1,
    multiplier: 10,
    tolerance: "±1%",
  },
  {
    name: "Đỏ",
    nameEn: "Red",
    hex: "#DC2626",
    digit: 2,
    multiplier: 100,
    tolerance: "±2%",
  },
  {
    name: "Cam",
    nameEn: "Orange",
    hex: "#EA580C",
    digit: 3,
    multiplier: 1e3,
    tolerance: "±3%",
  },
  {
    name: "Vàng",
    nameEn: "Yellow",
    hex: "#EAB308",
    digit: 4,
    multiplier: 1e4,
    tolerance: "±4%",
  },
  {
    name: "Lục",
    nameEn: "Green",
    hex: "#16A34A",
    digit: 5,
    multiplier: 1e5,
    tolerance: "±0.5%",
  },
  {
    name: "Lam",
    nameEn: "Blue",
    hex: "#2563EB",
    digit: 6,
    multiplier: 1e6,
    tolerance: "±0.25%",
  },
  {
    name: "Tím",
    nameEn: "Violet",
    hex: "#7C3AED",
    digit: 7,
    multiplier: 1e7,
    tolerance: "±0.1%",
  },
  {
    name: "Xám",
    nameEn: "Gray",
    hex: "#6B7280",
    digit: 8,
    multiplier: 1e8,
    tolerance: "±0.05%",
  },
  {
    name: "Trắng",
    nameEn: "White",
    hex: "#F5F5F5",
    digit: 9,
    multiplier: 1e9,
    tolerance: null,
  },
  {
    name: "Vàng kim",
    nameEn: "Gold",
    hex: "#D4A843",
    digit: null,
    multiplier: 0.1,
    tolerance: "±5%",
  },
  {
    name: "Bạc",
    nameEn: "Silver",
    hex: "#C0C0C0",
    digit: null,
    multiplier: 0.01,
    tolerance: "±10%",
  },
  {
    name: "Không màu",
    nameEn: "None",
    hex: "transparent",
    digit: null,
    multiplier: null,
    tolerance: "±20%",
  },
];

const DIGIT_COLORS = COLOR_BANDS.filter((c) => c.digit !== null); // 0-9
const MULTIPLIER_COLORS = COLOR_BANDS.filter((c) => c.multiplier !== null);
const TOLERANCE_COLORS = COLOR_BANDS.filter((c) => c.tolerance !== null);

// ============================================================
// COLOR PICKER POPUP
// ============================================================

function ColorPickerContent({
  colors,
  selectedIndex,
  onSelect,
  onClose,
  bandType,
}) {
  const getLabel = (color) => {
    if (bandType === "digit") return `${color.name} (${color.digit})`;
    if (bandType === "multiplier")
      return `${color.name} ${formatMultiplier(color.multiplier)}`;
    if (bandType === "tolerance") return `${color.name} ${color.tolerance}`;
    return color.name;
  };

  return (
    <>
      <DialogHeader className="mb-2">
        <DialogTitle className="text-center font-bold">
          {bandType === "digit"
            ? "Chọn chữ số"
            : bandType === "multiplier"
              ? "Chọn hệ số nhân"
              : "Chọn dung sai"}
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-1 p-1">
        {colors.map((color, idx) => (
          <button
            key={color.nameEn}
            onClick={() => {
              onSelect(idx);
              onClose();
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer            hover:bg-accent/80 ${selectedIndex === idx ? "ring-2 ring-primary bg-accent" : "bg-transparent"}`}
          >
            <span
              className="size-5 rounded-md border border-border/60 shrink-0 shadow-sm"
              style={{
                backgroundColor:
                  color.hex === "transparent" ? "transparent" : color.hex,
                backgroundImage:
                  color.hex === "transparent"
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                    : "none",
                backgroundSize: "6px 6px",
                backgroundPosition: "0 0, 3px 3px",
              }}
            />
            <span title={getLabel(color)} className="text-foreground truncate">
              {getLabel(color)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

// ============================================================
// TAB 1: THROUGH-HOLE COLOR BAND
// ============================================================

export default function ResistorCaculator() {
  const [bandCount, setBandCount] = useState(4);
  const [bands4, setBands4] = useState([1, 0, 2, 10]); // Brown-Black-Red-Gold = 1kΩ ±5%
  const [bands5, setBands5] = useState([1, 0, 0, 1, 10]); // Brown-Black-Black-Brown-Gold = 1kΩ ±5%

  const [pickerOpen, setPickerOpen] = useState(null); // { bandIndex, position }
  const containerRef = useRef(null);

  const bands = bandCount === 4 ? bands4 : bands5;
  const setBands = bandCount === 4 ? setBands4 : setBands5;

  // Get available colors for each band position
  const getColorsForBand = (bandIndex) => {
    if (bandCount === 4) {
      if (bandIndex < 2) return DIGIT_COLORS;
      if (bandIndex === 2) return MULTIPLIER_COLORS;
      return TOLERANCE_COLORS;
    } else {
      if (bandIndex < 3) return DIGIT_COLORS;
      if (bandIndex === 3) return MULTIPLIER_COLORS;
      return TOLERANCE_COLORS;
    }
  };

  const getBandType = (bandIndex) => {
    if (bandCount === 4) {
      if (bandIndex < 2) return "digit";
      if (bandIndex === 2) return "multiplier";
      return "tolerance";
    } else {
      if (bandIndex < 3) return "digit";
      if (bandIndex === 3) return "multiplier";
      return "tolerance";
    }
  };

  // Get the actual color object for each band
  const getBandColor = (bandIndex) => {
    const colorList = getColorsForBand(bandIndex);
    const value = bands[bandIndex];
    return colorList[value] || colorList[0];
  };

  // Calculate result
  const { resistance, toleranceStr, formula } = useMemo(() => {
    const bandColors = bands.map((_, i) => getBandColor(i));

    let value = 0;
    let tol = "";
    let form = "";
    let tolNum = 0;
    let tolValue = 0;

    if (bandCount === 4) {
      const d1 = bandColors[0].digit;
      const d2 = bandColors[1].digit;
      const mult = bandColors[2].multiplier;
      const tolColor = bandColors[3];

      value = (d1 * 10 + d2) * mult;
      tol = tolColor.tolerance || "–";
      tolNum = Number(tol.slice(1, tol.length - 1));
      tolValue = value * (tolNum / 100);

      // form = `${d1}${d2} × ${formatMultiplier(mult)} = ${formatResistance(value)} ${tol}`;
      form = `${d1}${d2} \\times ${formatMultiplier(mult)} = ${formatResistance(value)} 
            \\\\
            ${tol.replace("%", "\\%")}
            \\left[ \\begin{matrix}
                +${formatResistance(value + tolValue)} \\\\
                -${formatResistance(value - tolValue)} \\\\
            \\end{matrix} \\right]`;
    } else {
      const d1 = bandColors[0].digit;
      const d2 = bandColors[1].digit;
      const d3 = bandColors[2].digit;
      const mult = bandColors[3].multiplier;
      const tolColor = bandColors[4];

      value = (d1 * 100 + d2 * 10 + d3) * mult;
      tol = tolColor.tolerance || "–";
      tolNum = Number(tol.slice(1, tol.length - 1));
      tolValue = value * (tolNum / 100);

      form = `${d1}${d2}${d3} \\times ${formatMultiplier(mult)} = ${formatResistance(value)} 
            \\\\
            ${tol.replace("%", "\\%")}
            \\left[ \\begin{matrix}
                +${formatResistance(value + tolValue)} \\\\
                -${formatResistance(value - tolValue)} \\\\
            \\end{matrix} \\right]`;
    }

    return { resistance: value, toleranceStr: tol, formula: form };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [bands, bandCount]);

  const handleBandClick = (bandIndex, event) => {
    // Use viewport coordinates for portal-based popup
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;

    setPickerOpen({ bandIndex, position: { x, y } });
  };

  const handleColorSelect = (colorIndex) => {
    if (pickerOpen === null) return;
    const newBands = [...bands];
    newBands[pickerOpen.bandIndex] = colorIndex;
    setBands(newBands);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Band count selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <Label className="text-sm font-medium">Loại điện trở:</Label>
        <div className="flex gap-2">
          <button
            onClick={() => setBandCount(4)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                bandCount === 4
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }
            `}
          >
            4 Vòng Màu
          </button>
          <button
            onClick={() => setBandCount(5)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                bandCount === 5
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }
            `}
          >
            5 Vòng Màu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Interactive Resistor SVG */}
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Bấm vào vòng màu để thay đổi
            </CardTitle>
            <CardDescription>
              Click trực tiếp vào các vòng màu trên điện trở để chọn giá trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={containerRef}>
              <ResistorSVG
                bands={bands.map((_, i) => getBandColor(i))}
                bandCount={bandCount}
                onBandClick={handleBandClick}
              />
              <Dialog
                open={pickerOpen !== null}
                onOpenChange={(open) => !open && setPickerOpen(null)}
              >
                <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-2xl rounded-xl p-4 gap-2">
                  {pickerOpen !== null && (
                    <ColorPickerContent
                      colors={getColorsForBand(pickerOpen.bandIndex)}
                      selectedIndex={bands[pickerOpen.bandIndex]}
                      onSelect={handleColorSelect}
                      onClose={() => setPickerOpen(null)}
                      bandType={getBandType(pickerOpen.bandIndex)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Giá trị điện trở
                </p>
                <p className="text-4xl font-black font-mono text-primary transition-all duration-300">
                  {formatResistance(resistance)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Dung sai
                </p>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-1 font-mono"
                >
                  {toleranceStr}
                </Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded-lg border bg-grid">
              <p className="text-xs text-muted-foreground mb-1 ">Công thức</p>
              {/* <p className="font-mono text-sm text-foreground">{formula}</p> */}
              <MathRendererBlock formula={formula} />
            </div>

            {/* Current band selection summary */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {bands.map((_, i) => {
                const color = getBandColor(i);
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="size-4 rounded border border-border/60 shadow-sm"
                      style={{
                        backgroundColor:
                          color.hex === "transparent" ? "#E5E7EB" : color.hex,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {color.name}
                    </span>
                    {i < bands.length - 1 && (
                      <span className="text-muted-foreground/30 mx-1">–</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Reference Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bảng Mã Màu Điện Trở</CardTitle>
          <CardDescription>Tra cứu nhanh các giá trị màu sắc</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-semibold">Màu sắc</th>
                <th className="text-center py-2 px-2 font-semibold">Chữ số</th>
                <th className="text-center py-2 px-2 font-semibold">
                  Hệ số nhân
                </th>
                <th className="text-center py-2 px-2 font-semibold">
                  Dung sai
                </th>
              </tr>
            </thead>
            <tbody>
              {COLOR_BANDS.map((color) => (
                <tr
                  key={color.nameEn}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-5 rounded border border-border/60 shadow-sm shrink-0"
                        style={{
                          backgroundColor:
                            color.hex === "transparent" ? "#E5E7EB" : color.hex,
                          backgroundImage:
                            color.hex === "transparent"
                              ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)"
                              : "none",
                          backgroundSize: "6px 6px",
                          backgroundPosition: "0 0, 3px 3px",
                        }}
                      />
                      <span className="font-medium">{color.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-2 px-2 font-mono">
                    {color.digit !== null ? color.digit : "–"}
                  </td>
                  <td className="text-center py-2 px-2 font-mono text-xs">
                    {color.multiplier !== null
                      ? formatMultiplier(color.multiplier)
                      : "–"}
                  </td>
                  <td className="text-center py-2 px-2 font-mono text-xs">
                    {color.tolerance || "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
