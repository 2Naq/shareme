import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ============================================================
// CONSTANTS
// ============================================================

const COLOR_BANDS = [
  { name: 'Đen',      nameEn: 'Black',  hex: '#1a1a1a', digit: 0, multiplier: 1,        tolerance: null },
  { name: 'Nâu',      nameEn: 'Brown',  hex: '#8B4513', digit: 1, multiplier: 10,       tolerance: '±1%' },
  { name: 'Đỏ',       nameEn: 'Red',    hex: '#DC2626', digit: 2, multiplier: 100,      tolerance: '±2%' },
  { name: 'Cam',       nameEn: 'Orange', hex: '#EA580C', digit: 3, multiplier: 1e3,      tolerance: '±3%' },
  { name: 'Vàng',      nameEn: 'Yellow', hex: '#EAB308', digit: 4, multiplier: 1e4,      tolerance: '±4%' },
  { name: 'Lục',       nameEn: 'Green',  hex: '#16A34A', digit: 5, multiplier: 1e5,      tolerance: '±0.5%' },
  { name: 'Lam',       nameEn: 'Blue',   hex: '#2563EB', digit: 6, multiplier: 1e6,      tolerance: '±0.25%' },
  { name: 'Tím',       nameEn: 'Violet', hex: '#7C3AED', digit: 7, multiplier: 1e7,      tolerance: '±0.1%' },
  { name: 'Xám',       nameEn: 'Gray',   hex: '#6B7280', digit: 8, multiplier: 1e8,      tolerance: '±0.05%' },
  { name: 'Trắng',     nameEn: 'White',  hex: '#F5F5F5', digit: 9, multiplier: 1e9,      tolerance: null },
  { name: 'Vàng kim',  nameEn: 'Gold',   hex: '#D4A843', digit: null, multiplier: 0.1,   tolerance: '±5%' },
  { name: 'Bạc',       nameEn: 'Silver', hex: '#C0C0C0', digit: null, multiplier: 0.01,  tolerance: '±10%' },
  { name: 'Không màu', nameEn: 'None',   hex: 'transparent', digit: null, multiplier: null, tolerance: '±20%' },
];

const DIGIT_COLORS = COLOR_BANDS.filter(c => c.digit !== null); // 0-9
const MULTIPLIER_COLORS = COLOR_BANDS.filter(c => c.multiplier !== null);
const TOLERANCE_COLORS = COLOR_BANDS.filter(c => c.tolerance !== null);

// SMD common values
const SMD_3_COMMON = [
  { code: '100', value: '10Ω' },
  { code: '101', value: '100Ω' },
  { code: '102', value: '1kΩ' },
  { code: '103', value: '10kΩ' },
  { code: '104', value: '100kΩ' },
  { code: '105', value: '1MΩ' },
  { code: '220', value: '22Ω' },
  { code: '221', value: '220Ω' },
  { code: '472', value: '4.7kΩ' },
  { code: '473', value: '47kΩ' },
  { code: '000', value: '0Ω' },
];

