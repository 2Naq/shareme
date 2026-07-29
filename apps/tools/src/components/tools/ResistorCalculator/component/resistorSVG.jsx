// ============================================================
// INTERACTIVE SVG RESISTOR (THROUGH-HOLE)
// ============================================================

export default function ResistorSVG({ bands, bandCount, onBandClick }) {
  const svgWidth = 460;
  const svgHeight = 140;
  const bodyX = 80;
  const bodyW = 300;
  const bodyY = 35;
  const bodyH = 70;
  const bodyRx = 18;

  // Band positions for 4 and 5 bands
  const bandPositions4 = [
    { x: bodyX + 45, label: "Vòng 1", sub: "Chữ số 1" },
    { x: bodyX + 85, label: "Vòng 2", sub: "Chữ số 2" },
    { x: bodyX + 125, label: "Vòng 3", sub: "Hệ số nhân" },
    { x: bodyX + 220, label: "Vòng 4", sub: "Dung sai" },
  ];
  const bandPositions5 = [
    { x: bodyX + 35, label: "Vòng 1", sub: "Chữ số 1" },
    { x: bodyX + 70, label: "Vòng 2", sub: "Chữ số 2" },
    { x: bodyX + 105, label: "Vòng 3", sub: "Chữ số 3" },
    { x: bodyX + 140, label: "Vòng 4", sub: "Hệ số nhân" },
    { x: bodyX + 230, label: "Vòng 5", sub: "Dung sai" },
  ];

  const positions = bandCount === 4 ? bandPositions4 : bandPositions5;
  const bandW = 22;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-[500px] mx-auto select-none"
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }}
    >
      {/* Wires */}
      <line
        x1="0"
        y1={bodyY + bodyH / 2}
        x2={bodyX}
        y2={bodyY + bodyH / 2}
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={bodyX + bodyW}
        y1={bodyY + bodyH / 2}
        x2={svgWidth}
        y2={bodyY + bodyH / 2}
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Body */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={bodyRx}
        fill="#D2B48C"
        stroke="#A0845C"
        strokeWidth="2"
      />
      {/* Body highlight */}
      <rect
        x={bodyX + 4}
        y={bodyY + 4}
        width={bodyW - 8}
        height={bodyH / 2 - 4}
        rx={bodyRx - 4}
        fill="rgba(255,255,255,0.18)"
      />

      {/* Color Bands */}
      {positions.map((pos, i) => {
        const color = bands[i];
        const hexColor = color ? color.hex : "#E5E7EB";
        const isTransparent = hexColor === "transparent";

        return (
          <g
            key={i}
            className="cursor-pointer"
            onClick={(e) => onBandClick(i, e)}
          >
            {/* Clickable area (larger) */}
            <rect
              x={pos.x - 4}
              y={bodyY - 2}
              width={bandW + 8}
              height={bodyH + 4}
              fill="transparent"
              rx={4}
            />
            {/* Band */}
            <rect
              x={pos.x}
              y={bodyY + 2}
              width={bandW}
              height={bodyH - 4}
              rx={3}
              fill={isTransparent ? "#E5E7EB" : hexColor}
              stroke={isTransparent ? "#9CA3AF" : "rgba(0,0,0,0.2)"}
              strokeWidth="1"
              strokeDasharray={isTransparent ? "3,2" : "none"}
              className="transition-all duration-300"
            />
            {/* Highlight on band */}
            <rect
              x={pos.x + 2}
              y={bodyY + 4}
              width={bandW - 4}
              height={(bodyH - 4) / 3}
              rx={2}
              fill="rgba(255,255,255,0.25)"
              className="pointer-events-none"
            />
            {/* Hover indicator */}
            <rect
              x={pos.x - 2}
              y={bodyY}
              width={bandW + 4}
              height={bodyH}
              rx={5}
              fill="transparent"
              stroke="transparent"
              strokeWidth="2"
              className="transition-all duration-200 hover:stroke-primary/50"
            />
            {/* Label below */}
            <text
              x={pos.x + bandW / 2}
              y={bodyY + bodyH + 16}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px] font-medium pointer-events-none"
            >
              {pos.label}
            </text>
            <text
              x={pos.x + bandW / 2}
              y={bodyY + bodyH + 26}
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
