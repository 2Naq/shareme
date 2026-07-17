// oxlint-disable react-hooks/exhaustive-deps
import React, { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Zap, ShieldAlert, Cpu } from "lucide-react";
import { animate, stagger } from "animejs";

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
  const animRef = useRef(null);

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

  // Re-run animations whenever calculations or layout changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous animations
    if (animRef.current) {
      animRef.current.forEach((a) => a.revert());
    }

    const anims = [];

    // 1. Electron flow animation (moving particles along paths)
    if (loadCurrent > 0) {
      // Horizontal particles
      const hParticles = containerRef.current.querySelectorAll(".h-particle");
      if (hParticles.length > 0) {
        const hAnim = animate(hParticles, {
          translateX: [0, 240],
          duration: Math.max(1200, 3000 - loadCurrent * 60),
          loop: true,
          delay: stagger(250),
          ease: "linear",
        });
        anims.push(hAnim);
      }

      // Vertical particles (mobile)
      const vParticles = containerRef.current.querySelectorAll(".v-particle");
      if (vParticles.length > 0) {
        const vAnim = animate(vParticles, {
          translateY: [0, 160],
          duration: Math.max(1200, 3000 - loadCurrent * 60),
          loop: true,
          delay: stagger(250),
          ease: "linear",
        });
        anims.push(vAnim);
      }
    }

    // 2. Pulse active values & glowing lines
    const glowAnim = animate(
      containerRef.current.querySelectorAll(".pulse-glow"),
      {
        opacity: [0.3, 0.75],
        duration: 1500,
        direction: "alternate",
        loop: true,
        ease: "inOutSine",
      },
    );
    anims.push(glowAnim);

    // 3. Entry cascade stagger
    const fadeAnim = animate(
      containerRef.current.querySelectorAll(".fade-cascade"),
      {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 600,
        delay: stagger(80),
        ease: "outCubic",
      },
    );
    anims.push(fadeAnim);

    animRef.current = anims;

    return () => {
      anims.forEach((a) => a.revert());
    };
  }, [loadCurrent, systemType]);

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative max-w-5xl mx-auto">
          {/* ==================== TRẠM NGUỒN ==================== */}
          <div className="fade-cascade w-full md:w-64 p-5 rounded-2xl border-2 border-primary/20 bg-background/50 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden min-h-[140px]">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Zap className="w-16 h-16 text-primary" />
            </div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground/60 mb-2">
              TRẠM / NGUỒN PHÁT
            </span>
            <div className="text-3xl font-extrabold text-primary tracking-tight">
              {voltage} <span className="text-lg font-medium">V</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-muted-foreground">
              Công suất: {(totalPower / 1000).toFixed(2)} kW
            </div>
          </div>

          {/* ==================== WIRING / CONDUCTION ZONE (DESKTOP) ==================== */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center px-4 relative z-10 w-full">
            {/* Conductors container */}
            <div className="w-full flex flex-col gap-5 py-4">
              {Array.from({ length: conductorCount }).map((_, idx) => (
                <div
                  key={`h-wire-${idx}`}
                  className="relative w-full h-8 flex items-center"
                >
                  {/* Label for wire */}
                  <span className="absolute left-0 -top-4 text-[9px] font-bold text-muted-foreground/60">
                    Pha {labels[idx]}
                  </span>

                  {/* SVG Wire Line */}
                  <svg className="w-full h-4 overflow-visible">
                    {/* Background copper/wire lane */}
                    <line
                      x1="0"
                      y1="8"
                      x2="100%"
                      y2="8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="opacity-15 text-muted-foreground"
                    />
                    {/* Glowing active wire line overlay */}
                    <line
                      x1="0"
                      y1="8"
                      x2="100%"
                      y2="8"
                      stroke={statusColor}
                      strokeWidth="1.5"
                      className="pulse-glow opacity-50"
                    />

                    {/* Electron moving particles */}
                    {loadCurrent > 0 && (
                      <circle
                        className="h-particle"
                        cx="0"
                        cy="8"
                        r="3"
                        fill="hsl(var(--primary))"
                      />
                    )}
                  </svg>
                </div>
              ))}
            </div>

            {/* Spec / Dim tag (Beige engineering paper style callout) */}
            <div className="fade-cascade flex flex-col items-center gap-1 bg-[#f4efeb] dark:bg-muted/40 border border-[#e5dfd9] dark:border-border p-3 rounded-xl shadow-xs text-center max-w-[280px]">
              <span className="text-[10px] font-bold text-[#44403c] dark:text-muted-foreground/80 tracking-wide uppercase">
                Cáp {wireMaterial === "Cu" ? "Đồng (Cu)" : "Nhôm (Al)"}{" "}
                {activeWireSize} mm²
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                Chiều dài L = {length}m | R ={" "}
                {((activeRho * Number(length)) / activeWireSize).toFixed(4)} Ω
              </span>
            </div>
          </div>

          {/* ==================== WIRING / CONDUCTION ZONE (MOBILE) ==================== */}
          <div className="flex md:hidden flex-col items-center py-2 w-full">
            {/* Spec tag */}
            <div className="fade-cascade flex flex-col items-center bg-[#f4efeb] dark:bg-muted/40 border border-[#e5dfd9] dark:border-border p-2 rounded-xl text-center w-full max-w-[250px] mb-4">
              <span className="text-[9px] font-bold text-[#44403c] dark:text-muted-foreground/80 tracking-wide uppercase">
                Cáp {wireMaterial === "Cu" ? "Đồng (Cu)" : "Nhôm (Al)"}{" "}
                {activeWireSize} mm²
              </span>
              <span className="text-[9px] font-medium text-muted-foreground">
                L = {length}m | R ={" "}
                {((activeRho * Number(length)) / activeWireSize).toFixed(3)} Ω
              </span>
            </div>

            {/* Vertical wires (SVG) */}
            <div className="flex gap-8 justify-center h-40">
              {Array.from({ length: conductorCount }).map((_, idx) => (
                <div
                  key={`v-wire-${idx}`}
                  className="relative w-4 h-full flex flex-col items-center"
                >
                  <span className="text-[8px] font-bold text-muted-foreground/60 mb-1">
                    {labels[idx]}
                  </span>
                  <svg className="w-2 h-full overflow-visible">
                    <line
                      x1="4"
                      y1="0"
                      x2="4"
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="opacity-15 text-muted-foreground"
                    />
                    <line
                      x1="4"
                      y1="0"
                      x2="4"
                      y2="100%"
                      stroke={statusColor}
                      strokeWidth="1.5"
                      className="pulse-glow opacity-50"
                    />
                    {loadCurrent > 0 && (
                      <circle
                        className="v-particle"
                        cx="4"
                        cy="0"
                        r="3"
                        fill="hsl(var(--primary))"
                      />
                    )}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== PHỤ TẢI TERMINAL ==================== */}
          <div
            className="fade-cascade w-full md:w-64 p-5 rounded-2xl border-2 bg-background/50 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden min-h-[140px]"
            style={{ borderColor: `${statusColor}30` }}
          >
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground/60 mb-2">
              PHỤ TẢI TIÊU THỤ
            </span>
            <div
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: statusColor }}
            >
              {uEnd.toFixed(1)} <span className="text-lg font-medium">V</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-muted-foreground">
              Công suất tải: {(loadPower / 1000).toFixed(2)} kW
            </div>
          </div>
        </div>

        {/* ==================== BOTTOM METRICS SUMMARY (Responsive grid) ==================== */}
        <div className="mt-8 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-5xl mx-auto">
          <div className="fade-cascade p-3 rounded-xl bg-muted/20 border">
            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
              Sụt Áp Trên Dây
            </div>
            <div
              className="text-lg font-extrabold"
              style={{ color: statusColor }}
            >
              −{deltaU.toFixed(2)} V
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">
              ({deltaU_percent.toFixed(2)}%)
            </div>
          </div>

          <div className="fade-cascade p-3 rounded-xl bg-muted/20 border">
            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
              Hao Tổn Công Suất
            </div>
            <div className="text-lg font-extrabold text-destructive">
              {deltaP > 1000
                ? `${(deltaP / 1000).toFixed(2)} kW`
                : `${deltaP.toFixed(0)} W`}
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">
              Hiệu suất: {efficiency.toFixed(1)}%
            </div>
          </div>

          <div className="fade-cascade p-3 rounded-xl bg-muted/20 border">
            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
              Dòng Điện Tải
            </div>
            <div className="text-lg font-extrabold text-foreground">
              {loadCurrent.toFixed(1)} A
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">
              Định mức
            </div>
          </div>

          <div
            className={`fade-cascade p-3 rounded-xl border flex flex-col justify-center items-center ${statusBg}`}
          >
            <div className="flex items-center gap-1 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wide">
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