const SMD_4_COMMON = [
  { code: '1000', value: '100Ω' },
  { code: '1001', value: '1kΩ' },
  { code: '1002', value: '10kΩ' },
  { code: '1003', value: '100kΩ' },
  { code: '4700', value: '470Ω' },
  { code: '4701', value: '4.7kΩ' },
  { code: '4992', value: '49.9kΩ' },
  { code: '2000', value: '200Ω' },
  { code: '0000', value: '0Ω' },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatResistance(ohms) {
  if (ohms === 0) return '0 Ω';
  if (ohms >= 1e9) return `${(ohms / 1e9).toFixed(ohms % 1e9 === 0 ? 0 : 2)} GΩ`;
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(ohms % 1e6 === 0 ? 0 : 2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(ohms % 1e3 === 0 ? 0 : 2)} kΩ`;
  if (ohms < 1) return `${ohms.toFixed(2)} Ω`;
  return `${ohms.toFixed(ohms % 1 === 0 ? 0 : 2)} Ω`;
}

function formatMultiplier(m) {
  if (m >= 1e9) return `×10⁹`;
  if (m >= 1e8) return `×10⁸`;
  if (m >= 1e7) return `×10⁷`;
  if (m >= 1e6) return `×10⁶`;
  if (m >= 1e5) return `×10⁵`;
  if (m >= 1e4) return `×10⁴`;
  if (m >= 1e3) return `×10³`;
  if (m >= 100) return `×10²`;
  if (m >= 10) return `×10¹`;
  if (m === 1) return `×10⁰`;
  if (m === 0.1) return `×10⁻¹`;
  if (m === 0.01) return `×10⁻²`;
  return `×${m}`;
}

// ============================================================
// COLOR PICKER POPUP
// ============================================================

function ColorPickerContent({ colors, selectedIndex, onSelect, onClose, bandType }) {
  const getLabel = (color) => {
    if (bandType === 'digit') return `${color.name} (${color.digit})`;
    if (bandType === 'multiplier') return `${color.name} ${formatMultiplier(color.multiplier)}`;
    if (bandType === 'tolerance') return `${color.name} ${color.tolerance}`;
    return color.name;
  };

  return (
    <>
      <DialogHeader className="mb-2">
        <DialogTitle className="text-center font-bold">
          {bandType === 'digit' ? 'Chọn chữ số' : bandType === 'multiplier' ? 'Chọn hệ số nhân' : 'Chọn dung sai'}
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-1 p-1">
        {colors.map((color, idx) => (
          <button
            key={color.nameEn}
            onClick={() => { onSelect(idx); onClose(); }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
              hover:bg-accent/80 hover:scale-[1.02]
              ${selectedIndex === idx ? 'ring-2 ring-primary bg-accent' : 'bg-transparent'}
            `}
          >
            <span
              className="size-5 rounded-md border border-border/60 shrink-0 shadow-sm"
              style={{
                backgroundColor: color.hex === 'transparent' ? 'transparent' : color.hex,
                backgroundImage: color.hex === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                backgroundSize: '6px 6px',
                backgroundPosition: '0 0, 3px 3px',
              }}
            />
            <span className="text-foreground truncate">{getLabel(color)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ============================================================
// INTERACTIVE SVG RESISTOR (THROUGH-HOLE)
// ============================================================

function ResistorSVG({ bands, bandCount, onBandClick }) {
  const svgWidth = 460;
  const svgHeight = 140;
  const bodyX = 80;
  const bodyW = 300;
  const bodyY = 35;
  const bodyH = 70;
  const bodyRx = 18;

  // Band positions for 4 and 5 bands
  const bandPositions4 = [
    { x: bodyX + 45, label: 'Vòng 1', sub: 'Chữ số 1' },
    { x: bodyX + 85, label: 'Vòng 2', sub: 'Chữ số 2' },
    { x: bodyX + 125, label: 'Vòng 3', sub: 'Hệ số nhân' },
    { x: bodyX + 220, label: 'Vòng 4', sub: 'Dung sai' },
  ];
  const bandPositions5 = [
    { x: bodyX + 35, label: 'Vòng 1', sub: 'Chữ số 1' },
    { x: bodyX + 70, label: 'Vòng 2', sub: 'Chữ số 2' },
    { x: bodyX + 105, label: 'Vòng 3', sub: 'Chữ số 3' },
    { x: bodyX + 140, label: 'Vòng 4', sub: 'Hệ số nhân' },
    { x: bodyX + 230, label: 'Vòng 5', sub: 'Dung sai' },
  ];

  const positions = bandCount === 4 ? bandPositions4 : bandPositions5;
  const bandW = 22;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-[500px] mx-auto select-none"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
    >
      {/* Wires */}
      <line x1="0" y1={bodyY + bodyH / 2} x2={bodyX} y2={bodyY + bodyH / 2} stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
      <line x1={bodyX + bodyW} y1={bodyY + bodyH / 2} x2={svgWidth} y2={bodyY + bodyH / 2} stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />

      {/* Body */}
      <rect
        x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyRx}
        fill="#D2B48C"
        stroke="#A0845C"
        strokeWidth="2"
      />
      {/* Body highlight */}
      <rect
        x={bodyX + 4} y={bodyY + 4} width={bodyW - 8} height={bodyH / 2 - 4} rx={bodyRx - 4}
        fill="rgba(255,255,255,0.18)"
      />

      {/* Color Bands */}
      {positions.map((pos, i) => {
        const color = bands[i];
        const hexColor = color ? color.hex : '#E5E7EB';
        const isTransparent = hexColor === 'transparent';

        return (
          <g key={i} className="cursor-pointer" onClick={(e) => onBandClick(i, e)}>
            {/* Clickable area (larger) */}
            <rect
              x={pos.x - 4} y={bodyY - 2} width={bandW + 8} height={bodyH + 4}
              fill="transparent"
              rx={4}
            />
            {/* Band */}
            <rect
              x={pos.x} y={bodyY + 2} width={bandW} height={bodyH - 4}
              rx={3}
              fill={isTransparent ? '#E5E7EB' : hexColor}
              stroke={isTransparent ? '#9CA3AF' : 'rgba(0,0,0,0.2)'}
              strokeWidth="1"
              strokeDasharray={isTransparent ? '3,2' : 'none'}
              className="transition-all duration-300"
            />
            {/* Highlight on band */}
            <rect
              x={pos.x + 2} y={bodyY + 4} width={bandW - 4} height={(bodyH - 4) / 3}
              rx={2}
              fill="rgba(255,255,255,0.25)"
              className="pointer-events-none"
            />
            {/* Hover indicator */}
            <rect
              x={pos.x - 2} y={bodyY} width={bandW + 4} height={bodyH}
              rx={5}
              fill="transparent"
              stroke="transparent"
              strokeWidth="2"
              className="transition-all duration-200 hover:stroke-primary/50"
            />
            {/* Label below */}
            <text
              x={pos.x + bandW / 2} y={bodyY + bodyH + 16}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px] font-medium pointer-events-none"
            >
              {pos.label}
            </text>
            <text
              x={pos.x + bandW / 2} y={bodyY + bodyH + 26}
              textAnchor="middle"
              className="fill-muted-foreground/60 text-[7px] pointer-events-none"
            >
              {pos.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// SMD RESISTOR SVG
// ============================================================

function SmdResistorSVG({ digits, digitCount }) {
  const w = 200;
  const h = 90;
  const bodyW = 140;
  const bodyH = 60;
  const bodyX = (w - bodyW) / 2;
  const bodyY = (h - bodyH) / 2;
  const padW = 16;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[240px] mx-auto select-none">
      {/* Pads */}
      <rect x={bodyX - padW} y={bodyY + 10} width={padW} height={bodyH - 20} rx={2} fill="#9CA3AF" />
      <rect x={bodyX + bodyW} y={bodyY + 10} width={padW} height={bodyH - 20} rx={2} fill="#9CA3AF" />
      {/* Body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={4} fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
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
        {digits.join('')}
      </text>
      {/* Digit markers */}
      {digits.map((d, i) => {
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
      })}
    </svg>
  );
}

// ============================================================
// TAB 1: THROUGH-HOLE COLOR BAND
// ============================================================

function ThroughHoleTab() {
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
      if (bandIndex < 2) return 'digit';
      if (bandIndex === 2) return 'multiplier';
      return 'tolerance';
    } else {
      if (bandIndex < 3) return 'digit';
      if (bandIndex === 3) return 'multiplier';
      return 'tolerance';
    }
  };

  // Get the actual color object for each band
  const getBandColor = (bandIndex) => {
    const type = getBandType(bandIndex);
    const colorList = getColorsForBand(bandIndex);
    const value = bands[bandIndex];
    return colorList[value] || colorList[0];
  };

  // Calculate result
  const { resistance, toleranceStr, formula } = useMemo(() => {
    const bandColors = bands.map((_, i) => getBandColor(i));

    let value = 0;
    let tol = '';
    let form = '';

    if (bandCount === 4) {
      const d1 = bandColors[0].digit;
      const d2 = bandColors[1].digit;
      const mult = bandColors[2].multiplier;
      const tolColor = bandColors[3];

      value = (d1 * 10 + d2) * mult;
      tol = tolColor.tolerance || '–';
      form = `${d1}${d2} × ${formatMultiplier(mult)} = ${formatResistance(value)} ${tol}`;
    } else {
      const d1 = bandColors[0].digit;
      const d2 = bandColors[1].digit;
      const d3 = bandColors[2].digit;
      const mult = bandColors[3].multiplier;
      const tolColor = bandColors[4];

      value = (d1 * 100 + d2 * 10 + d3) * mult;
      tol = tolColor.tolerance || '–';
      form = `${d1}${d2}${d3} × ${formatMultiplier(mult)} = ${formatResistance(value)} ${tol}`;
    }

    return { resistance: value, toleranceStr: tol, formula: form };
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
              ${bandCount === 4
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent'
              }
            `}
          >
            4 Vòng Màu
          </button>
          <button
            onClick={() => setBandCount(5)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${bandCount === 5
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent'
              }
            `}
          >
            5 Vòng Màu
          </button>
        </div>
      </div>

      {/* Interactive Resistor SVG */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bấm vào vòng màu để thay đổi</CardTitle>
          <CardDescription>Click trực tiếp vào các vòng màu trên điện trở để chọn giá trị</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={containerRef}>
            <ResistorSVG
              bands={bands.map((_, i) => getBandColor(i))}
              bandCount={bandCount}
              onBandClick={handleBandClick}
            />
            <Dialog open={pickerOpen !== null} onOpenChange={(open) => !open && setPickerOpen(null)}>
              <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-xl rounded-xl p-4 gap-2">
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
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Giá trị điện trở</p>
              <p className="text-4xl font-black font-mono text-primary transition-all duration-300">
                {formatResistance(resistance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dung sai</p>
              <Badge variant="outline" className="text-lg px-4 py-1 font-mono">
                {toleranceStr}
              </Badge>
            </div>
          </div>
          <div className="mt-4 p-3 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Công thức</p>
            <p className="font-mono text-sm text-foreground">{formula}</p>
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
                      backgroundColor: color.hex === 'transparent' ? '#E5E7EB' : color.hex,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{color.name}</span>
                  {i < bands.length - 1 && <span className="text-muted-foreground/30 mx-1">–</span>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
                <th className="text-center py-2 px-2 font-semibold">Hệ số nhân</th>
                <th className="text-center py-2 px-2 font-semibold">Dung sai</th>
              </tr>
            </thead>
            <tbody>
              {COLOR_BANDS.map((color) => (
                <tr key={color.nameEn} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-5 rounded border border-border/60 shadow-sm shrink-0"
                        style={{
                          backgroundColor: color.hex === 'transparent' ? '#E5E7EB' : color.hex,
                          backgroundImage: color.hex === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none',
                          backgroundSize: '6px 6px',
                          backgroundPosition: '0 0, 3px 3px',
                        }}
                      />
                      <span className="font-medium">{color.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-2 px-2 font-mono">
                    {color.digit !== null ? color.digit : '–'}
                  </td>
                  <td className="text-center py-2 px-2 font-mono text-xs">
                    {color.multiplier !== null ? formatMultiplier(color.multiplier) : '–'}
                  </td>
                  <td className="text-center py-2 px-2 font-mono text-xs">
                    {color.tolerance || '–'}
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

// ============================================================
// TAB 2: SMD 3-DIGIT
// ============================================================

function Smd3DigitTab() {
  const [digits, setDigits] = useState(['1', '0', '3']);
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    // Only allow single digit
    const char = value.slice(-1);
    if (!/^\d$/.test(char) && value !== '') return;

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
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 2) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
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
      formula: `${significantValue} × 10${d3 !== 1 ? superscript(d3) : '¹'} = ${significantValue} × ${multiplier.toLocaleString()} = ${formatResistance(ohms)}`,
    };
  }, [digits]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cách tính giá trị</CardTitle>
          <CardDescription>
            Giá trị (Ω) = (2 chữ số đầu) × 10<sup>chữ số 3</sup>
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
                <span className="text-[10px] text-muted-foreground">
                  {i < 2 ? `Chữ số ${i + 1}` : 'Hệ số nhân'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Giá trị điện trở</p>
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
                      setDigits(item.code.split(''));
                    }}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-lg">{item.code}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground text-xs">
                      {sig} × 10{superscript(d3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge variant="outline" className="font-mono">{item.value}</Badge>
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
// TAB 3: SMD 4-DIGIT
// ============================================================

function Smd4DigitTab() {
  const [digits, setDigits] = useState(['1', '0', '0', '2']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    const char = value.slice(-1);
    if (!/^\d$/.test(char) && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
      inputRefs[index + 1].current?.select();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
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
    { code: '0201', size: '0.6 × 0.3 mm' },
    { code: '0402', size: '1.0 × 0.5 mm' },
    { code: '0603', size: '1.6 × 0.8 mm' },
    { code: '0805', size: '2.0 × 1.2 mm' },
    { code: '1206', size: '3.2 × 1.6 mm' },
    { code: '2010', size: '5.0 × 2.5 mm' },
    { code: '2512', size: '6.3 × 3.2 mm' },
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
                  {i < 3 ? `Chữ số ${i + 1}` : 'Hệ số nhân'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Giá trị điện trở</p>
          <p className="text-4xl font-black font-mono text-primary transition-all duration-300">
            {formatResistance(resistance)}
          </p>
          <div className="mt-3 p-3 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Phép tính</p>
            <p className="font-mono text-sm text-foreground">{formula}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">Mã 3 số: sai số ±5%</Badge>
            <Badge variant="secondary" className="text-xs">Mã 4 số: sai số ±1%</Badge>
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
                      setDigits(item.code.split(''));
                    }}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-lg">{item.code}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground text-xs">
                      {sig} × 10{superscript(d4)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge variant="outline" className="font-mono">{item.value}</Badge>
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
          <CardTitle className="text-lg">Nhận Biết Kích Thước SMD Trên PCB</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {smdSizes.map((s) => (
              <div
                key={s.code}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <span className="font-mono font-bold text-foreground">{s.code}</span>
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

function SmdTab() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-sm text-muted-foreground">
              Điện trở SMD (Surface Mount Device) sử dụng mã số in trên thân linh kiện. Chọn loại mã số bên dưới để tính giá trị.
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

// ============================================================
// SUPERSCRIPT HELPER
// ============================================================

function superscript(n) {
  const map = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  return String(n).split('').map(c => map[c] || c).join('');
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ResistorCalculator() {
  return (
    <div className="mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Toán Điện Trở
        </h1>
        <p className="text-muted-foreground">
          Công cụ đọc giá trị điện trở thang màu (through-hole) và điện trở dán SMD. Bấm trực tiếp vào vòng màu để thay đổi.
        </p>
      </div>

      <Tabs defaultValue="color-band">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="color-band">
            Thang Màu (4-5 vòng)
          </TabsTrigger>
          <TabsTrigger value="smd">
            Điện Trở SMD
          </TabsTrigger>
        </TabsList>

        <TabsContent value="color-band">
          <ThroughHoleTab />
        </TabsContent>

        <TabsContent value="smd">
          <SmdTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
