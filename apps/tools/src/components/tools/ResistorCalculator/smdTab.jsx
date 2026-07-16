import React, { useState, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatResistance } from "./utils";

function superscript(n) {
  const map = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
  };
  return String(n)
    .split("")
    .map((c) => map[c] || c)
    .join("");
}

// SMD common values
const SMD_3_COMMON = [
  { code: "100", value: "10Ω" },
  { code: "101", value: "100Ω" },
  { code: "102", value: "1kΩ" },
  { code: "103", value: "10kΩ" },
  { code: "104", value: "100kΩ" },
  { code: "105", value: "1MΩ" },
  { code: "220", value: "22Ω" },
  { code: "221", value: "220Ω" },
  { code: "472", value: "4.7kΩ" },
  { code: "473", value: "47kΩ" },
  { code: "000", value: "0Ω" },
];

const SMD_4_COMMON = [
  { code: "1000", value: "100Ω" },
  { code: "1001", value: "1kΩ" },
  { code: "1002", value: "10kΩ" },
  { code: "1003", value: "100kΩ" },
  { code: "4700", value: "470Ω" },
  { code: "4701", value: "4.7kΩ" },
  { code: "4992", value: "49.9kΩ" },
  { code: "2000", value: "200Ω" },
  { code: "0000", value: "0Ω" },
];

// ============================================================
// SMD RESISTOR SVG
// ============================================================

