// oxlint-disable react-hooks/exhaustive-deps
import React, { useRef, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { animate, stagger } from "animejs";

export default function WiringDiagram({
  voltage,
  systemType,
  wireMaterial,
  activeWireSize,
  length,
  activeRho,
  includeReactance,
  reactanceVal,
  calculations,
}) {
  const svgRef = useRef(null);
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

  const materialLabel =
    wireMaterial === "Cu" ? "Cu" : wireMaterial === "Al" ? "Al" : "Custom";
  const materialFull =
    wireMaterial === "Cu"
      ? "Đồng (Cu)"
      : wireMaterial === "Al"
        ? "Nhôm (Al)"
        : "Tùy chọn";

  const wireCount = systemType === "3-phase" ? 3 : 2;
  const wireLabels =
    systemType === "3-phase"
      ? ["L1", "L2", "L3"]
      : systemType === "DC"
        ? ["+", "−"]
        : ["L", "N"];

  const statusColor =
    deltaU_percent > 5 ? "#ef4444" : deltaU_percent > 3 ? "#f59e0b" : "#22c55e";
  const statusLabel =
    deltaU_percent > 5
      ? "NGUY HIỂM"
      : deltaU_percent > 3
        ? "CHẤP NHẬN"
        : "AN TOÀN";

  const rTotal = ((activeRho * Number(length)) / activeWireSize).toFixed(4);
  const xTotal = includeReactance
    ? (Number(reactanceVal) * Number(length)).toFixed(4)
    : null;

  // Wire Y positions
  const wireGap = wireCount === 3 ? 28 : 40;
  const wireStartY = 130;
  const wireYPositions = useMemo(
    () => Array.from({ length: wireCount }, (_, i) => wireStartY + i * wireGap),
    [wireCount, wireGap],
  );
  const diagramHeight = wireStartY + (wireCount - 1) * wireGap + 140;

  // Particle count for electron flow
  const particleCount = 6;

  // Anime.js animations
  useEffect(() => {
    if (!svgRef.current) return;

    // Clean up previous animations
    if (animRef.current) {
      animRef.current.forEach((a) => a.revert());
    }
    const anims = [];

    // 1. Entry animation — fade in and slide elements
    const entryAnim = animate(svgRef.current.querySelectorAll(".anim-entry"), {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 800,
      delay: stagger(60),
      ease: "outCubic",
    });
    anims.push(entryAnim);

    // 2. Source terminal pulse glow
    const sourcePulse = animate(
      svgRef.current.querySelectorAll(".source-glow"),
      {
        opacity: [0.15, 0.4],
        duration: 1500,
        direction: "alternate",
        loop: true,
        ease: "inOutSine",
      },
    );
    anims.push(sourcePulse);

    // 3. Load terminal pulse glow
    const loadPulse = animate(svgRef.current.querySelectorAll(".load-glow"), {
      opacity: [0.1, 0.35],
      duration: 1800,
      direction: "alternate",
      loop: true,
      ease: "inOutSine",
    });
    anims.push(loadPulse);

    // 4. Electron flow particles along wires
    if (loadCurrent > 0) {
      const particles = svgRef.current.querySelectorAll(".electron-particle");
      const speed = Math.max(1500, 4000 - loadCurrent * 50);
      const electronAnim = animate(particles, {
        translateX: [0, 420],
        duration: speed,
        loop: true,
        delay: stagger(speed / particleCount),
        ease: "linear",
      });
      anims.push(electronAnim);
    }

    // 5. Loss indicator blink
    const lossAnim = animate(
      svgRef.current.querySelectorAll(".loss-indicator"),
      {
        opacity: [0.7, 1],
        scale: [1, 1.02],
        duration: 1200,
        direction: "alternate",
        loop: true,
        ease: "inOutQuad",
      },
    );
    anims.push(lossAnim);

    // 6. Voltage bar fill animation
    const barAnim = animate(
      svgRef.current.querySelectorAll(".voltage-bar-fill"),
      {
        width: (_el, i, targets) => {
          const el = targets[i];
          return [0, el.getAttribute("data-target-width")];
        },
        duration: 1200,
        delay: 400,
        ease: "outExpo",
      },
    );
    anims.push(barAnim);

    // 7. Resistor shimmer
    const resistorAnim = animate(
      svgRef.current.querySelectorAll(".resistor-sym"),
      {
        strokeDashoffset: [0, -40],
        duration: 2000,
        loop: true,
        ease: "linear",
      },
    );
    anims.push(resistorAnim);

    animRef.current = anims;

    return () => {
      anims.forEach((a) => a.revert());
    };
  }, [loadCurrent, deltaU_percent, wireCount]);

  // Wire path coordinates
  const srcTermX = 135;
  const cbX = 190;
  const wireStartX = 220;
  const resistorStartX = 370;
  const resistorEndX = 440;
  const wireEndX = 640;
  const loadTermX = 680;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <LineChart className="w-5 h-5 text-primary" />
          Sơ đồ đơn tuyến sụt áp đường dây
        </CardTitle>
        <CardDescription>
          Bản vẽ trực quan mô tả phân phối điện từ trạm nguồn đến phụ tải cuối
          cùng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto rounded-xl bg-[hsl(var(--muted)/0.15)] border p-2">
          <svg
            ref={svgRef}
            viewBox={`0 0 820 ${diagramHeight}`}
            className="w-full min-w-160"
            style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}
          >
            <defs>
              {/* Grid pattern */}
              <pattern
                id="gridSmall"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  opacity="0.06"
                />
              </pattern>

              {/* Glow filter for terminals */}
              <filter
                id="glowSource"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter
                id="glowLoad"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Drop shadow for boxes */}
              <filter
                id="shadowBox"
                x="-10%"
                y="-10%"
                width="120%"
                height="130%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.08"
                />
              </filter>

              {/* Arrowhead */}
              <marker
                id="flowArrow"
                markerWidth="8"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <path
                  d="M0,0 L8,3 L0,6 Z"
                  fill="hsl(var(--primary))"
                  opacity="0.6"
                />
              </marker>

              {/* Gradient for voltage bar */}
              <linearGradient id="voltageGrad" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.8"
                />
                <stop
                  offset={`${100 - deltaU_percent}%`}
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.5"
                />
                <stop offset="100%" stopColor={statusColor} stopOpacity="0.7" />
              </linearGradient>

              {/* Electron particle gradient */}
              <radialGradient id="electronGrad">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>

            {/* Background grid */}
            <rect width="820" height={diagramHeight} fill="url(#gridSmall)" />

            {/* ════════════════ HEADER BANNER ════════════════ */}
            <g className="anim-entry">
              <text
                x="410"
                y="28"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="currentColor"
                opacity="0.7"
                letterSpacing="2"
              >
                SƠ ĐỒ ĐƠN TUYẾN — SINGLE LINE DIAGRAM
              </text>
              <line
                x1="100"
                y1="38"
                x2="720"
                y2="38"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.15"
              />
            </g>

            {/* ════════════ CABLE SPEC BANNER ════════════ */}
            <g className="anim-entry">
              <rect
                x="240"
                y="48"
                width="340"
                height="32"
                rx="6"
                fill="currentColor"
                opacity="0.04"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.1"
              />
              <text
                x="410"
                y="62"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="hsl(var(--primary))"
                opacity="0.85"
              >
                CÁP: {wireCount}×{materialFull} — {activeWireSize} mm²
              </text>
              <text
                x="410"
                y="75"
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                opacity="0.4"
              >
                ρ = {activeRho} Ω·mm²/m | R = {rTotal} Ω
                {xTotal ? ` | X = ${xTotal} Ω` : ""}
              </text>
            </g>

            {/* ════════════ VOLTAGE DROP BAR (top) ════════════ */}
            <g className="anim-entry">
              {/* Bar background */}
              <rect
                x="135"
                y="92"
                width="550"
                height="12"
                rx="6"
                fill="currentColor"
                opacity="0.06"
              />
              {/* Bar fill — good portion */}
              <rect
                className="voltage-bar-fill"
                x="135"
                y="92"
                width="0"
                data-target-width={550 * (1 - deltaU_percent / 100)}
                height="12"
                rx="6"
                fill="hsl(var(--primary))"
                opacity="0.25"
              />
              {/* Bar fill — loss portion */}
              <rect
                className="voltage-bar-fill"
                x={135 + 550 * (1 - deltaU_percent / 100)}
                y="92"
                width="0"
                data-target-width={Math.max(1, 550 * (deltaU_percent / 100))}
                height="12"
                rx="6"
                fill={statusColor}
                opacity="0.35"
              />
              {/* Labels */}
              <text
                x="135"
                y="89"
                fontSize="9"
                fontWeight="600"
                fill="hsl(var(--primary))"
                opacity="0.6"
              >
                {voltage}V
              </text>
              <text
                x="685"
                y="89"
                textAnchor="end"
                fontSize="9"
                fontWeight="600"
                fill={statusColor}
              >
                {uEnd.toFixed(1)}V
              </text>
              <text
                x="410"
                y="89"
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                fill="currentColor"
                opacity="0.35"
              >
                ΔU = −{deltaU.toFixed(2)}V ({deltaU_percent.toFixed(2)}%)
              </text>
            </g>

            {/* ════════════════ SOURCE TERMINAL ════════════════ */}
            <g className="anim-entry" filter="url(#shadowBox)">
              {/* Glow behind */}
              <rect
                className="source-glow"
                x="30"
                y={wireYPositions[0] - 30}
                width="110"
                height={wireYPositions[wireCount - 1] - wireYPositions[0] + 60}
                rx="12"
                fill="hsl(var(--primary))"
                opacity="0.15"
              />
              {/* Main box */}
              <rect
                x="35"
                y={wireYPositions[0] - 25}
                width="100"
                height={wireYPositions[wireCount - 1] - wireYPositions[0] + 50}
                rx="8"
                fill="var(--background, #fff)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeOpacity="0.5"
              />
              {/* Title bar */}
              <rect
                x="35"
                y={wireYPositions[0] - 25}
                width="100"
                height="22"
                rx="8"
                fill="hsl(var(--primary))"
                opacity="0.12"
              />
              <text
                x="85"
                y={wireYPositions[0] - 9}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="hsl(var(--primary))"
                letterSpacing="1"
              >
                NGUỒN
              </text>
              {/* Voltage */}
              <text
                x="85"
                y={wireYPositions[Math.floor(wireCount / 2)] + 6}
                textAnchor="middle"
                fontSize="22"
                fontWeight="800"
                fill="hsl(var(--primary))"
              >
                {voltage}
              </text>
              <text
                x="85"
                y={wireYPositions[Math.floor(wireCount / 2)] + 18}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                opacity="0.4"
              >
                Volt
              </text>
              {/* Power */}
              <text
                x="85"
                y={wireYPositions[wireCount - 1] + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="hsl(var(--primary))"
                opacity="0.7"
              >
                {(totalPower / 1000).toFixed(2)} kW
              </text>

              {/* Terminal dots on right edge */}
              {wireYPositions.map((y, i) => (
                <g key={`src-t-${wireLabels[i]}`}>
                  <circle
                    cx={srcTermX}
                    cy={y}
                    r="5"
                    fill="hsl(var(--primary))"
                    opacity="0.7"
                  />
                  <circle
                    cx={srcTermX}
                    cy={y}
                    r="2.5"
                    fill="var(--background, #fff)"
                  />
                  <text
                    x={srcTermX - 16}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="hsl(var(--primary))"
                    opacity="0.7"
                  >
                    {wireLabels[i]}
                  </text>
                </g>
              ))}
            </g>

            {/* ════════════ CB SYMBOL ════════════ */}
            <g className="anim-entry">
              {wireYPositions.map((y, i) => (
                <g key={`cb-${wireLabels[i]}`}>
                  {/* Line to CB */}
                  <line
                    x1={srcTermX + 5}
                    y1={y}
                    x2={cbX - 8}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="2.2"
                    opacity="0.55"
                  />
                  {/* CB circle contacts */}
                  <circle
                    cx={cbX - 8}
                    cy={y}
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.45"
                  />
                  <line
                    x1={cbX - 8}
                    y1={y}
                    x2={cbX + 8}
                    y2={y - 12}
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.55"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={cbX + 8}
                    cy={y}
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.45"
                  />
                  {/* Line from CB to wire */}
                  <line
                    x1={cbX + 11}
                    y1={y}
                    x2={wireStartX}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="2.2"
                    opacity="0.55"
                  />
                </g>
              ))}
              {/* CB label */}
              <text
                x={cbX}
                y={wireYPositions[0] - 22}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="currentColor"
                opacity="0.45"
              >
                CB
              </text>
            </g>

            {/* ════════════ WIRE CONDUCTORS (main run) ════════════ */}
            {wireYPositions.map((y, i) => (
              <g key={`wire-${wireLabels[i]}`} className="anim-entry">
                {/* Main wire — source side */}
                <line
                  x1={wireStartX}
                  y1={y}
                  x2={resistorStartX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  opacity="0.5"
                />

                {/* Resistor zigzag */}
                <polyline
                  className="resistor-sym"
                  points={`${resistorStartX},${y} ${resistorStartX + 10},${y} ${resistorStartX + 16},${y - 8} ${resistorStartX + 24},${y + 8} ${resistorStartX + 32},${y - 8} ${resistorStartX + 40},${y + 8} ${resistorStartX + 48},${y - 8} ${resistorStartX + 56},${y + 8} ${resistorStartX + 60},${y} ${resistorEndX},${y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity="0.5"
                  strokeDasharray="200"
                />

                {/* Main wire — load side */}
                <line
                  x1={resistorEndX}
                  y1={y}
                  x2={wireEndX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  opacity="0.5"
                />

                {/* Wire to load terminal */}
                <line
                  x1={wireEndX}
                  y1={y}
                  x2={loadTermX}
                  y2={y}
                  stroke={statusColor}
                  strokeWidth="2.2"
                  opacity="0.6"
                />
              </g>
            ))}

            {/* ════════════ ELECTRON FLOW PARTICLES ════════════ */}
            {loadCurrent > 0 &&
              wireYPositions.map((y, wi) =>
                Array.from({ length: particleCount }, (_, pi) => (
                  <circle
                    key={`p-${wi}-${pi}`}
                    className="electron-particle"
                    cx={wireStartX}
                    cy={y}
                    r="3.5"
                    fill="url(#electronGrad)"
                    opacity="0.7"
                  />
                )),
              )}

            {/* ════════════ CURRENT FLOW ANNOTATION ════════════ */}
            <g className="anim-entry">
              <line
                x1="260"
                y1={wireYPositions[wireCount - 1] + 18}
                x2="350"
                y2={wireYPositions[wireCount - 1] + 18}
                stroke="hsl(var(--primary))"
                strokeWidth="1.2"
                opacity="0.4"
                markerEnd="url(#flowArrow)"
              />
              <text
                x="305"
                y={wireYPositions[wireCount - 1] + 32}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="hsl(var(--primary))"
                opacity="0.55"
              >
                I = {loadCurrent.toFixed(1)} A
              </text>
            </g>

            {/* ════════════ LOSS CALLOUT BOX ════════════ */}
            <g className="anim-entry loss-indicator">
              {/* Leader line */}
              <line
                x1="530"
                y1={wireYPositions[0] - 5}
                x2="530"
                y2={wireYPositions[0] - 30}
                stroke={statusColor}
                strokeWidth="1.2"
                opacity="0.4"
                strokeDasharray="4 3"
              />
              <circle
                cx="530"
                cy={wireYPositions[0] - 2}
                r="3"
                fill={statusColor}
                opacity="0.3"
              />

              {/* Box */}
              <rect
                x="460"
                y={wireYPositions[0] - 68}
                width="140"
                height="40"
                rx="6"
                fill="var(--background, #fff)"
                stroke={statusColor}
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              <rect
                x="460"
                y={wireYPositions[0] - 68}
                width="140"
                height="16"
                rx="6"
                fill={statusColor}
                opacity="0.1"
              />
              <text
                x="530"
                y={wireYPositions[0] - 56}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill={statusColor}
                opacity="0.8"
                letterSpacing="1"
              >
                TỔN THẤT
              </text>
              <text
                x="530"
                y={wireYPositions[0] - 36}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={statusColor}
              >
                −{deltaU.toFixed(2)}V ({deltaU_percent.toFixed(2)}%)
              </text>
            </g>

            {/* ════════════ DIMENSION LINE ════════════ */}
            <g className="anim-entry">
              {/* Dimension line */}
              <line
                x1={wireStartX}
                y1={wireYPositions[wireCount - 1] + 48}
                x2={wireEndX}
                y2={wireYPositions[wireCount - 1] + 48}
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.25"
              />
              {/* End ticks */}
              <line
                x1={wireStartX}
                y1={wireYPositions[wireCount - 1] + 42}
                x2={wireStartX}
                y2={wireYPositions[wireCount - 1] + 54}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.25"
              />
              <line
                x1={wireEndX}
                y1={wireYPositions[wireCount - 1] + 42}
                x2={wireEndX}
                y2={wireYPositions[wireCount - 1] + 54}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.25"
              />
              {/* Extension lines */}
              <line
                x1={wireStartX}
                y1={wireYPositions[wireCount - 1] + 8}
                x2={wireStartX}
                y2={wireYPositions[wireCount - 1] + 54}
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.12"
              />
              <line
                x1={wireEndX}
                y1={wireYPositions[wireCount - 1] + 8}
                x2={wireEndX}
                y2={wireYPositions[wireCount - 1] + 54}
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.12"
              />
              {/* Dimension label */}
              <rect
                x="395"
                y={wireYPositions[wireCount - 1] + 39}
                width="70"
                height="18"
                rx="4"
                fill="var(--background, #fff)"
              />
              <text
                x="430"
                y={wireYPositions[wireCount - 1] + 53}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="currentColor"
                opacity="0.45"
              >
                L = {length}m
              </text>
            </g>

            {/* ════════════ RESISTOR LABEL ════════════ */}
            <g className="anim-entry">
              <text
                x={(resistorStartX + resistorEndX) / 2}
                y={wireYPositions[0] - 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="currentColor"
                opacity="0.4"
              >
                R = {rTotal} Ω
              </text>
              {xTotal && (
                <text
                  x={(resistorStartX + resistorEndX) / 2}
                  y={wireYPositions[0] - 7}
                  textAnchor="middle"
                  fontSize="8"
                  fill="currentColor"
                  opacity="0.35"
                >
                  X = {xTotal} Ω
                </text>
              )}
            </g>

            {/* ════════════════ LOAD TERMINAL ════════════════ */}
            <g className="anim-entry" filter="url(#shadowBox)">
              {/* Glow behind */}
              <rect
                className="load-glow"
                x={loadTermX - 5}
                y={wireYPositions[0] - 30}
                width="110"
                height={wireYPositions[wireCount - 1] - wireYPositions[0] + 60}
                rx="12"
                fill={statusColor}
                opacity="0.1"
              />
              {/* Main box */}
              <rect
                x={loadTermX}
                y={wireYPositions[0] - 25}
                width="100"
                height={wireYPositions[wireCount - 1] - wireYPositions[0] + 50}
                rx="8"
                fill="var(--background, #fff)"
                stroke={statusColor}
                strokeWidth="2"
                strokeOpacity="0.5"
              />
              {/* Title bar */}
              <rect
                x={loadTermX}
                y={wireYPositions[0] - 25}
                width="100"
                height="22"
                rx="8"
                fill={statusColor}
                opacity="0.12"
              />
              <text
                x={loadTermX + 50}
                y={wireYPositions[0] - 9}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={statusColor}
                letterSpacing="1"
              >
                PHỤ TẢI
              </text>
              {/* Voltage */}
              <text
                x={loadTermX + 50}
                y={wireYPositions[Math.floor(wireCount / 2)] + 6}
                textAnchor="middle"
                fontSize="22"
                fontWeight="800"
                fill={statusColor}
              >
                {uEnd.toFixed(1)}
              </text>
              <text
                x={loadTermX + 50}
                y={wireYPositions[Math.floor(wireCount / 2)] + 18}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                opacity="0.4"
              >
                Volt
              </text>
              {/* Power */}
              <text
                x={loadTermX + 50}
                y={wireYPositions[wireCount - 1] + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={statusColor}
                opacity="0.7"
              >
                {(loadPower / 1000).toFixed(2)} kW
              </text>

              {/* Terminal dots on left edge */}
              {wireYPositions.map((y, i) => (
                <g key={`load-t-${wireLabels[i]}`}>
                  <circle
                    cx={loadTermX}
                    cy={y}
                    r="5"
                    fill={statusColor}
                    opacity="0.7"
                  />
                  <circle
                    cx={loadTermX}
                    cy={y}
                    r="2.5"
                    fill="var(--background, #fff)"
                  />
                  <text
                    x={loadTermX + 16}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill={statusColor}
                    opacity="0.7"
                  >
                    {wireLabels[i]}
                  </text>
                </g>
              ))}
            </g>

            {/* ════════════ MOTOR/LOAD SYMBOL ════════════ */}
            <g className="anim-entry">
              {/* Line down from load box */}
              <line
                x1={loadTermX + 50}
                y1={wireYPositions[wireCount - 1] + 25}
                x2={loadTermX + 50}
                y2={wireYPositions[wireCount - 1] + 48}
                stroke={statusColor}
                strokeWidth="1.5"
                opacity="0.35"
              />
              {/* Motor circle */}
              <circle
                cx={loadTermX + 50}
                cy={wireYPositions[wireCount - 1] + 64}
                r="16"
                fill="none"
                stroke={statusColor}
                strokeWidth="1.8"
                opacity="0.35"
              />
              <text
                x={loadTermX + 50}
                y={wireYPositions[wireCount - 1] + 69}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill={statusColor}
                opacity="0.4"
              >
                M
              </text>
            </g>

            {/* ════════════ POWER LOSS ANNOTATION ════════════ */}
            <g className="anim-entry">
              <text
                x={(resistorStartX + resistorEndX) / 2}
                y={wireYPositions[wireCount - 1] + 18}
                textAnchor="middle"
                fontSize="8.5"
                fill="currentColor"
                opacity="0.35"
              >
                ΔP ={" "}
                {deltaP > 1000
                  ? `${(deltaP / 1000).toFixed(3)} kW`
                  : `${deltaP.toFixed(1)} W`}
              </text>
            </g>

            {/* ════════════ STATUS BADGE ════════════ */}
            <g className="anim-entry">
              <rect
                x="340"
                y={diagramHeight - 40}
                width="140"
                height="28"
                rx="14"
                fill={statusColor}
                opacity="0.12"
                stroke={statusColor}
                strokeWidth="1.2"
                strokeOpacity="0.3"
              />
              <text
                x="410"
                y={diagramHeight - 22}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={statusColor}
                letterSpacing="2"
              >
                {statusLabel}
              </text>
            </g>

            {/* ════════════ EFFICIENCY LABEL ════════════ */}
            <g className="anim-entry">
              <text
                x="410"
                y={diagramHeight - 6}
                textAnchor="middle"
                fontSize="8.5"
                fill="currentColor"
                opacity="0.3"
              >
                Hiệu suất truyền tải: {efficiency.toFixed(2)}%
              </text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
