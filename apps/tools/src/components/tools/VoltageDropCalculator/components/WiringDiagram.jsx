// oxlint-disable react-hooks/exhaustive-deps
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Zap, ShieldAlert, Cpu } from "lucide-react";
import { useWiringAnimation } from "../hooks/useWiringAnimation";

export default function WiringDiagram({
  voltage,
  systemType,
  wireMaterial,
  activeWireSize,
  length,
  activeRho,
  calculations,
}) {
  const containerRef = useRef(null);

  const {
    totalPower,
    loadCurrent,
    deltaU,
    deltaU_percent,
    deltaP,
    loadPower,
    uEnd,
    efficiency,
  } = calculations;

  const isThreePhase = systemType === "3-phase";
  const isDC = systemType === "DC";
  const conductorCount = isThreePhase ? 3 : 2;
  const labels = isThreePhase
    ? ["L1", "L2", "L3"]
    : isDC
      ? ["+", "−"]
      : ["L", "N"];

  // Custom colors matching the Anime.js technical look
  const statusColor =
    deltaU_percent > 5
      ? "#ef4444" // red
      : deltaU_percent > 3
        ? "#f59e0b" // amber
        : "#10b981"; // emerald

  const statusBg =
    deltaU_percent > 5
      ? "bg-red-500/10 border-red-500/35 text-red-500"
      : deltaU_percent > 3
        ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
        : "bg-emerald-500/10 border-emerald-500/35 text-emerald-500";

  // Run animation logic via custom hook
  useWiringAnimation(containerRef, { loadCurrent, systemType });

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">
            Sơ đồ mô phỏng hệ thống điện
          </CardTitle>
        </div>
        <CardDescription>
          Mô hình, trực quan hóa dòng năng lượng và hao tổn truyền tải.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-8" ref={containerRef}>
        {/* Main layout container (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          {/* ==================== TRẠM NGUỒN ==================== */}
          <div className="fade-cascade border-primary/20 bg-background/50 relative flex min-h-35 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 p-5 text-center shadow-xs md:w-64">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Zap className="text-primary h-16 w-16" />
            </div>
            <span className="text-muted-foreground/60 mb-2 text-[10px] font-bold tracking-wider uppercase">
              TRẠM / NGUỒN PHÁT
            </span>
            <div className="text-primary text-3xl font-extrabold tracking-tight">
              {voltage} <span className="text-lg font-bold">V</span>
            </div>
            <div className="text-muted-foreground mt-2 text-xs font-semibold">
              Công suất: {(totalPower / 1000).toFixed(2)} kW
            </div>
          </div>

          {/* ==================== WIRING / CONDUCTION ZONE (DESKTOP) ==================== */}
          <div className="relative z-10 hidden w-full flex-1 flex-col items-center justify-center px-4 md:flex">
            {/* Conductors container */}
            <div className="flex w-full flex-col gap-5 py-4">
              {Array.from({ length: conductorCount }).map((_, idx) => {
                const label = labels[idx];
                const isReverse = label === "N" || label === "−";
                const wireTitle = isThreePhase
                  ? `Pha ${label}`
                  : isDC
                    ? `Cực ${label}`
                    : label === "L"
                      ? "Pha L (Dây nóng)"
                      : "Pha N (Dây trung tính)";
                const particleColor = isReverse ? "#3b82f6" : statusColor;

                return (
                  <div
                    key={`h-wire-${idx}`}
                    className="relative flex h-8 w-full items-center"
                  >
                    {/* Label for wire */}
                    <div className="absolute -top-4 left-0 right-0 flex items-center justify-between text-[9px] font-bold">
                      <span className="text-muted-foreground/70">
                        {wireTitle}
                      </span>
                      {/* <span className="text-muted-foreground/50 font-medium">
                        {dirText} {isReverse ? "←" : "→"}
                      </span> */}
                    </div>

                    {/* SVG Wire Line */}
                    <svg className="h-wire-svg h-4 w-full overflow-visible">
                      <defs>
                        <filter
                          id={`glow-h-${idx}`}
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                        >
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Background copper/wire lane */}
                      <line
                        x1="0"
                        y1="8"
                        x2="100%"
                        y2="8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-muted-foreground opacity-15"
                      />
                      {/* Glowing active wire line overlay */}
                      <line
                        x1="0"
                        y1="8"
                        x2="100%"
                        y2="8"
                        stroke={isReverse ? "#3b82f6" : statusColor}
                        strokeWidth="1.5"
                        className="pulse-glow opacity-40"
                      />

                      {/* Animated dash stream overlay */}
                      <line
                        x1="0"
                        y1="8"
                        x2="100%"
                        y2="8"
                        stroke={isReverse ? "#60a5fa" : statusColor}
                        strokeWidth="1.5"
                        strokeDasharray="6 8"
                        className={
                          isReverse
                            ? "h-dash-reverse opacity-70"
                            : "h-dash-forward opacity-70"
                        }
                      />

                      {/* Electron moving particles (3 luminous particles per wire) */}
                      {loadCurrent > 0 && (
                        <>
                          <circle
                            className={`h-particle ${isReverse ? "h-particle-reverse" : "h-particle-forward"}`}
                            cx="0"
                            cy="8"
                            r={isReverse ? "3" : "3.5"}
                            fill={particleColor}
                            filter={`url(#glow-h-${idx})`}
                          />
                          <circle
                            className={`h-particle ${isReverse ? "h-particle-reverse" : "h-particle-forward"}`}
                            cx="0"
                            cy="8"
                            r={isReverse ? "3" : "3.5"}
                            fill={particleColor}
                            filter={`url(#glow-h-${idx})`}
                          />
                          <circle
                            className={`h-particle ${isReverse ? "h-particle-reverse" : "h-particle-forward"}`}
                            cx="0"
                            cy="8"
                            r={isReverse ? "3" : "3.5"}
                            fill={particleColor}
                            filter={`url(#glow-h-${idx})`}
                          />
                        </>
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>

            {/* Spec / Dim tag (Beige engineering paper style callout) */}
            <div className="fade-cascade dark:bg-muted/40 dark:border-border flex max-w-70 flex-col items-center gap-1 rounded-xl border border-[#e5dfd9] bg-[#f4efeb] p-3 text-center shadow-xs">
              <span className="dark:text-muted-foreground/80 text-[10px] font-bold tracking-wide text-[#44403c] uppercase">
                Cáp {wireMaterial === "Cu" ? "Đồng (Cu)" : "Nhôm (Al)"}{" "}
                {activeWireSize} mm²
              </span>
              <span className="text-muted-foreground text-[10px] font-medium">
                Chiều dài L = {length}m | R ={" "}
                {((activeRho * Number(length)) / activeWireSize).toFixed(4)} Ω
              </span>
            </div>
          </div>

          {/* ==================== WIRING / CONDUCTION ZONE (MOBILE) ==================== */}
          <div className="flex w-full flex-col items-center py-2 md:hidden">
            {/* Spec tag */}
            <div className="fade-cascade dark:bg-muted/40 dark:border-border mb-4 flex w-full max-w-62.5 flex-col items-center rounded-xl border border-[#e5dfd9] bg-[#f4efeb] p-2 text-center">
              <span className="dark:text-muted-foreground/80 text-[9px] font-bold tracking-wide text-[#44403c] uppercase">
                Cáp {wireMaterial === "Cu" ? "Đồng (Cu)" : "Nhôm (Al)"}{" "}
                {activeWireSize} mm²
              </span>
              <span className="text-muted-foreground text-[9px] font-medium">
                L = {length}m | R ={" "}
                {((activeRho * Number(length)) / activeWireSize).toFixed(3)} Ω
              </span>
            </div>

            {/* Vertical wires (SVG) */}
            <div className="flex h-40 justify-center gap-8">
              {Array.from({ length: conductorCount }).map((_, idx) => {
                const label = labels[idx];
                const isReverse = label === "N" || label === "−";
                const particleColor = isReverse ? "#3b82f6" : statusColor;

                return (
                  <div
                    key={`v-wire-${idx}`}
                    className="relative flex h-full w-8 flex-col items-center"
                  >
                    <span className="text-muted-foreground/60 mb-1 text-[8px] font-bold flex flex-col items-center">
                      <span>{label}</span>
                      <span>{isReverse ? "↑" : "↓"}</span>
                    </span>
                    <svg className="v-wire-svg h-full w-2 overflow-visible">
                      <line
                        x1="4"
                        y1="0"
                        x2="4"
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-muted-foreground opacity-15"
                      />
                      <line
                        x1="4"
                        y1="0"
                        x2="4"
                        y2="100%"
                        stroke={isReverse ? "#3b82f6" : statusColor}
                        strokeWidth="1.5"
                        className="pulse-glow opacity-50"
                      />
                      <line
                        x1="4"
                        y1="0"
                        x2="4"
                        y2="100%"
                        stroke={isReverse ? "#60a5fa" : statusColor}
                        strokeWidth="1.5"
                        strokeDasharray="6 8"
                        className={
                          isReverse
                            ? "v-dash-reverse opacity-70"
                            : "v-dash-forward opacity-70"
                        }
                      />
                      {loadCurrent > 0 && (
                        <>
                          <circle
                            className={`v-particle ${isReverse ? "v-particle-reverse" : "v-particle-forward"}`}
                            cx="4"
                            cy="0"
                            r="3.5"
                            fill={particleColor}
                          />
                          <circle
                            className={`v-particle ${isReverse ? "v-particle-reverse" : "v-particle-forward"}`}
                            cx="4"
                            cy="0"
                            r="3.5"
                            fill={particleColor}
                          />
                          <circle
                            className={`v-particle ${isReverse ? "v-particle-reverse" : "v-particle-forward"}`}
                            cx="4"
                            cy="0"
                            r="3.5"
                            fill={particleColor}
                          />
                        </>
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== PHỤ TẢI TERMINAL ==================== */}
          <div
            className="fade-cascade bg-background/50 relative flex min-h-35 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 p-5 text-center shadow-xs md:w-64"
            style={{ borderColor: `${statusColor}30` }}
          >
            <span className="text-muted-foreground/60 mb-2 text-[10px] font-bold tracking-wider uppercase">
              PHỤ TẢI TIÊU THỤ
            </span>
            <div
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: statusColor }}
            >
              {uEnd.toFixed(1)} <span className="text-lg font-bold">V</span>
            </div>
            <div className="text-muted-foreground mt-2 text-xs font-semibold">
              Công suất tải: {(loadPower / 1000).toFixed(2)} kW
            </div>
          </div>
        </div>

        {/* ==================== BOTTOM METRICS SUMMARY (Responsive grid) ==================== */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 border-t pt-6 text-center md:grid-cols-4">
          <div className="fade-cascade bg-muted/20 rounded-xl border p-3">
            <div className="text-muted-foreground mb-1 text-[10px] font-bold uppercase">
              Sụt Áp Trên Dây
            </div>
            <div
              className="text-lg font-extrabold"
              style={{ color: statusColor }}
            >
              −{deltaU.toFixed(2)} V
            </div>
            <div className="text-muted-foreground mt-0.5 text-[10px] font-semibold">
              ({deltaU_percent.toFixed(2)}%)
            </div>
          </div>

          <div className="fade-cascade bg-muted/20 rounded-xl border p-3">
            <div className="text-muted-foreground mb-1 text-[10px] font-bold uppercase">
              Hao Tổn Công Suất
            </div>
            <div className="text-destructive text-lg font-extrabold">
              {deltaP > 1000
                ? `${(deltaP / 1000).toFixed(2)} kW`
                : `${deltaP.toFixed(0)} W`}
            </div>
            <div className="text-muted-foreground mt-0.5 text-[10px] font-semibold">
              Hiệu suất: {efficiency.toFixed(1)}%
            </div>
          </div>

          <div className="fade-cascade bg-muted/20 rounded-xl border p-3">
            <div className="text-muted-foreground mb-1 text-[10px] font-bold uppercase">
              Dòng Điện Tải
            </div>
            <div className="text-foreground text-lg font-extrabold">
              {loadCurrent.toFixed(1)} A
            </div>
            <div className="text-muted-foreground mt-0.5 text-[10px] font-semibold">
              Định mức
            </div>
          </div>

          <div
            className={`fade-cascade flex flex-col items-center justify-center rounded-xl border p-3 ${statusBg}`}
          >
            <div className="mb-1 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-wide uppercase">
                Trạng Thái
              </span>
            </div>
            <div className="text-sm font-bold tracking-wider">
              {deltaU_percent > 5
                ? "NGUY HIỂM"
                : deltaU_percent > 3
                  ? "CHẤP NHẬN ĐƯỢC"
                  : "TỐT / AN TOÀN"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