// oxlint-disable-next-line no-unused-vars
function SmdResistorSVG({ digits, digitCount }) {
  const w = 200;
  const h = 100;
  const bodyW = 140;
  const bodyH = 60;
  const bodyX = (w - bodyW) / 2;
  const bodyY = (h - bodyH) / 2;
  const padW = 16;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full max-w-[240px] mx-auto select-none"
    >
      {/* Pads */}
      <rect
        x={bodyX - padW}
        y={bodyY + 10}
        width={padW}
        height={bodyH - 20}
        rx={2}
        fill="#9CA3AF"
      />
      <rect
        x={bodyX + bodyW}
        y={bodyY + 10}
        width={padW}
        height={bodyH - 20}
        rx={2}
        fill="#9CA3AF"
      />
      {/* Body */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={4}
        fill="#1a1a1a"
        stroke="#333"
        strokeWidth="1.5"
      />
      {/* Text */}
      <text
        x={w / 2}
        y={h / 2 + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[22px] font-bold"
        fill="white"
        fontFamily="monospace"
      >
        {digits.join("")}
      </text>
      {/* Digit markers */}
      {/* {digits.map((d, i) => {
        const spacing = bodyW / (digitCount + 1);
        const cx = bodyX + spacing * (i + 1);
        return (
          <g key={i}>
            <line
              x1={cx} y1={bodyY + bodyH + 2} x2={cx} y2={bodyY + bodyH + 8}
              stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40"
            />
            <text
              x={cx} y={bodyY + bodyH + 18}
              textAnchor="middle"
              className="fill-muted-foreground/60 text-[8px]"
            >
              {i < digitCount - 1 ? `Chữ số ${i + 1}` : 'Hệ số nhân'}
            </text>
          </g>
        );
      })} */}
    </svg>
  );
}

// ============================================================
// TAB 1: SMD 3-DIGIT
// ============================================================

function Smd3DigitTab() {
  const [digits, setDigits] = useState(["1", "0", "3"]);
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    // Only allow single digit
    const char = value.slice(-1);
    if (!/^\d$/.test(char) && value !== "") return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-focus next
    if (char && index < 2) {
      inputRefs[index + 1].current?.focus();
      inputRefs[index + 1].current?.select();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "ArrowRight" && index < 2) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const { resistance, formula } = useMemo(() => {
    const d1 = parseInt(digits[0]) || 0;
    const d2 = parseInt(digits[1]) || 0;
    const d3 = parseInt(digits[2]) || 0;
    const significantValue = d1 * 10 + d2;
    const multiplier = Math.pow(10, d3);
    const ohms = significantValue * multiplier;

    return {
      resistance: ohms,
      formula: `${significantValue} × 10${d3 !== 1 ? superscript(d3) : "¹"} = ${significantValue} × ${multiplier.toLocaleString()} = ${formatResistance(ohms)}`,
    };
  }, [digits]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2 sm:grid-cols-3 grid-cols-1">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Cách tính giá trị</CardTitle>
            <CardDescription>
              Giá trị (Ω) = (2 chữ số đầu) × 10<sup> (số thứ 3)</sup>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* SMD Visual */}
            <SmdResistorSVG digits={digits} digitCount={3} />

            {/* Digit Inputs */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {digits.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <input
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className="size-14 text-center text-2xl font-mono font-bold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <span className="text-xs text-muted-foreground">
                    {i < 2 ? `Chữ số ${i + 1}` : "Hệ số nhân"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Giá trị điện trở
            </p>
            <p className="text-4xl font-black font-mono text-primary transition-all duration-300">
              {formatResistance(resistance)}
            </p>
            <div className="mt-3 p-3 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Phép tính</p>
              <p className="font-mono text-sm text-foreground">{formula}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Điện trở SMD 3 số thường có sai số mặc định ±5%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Common Values Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bảng Giá Trị Phổ Biến</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold">Mã số</th>
                <th className="text-left py-2 px-3 font-semibold">Tính toán</th>
                <th className="text-right py-2 px-3 font-semibold">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {SMD_3_COMMON.map((item) => {
                const d1 = parseInt(item.code[0]);
                const d2 = parseInt(item.code[1]);
                const d3 = parseInt(item.code[2]);
                const sig = d1 * 10 + d2;
                return (
                  <tr
                    key={item.code}
                    className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setDigits(item.code.split(""));
                    }}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-lg">
                      {item.code}
                    </td>
                    <td className="py-2 px-3 font-mono text-lg text-muted-foreground ">
                      {sig} × 10{superscript(d3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge
                        variant="outline"
                        className="font-mono text-sm rounded-sm"
                      >
                        {item.value}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// TAB 2: SMD 4-DIGIT
// ============================================================

function Smd4DigitTab() {
  const [digits, setDigits] = useState(["1", "0", "0", "2"]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    const char = value.slice(-1);
    if (!/^\d$/.test(char) && value !== "") return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
      inputRefs[index + 1].current?.select();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const { resistance, formula } = useMemo(() => {
    const d1 = parseInt(digits[0]) || 0;
    const d2 = parseInt(digits[1]) || 0;
    const d3 = parseInt(digits[2]) || 0;
    const d4 = parseInt(digits[3]) || 0;
    const significantValue = d1 * 100 + d2 * 10 + d3;
    const multiplier = Math.pow(10, d4);
    const ohms = significantValue * multiplier;

    return {
      resistance: ohms,
      formula: `${significantValue} × 10${superscript(d4)} = ${significantValue} × ${multiplier.toLocaleString()} = ${formatResistance(ohms)}`,
    };
  }, [digits]);

  // SMD size reference
  const smdSizes = [
    { code: "0201", size: "0.6 × 0.3 mm" },
    { code: "0402", size: "1.0 × 0.5 mm" },
    { code: "0603", size: "1.6 × 0.8 mm" },
    { code: "0805", size: "2.0 × 1.2 mm" },
    { code: "1206", size: "3.2 × 1.6 mm" },
    { code: "2010", size: "5.0 × 2.5 mm" },
    { code: "2512", size: "6.3 × 3.2 mm" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cách tính giá trị</CardTitle>
          <CardDescription>
            Giá trị (Ω) = (3 chữ số đầu) × 10<sup>chữ số 4</sup>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmdResistorSVG digits={digits} digitCount={4} />

          <div className="flex items-center justify-center gap-3 mt-6">
            {digits.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <input
                  ref={inputRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className="size-14 text-center text-2xl font-mono font-bold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <span className="text-[10px] text-muted-foreground">
                  {i < 3 ? `Chữ số ${i + 1}` : "Hệ số nhân"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Giá trị điện trở
          </p>
          <p className="text-4xl font-black font-mono text-primary transition-all duration-300">
            {formatResistance(resistance)}
          </p>
          <div className="mt-3 p-3 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Phép tính</p>
            <p className="font-mono text-sm text-foreground">{formula}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Mã 3 số: sai số ±5%
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Mã 4 số: sai số ±1%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Common Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bảng Giá Trị Phổ Biến</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold">Mã số</th>
                <th className="text-left py-2 px-3 font-semibold">Tính toán</th>
                <th className="text-right py-2 px-3 font-semibold">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {SMD_4_COMMON.map((item) => {
                const d1 = parseInt(item.code[0]);
                const d2 = parseInt(item.code[1]);
                const d3 = parseInt(item.code[2]);
                const d4 = parseInt(item.code[3]);
                const sig = d1 * 100 + d2 * 10 + d3;
                return (
                  <tr
                    key={item.code}
                    className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setDigits(item.code.split(""));
                    }}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-lg">
                      {item.code}
                    </td>
                    <td className="py-2 px-3 font-mono text-muted-foreground text-xs">
                      {sig} × 10{superscript(d4)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge variant="outline" className="font-mono">
                        {item.value}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* SMD Package Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Nhận Biết Kích Thước SMD Trên PCB
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {smdSizes.map((s) => (
              <div
                key={s.code}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <span className="font-mono font-bold text-foreground">
                  {s.code}
                </span>
                <span className="text-xs text-muted-foreground">{s.size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// SMD TAB (WRAPPER WITH SUB-TABS)
// ============================================================

export default function SmdTab() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-sm text-muted-foreground">
              Điện trở SMD (Surface Mount Device) sử dụng mã số in trên thân
              linh kiện. Chọn loại mã số bên dưới để tính giá trị.
            </p>
          </div>
          <Tabs defaultValue="smd-3">
            <TabsList>
              <TabsTrigger value="smd-3">Mã 3 số</TabsTrigger>
              <TabsTrigger value="smd-4">Mã 4 số</TabsTrigger>
            </TabsList>
            <TabsContent value="smd-3">
              <Smd3DigitTab />
            </TabsContent>
            <TabsContent value="smd-4">
              <Smd4DigitTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
