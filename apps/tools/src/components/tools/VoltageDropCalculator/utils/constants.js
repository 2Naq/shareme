export const SYSTEM_OPTIONS = [
  { label: "Điện 1 Pha AC (220V)", value: "1-phase", defaultV: 220 },
  { label: "Điện 3 Pha AC (380V)", value: "3-phase", defaultV: 380 },
  { label: "Điện Một Chiều (DC)", value: "DC", defaultV: 24 },
];

export const MATERIAL_OPTIONS = [
  { label: "Đồng (Copper - Cu)", value: "Cu", rho20: 0.0178, rho75: 0.0225 },
  { label: "Nhôm (Aluminum - Al)", value: "Al", rho20: 0.0282, rho75: 0.036 },
  {
    label: "Tùy chỉnh (Custom)",
    value: "custom",
    rho20: 0.0178,
    rho75: 0.0225,
  },
];

export const STANDARD_WIRE_SIZES = [
  1.5, 2.5, 4.0, 6.0, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400,
];
