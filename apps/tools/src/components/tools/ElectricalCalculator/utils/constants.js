// ===== HỆ THỐNG ĐIỆN =====
export const SYSTEM_OPTIONS = [
  { label: "Điện 1 Pha AC (220V)", value: "1-phase", defaultV: 220 },
  { label: "Điện 3 Pha AC (380V)", value: "3-phase", defaultV: 380 },
  { label: "Điện Một Chiều (DC)", value: "DC", defaultV: 24 },
];

export const TARGET_OPTIONS = [
  { label: "Dòng Điện (I)", value: "I" },
  { label: "Công Suất (P)", value: "P" },
  { label: "Điện Áp (U)", value: "U" },
];

// ===== CB & DÂY DẪN =====
export const CB_SIZES = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400,
  500, 630, 800, 1000, 1250, 1600,
];

export const WIRE_SIZES = [
  { size: 1.5, maxI: 16 },
  { size: 2.5, maxI: 25 },
  { size: 4.0, maxI: 32 },
  { size: 6.0, maxI: 40 },
  { size: 10, maxI: 63 },
  { size: 16, maxI: 80 },
  { size: 25, maxI: 100 },
  { size: 35, maxI: 125 },
  { size: 50, maxI: 160 },
  { size: 70, maxI: 200 },
  { size: 95, maxI: 250 },
  { size: 120, maxI: 300 },
  { size: 150, maxI: 350 },
  { size: 185, maxI: 400 },
  { size: 240, maxI: 500 },
  { size: 300, maxI: 600 },
];

// ===== MOTOR DATABASE =====
// Bảng thông số motor tiêu chuẩn IEC (380V, 3 pha, 50Hz, 4 cực - 1500rpm)
// I_dm: dòng định mức (A), startMultiplier: bội số dòng khởi động DOL
// eta: hiệu suất, cosPhi: hệ số công suất
export const MOTOR_DATABASE = [
  { kW: 0.37, hp: 0.5, I_dm: 1.2, startMultiplier: 5, eta: 0.72, cosPhi: 0.72 },
  { kW: 0.55, hp: 0.75, I_dm: 1.7, startMultiplier: 5, eta: 0.75, cosPhi: 0.75 },
  { kW: 0.75, hp: 1.0, I_dm: 2.2, startMultiplier: 5.5, eta: 0.78, cosPhi: 0.76 },
  { kW: 1.1, hp: 1.5, I_dm: 3.0, startMultiplier: 5.5, eta: 0.80, cosPhi: 0.78 },
  { kW: 1.5, hp: 2.0, I_dm: 3.9, startMultiplier: 6, eta: 0.81, cosPhi: 0.80 },
  { kW: 2.2, hp: 3.0, I_dm: 5.5, startMultiplier: 6, eta: 0.83, cosPhi: 0.81 },
  { kW: 3.0, hp: 4.0, I_dm: 7.2, startMultiplier: 6.5, eta: 0.84, cosPhi: 0.82 },
  { kW: 4.0, hp: 5.5, I_dm: 9.4, startMultiplier: 6.5, eta: 0.85, cosPhi: 0.83 },
  { kW: 5.5, hp: 7.5, I_dm: 12.5, startMultiplier: 7, eta: 0.86, cosPhi: 0.84 },
  { kW: 7.5, hp: 10, I_dm: 16.8, startMultiplier: 7, eta: 0.87, cosPhi: 0.85 },
  { kW: 11, hp: 15, I_dm: 24.0, startMultiplier: 7, eta: 0.88, cosPhi: 0.85 },
  { kW: 15, hp: 20, I_dm: 32.0, startMultiplier: 7, eta: 0.89, cosPhi: 0.86 },
  { kW: 18.5, hp: 25, I_dm: 38.5, startMultiplier: 7, eta: 0.90, cosPhi: 0.86 },
  { kW: 22, hp: 30, I_dm: 45.0, startMultiplier: 7.5, eta: 0.90, cosPhi: 0.87 },
  { kW: 30, hp: 40, I_dm: 60.0, startMultiplier: 7.5, eta: 0.91, cosPhi: 0.87 },
  { kW: 37, hp: 50, I_dm: 73.0, startMultiplier: 7.5, eta: 0.92, cosPhi: 0.87 },
  { kW: 45, hp: 60, I_dm: 88.0, startMultiplier: 7.5, eta: 0.92, cosPhi: 0.88 },
  { kW: 55, hp: 75, I_dm: 106, startMultiplier: 7.5, eta: 0.93, cosPhi: 0.88 },
  { kW: 75, hp: 100, I_dm: 143, startMultiplier: 7.5, eta: 0.93, cosPhi: 0.89 },
  { kW: 90, hp: 125, I_dm: 170, startMultiplier: 7.5, eta: 0.94, cosPhi: 0.89 },
  { kW: 110, hp: 150, I_dm: 207, startMultiplier: 7.5, eta: 0.94, cosPhi: 0.89 },
  { kW: 132, hp: 175, I_dm: 247, startMultiplier: 7.5, eta: 0.95, cosPhi: 0.89 },
  { kW: 160, hp: 215, I_dm: 298, startMultiplier: 7.5, eta: 0.95, cosPhi: 0.90 },
  { kW: 200, hp: 270, I_dm: 370, startMultiplier: 7.5, eta: 0.95, cosPhi: 0.90 },
  { kW: 250, hp: 340, I_dm: 460, startMultiplier: 7.5, eta: 0.96, cosPhi: 0.90 },
  { kW: 315, hp: 430, I_dm: 577, startMultiplier: 7.5, eta: 0.96, cosPhi: 0.91 },
];

// ===== PHƯƠNG PHÁP KHỞI ĐỘNG =====
export const START_METHODS = [
  { label: "DOL (Trực tiếp)", value: "DOL", factor: 1.0 },
  { label: "Sao – Tam giác (Y-Δ)", value: "star-delta", factor: 1 / 3 },
  { label: "Soft Starter", value: "soft-starter", factor: 0.4 },
  { label: "Biến tần (VFD)", value: "VFD", factor: 0.1 },
];

// ===== RELAY NHIỆT =====
// Dải chỉnh relay nhiệt phổ biến (theo Schneider / LS)
export const THERMAL_RELAY_RANGES = [
  { range: "0.1 – 0.16", min: 0.1, max: 0.16 },
  { range: "0.16 – 0.25", min: 0.16, max: 0.25 },
  { range: "0.25 – 0.4", min: 0.25, max: 0.4 },
  { range: "0.4 – 0.63", min: 0.4, max: 0.63 },
  { range: "0.63 – 1.0", min: 0.63, max: 1.0 },
  { range: "1.0 – 1.6", min: 1.0, max: 1.6 },
  { range: "1.6 – 2.5", min: 1.6, max: 2.5 },
  { range: "2.5 – 4.0", min: 2.5, max: 4.0 },
  { range: "4.0 – 6.0", min: 4.0, max: 6.0 },
  { range: "6.0 – 9.0", min: 6.0, max: 9.0 },
  { range: "9.0 – 13", min: 9.0, max: 13 },
  { range: "12 – 18", min: 12, max: 18 },
  { range: "17 – 25", min: 17, max: 25 },
  { range: "23 – 32", min: 23, max: 32 },
  { range: "30 – 40", min: 30, max: 40 },
  { range: "37 – 50", min: 37, max: 50 },
  { range: "48 – 65", min: 48, max: 65 },
  { range: "55 – 70", min: 55, max: 70 },
  { range: "63 – 80", min: 63, max: 80 },
  { range: "80 – 104", min: 80, max: 104 },
  { range: "95 – 120", min: 95, max: 120 },
  { range: "110 – 140", min: 110, max: 140 },
  { range: "132 – 220", min: 132, max: 220 },
];

// ===== GỢI Ý BIẾN TẦN =====
// Bảng gợi ý thông số biến tần theo công suất motor (380V, 3 pha)
export const VFD_SUGGESTIONS = [
  { motorKW: 0.75, vfdKW: 0.75, vfdI: 2.5, accTime: 5, decTime: 5 },
  { motorKW: 1.5, vfdKW: 1.5, vfdI: 4.0, accTime: 5, decTime: 5 },
  { motorKW: 2.2, vfdKW: 2.2, vfdI: 5.5, accTime: 8, decTime: 5 },
  { motorKW: 3.0, vfdKW: 4.0, vfdI: 9.0, accTime: 10, decTime: 8 },
  { motorKW: 4.0, vfdKW: 4.0, vfdI: 9.5, accTime: 10, decTime: 8 },
  { motorKW: 5.5, vfdKW: 5.5, vfdI: 13.0, accTime: 15, decTime: 10 },
  { motorKW: 7.5, vfdKW: 7.5, vfdI: 17.0, accTime: 15, decTime: 10 },
  { motorKW: 11, vfdKW: 11, vfdI: 25.0, accTime: 20, decTime: 15 },
  { motorKW: 15, vfdKW: 15, vfdI: 32.0, accTime: 20, decTime: 15 },
  { motorKW: 18.5, vfdKW: 18.5, vfdI: 38.0, accTime: 25, decTime: 15 },
  { motorKW: 22, vfdKW: 22, vfdI: 45.0, accTime: 25, decTime: 15 },
  { motorKW: 30, vfdKW: 30, vfdI: 60.0, accTime: 30, decTime: 20 },
  { motorKW: 37, vfdKW: 37, vfdI: 75.0, accTime: 30, decTime: 20 },
  { motorKW: 45, vfdKW: 45, vfdI: 90.0, accTime: 30, decTime: 20 },
  { motorKW: 55, vfdKW: 55, vfdI: 110, accTime: 40, decTime: 25 },
  { motorKW: 75, vfdKW: 75, vfdI: 150, accTime: 40, decTime: 30 },
  { motorKW: 90, vfdKW: 90, vfdI: 176, accTime: 45, decTime: 30 },
  { motorKW: 110, vfdKW: 110, vfdI: 210, accTime: 50, decTime: 30 },
  { motorKW: 132, vfdKW: 132, vfdI: 253, accTime: 50, decTime: 30 },
  { motorKW: 160, vfdKW: 160, vfdI: 304, accTime: 60, decTime: 40 },
  { motorKW: 200, vfdKW: 200, vfdI: 380, accTime: 60, decTime: 40 },
  { motorKW: 250, vfdKW: 250, vfdI: 470, accTime: 60, decTime: 40 },
  { motorKW: 315, vfdKW: 315, vfdI: 590, accTime: 60, decTime: 40 },
];

// Thông số bảo vệ biến tần mặc định
export const VFD_PROTECTION_DEFAULTS = {
  overloadPercent: 150, // % quá tải (so với dòng đm)
  overloadTime: 60,     // giây cho phép quá tải
  overCurrentPercent: 200, // % quá dòng tức thời
  overVoltagePercent: 120, // % quá áp
  underVoltagePercent: 80, // % thấp áp
  minFreq: 0.5,    // Hz
  maxFreq: 50,     // Hz
  minRPM: 15,      // vòng/phút (4-pole motor)
  maxRPM: 1500,    // vòng/phút (4-pole motor)
  carrierFreq: 4,  // kHz PWM
};

// ===== THIẾT BỊ DÂN DỤNG =====
export const APPLIANCE_DATABASE = [
  { id: "fan", name: "Quạt trần / Quạt đứng", watts: 75, cosPhi: 0.85, group: "general", icon: "🌀" },
  { id: "led", name: "Đèn LED (bộ)", watts: 20, cosPhi: 0.95, group: "lighting", icon: "💡" },
  { id: "fluorescent", name: "Đèn huỳnh quang", watts: 40, cosPhi: 0.6, group: "lighting", icon: "💡" },
  { id: "outlet", name: "Ổ cắm đa năng", watts: 200, cosPhi: 0.85, group: "general", icon: "🔌" },
  { id: "fridge", name: "Tủ lạnh", watts: 150, cosPhi: 0.65, group: "kitchen", icon: "🧊" },
  { id: "washing", name: "Máy giặt", watts: 500, cosPhi: 0.75, group: "heavy", icon: "🫧" },
  { id: "water_heater", name: "Bình nóng lạnh", watts: 2500, cosPhi: 1.0, group: "heavy", icon: "🔥" },
  { id: "rice_cooker", name: "Nồi cơm điện", watts: 700, cosPhi: 1.0, group: "kitchen", icon: "🍚" },
  { id: "microwave", name: "Lò vi sóng", watts: 1200, cosPhi: 0.9, group: "kitchen", icon: "📡" },
  { id: "tv", name: "TV / Màn hình", watts: 100, cosPhi: 0.85, group: "general", icon: "📺" },
  { id: "computer", name: "Máy tính bàn", watts: 300, cosPhi: 0.7, group: "general", icon: "🖥️" },
  { id: "iron", name: "Bàn ủi", watts: 1000, cosPhi: 1.0, group: "heavy", icon: "👔" },
  { id: "pump", name: "Máy bơm nước", watts: 750, cosPhi: 0.75, group: "heavy", icon: "💧" },
  { id: "ac", name: "Máy lạnh (Điều hòa)", watts: 0, cosPhi: 0.85, group: "ac", icon: "❄️" },
];

// ===== MÁY LẠNH — GỢI Ý BTU =====
export const AC_BTU_TABLE = [
  { areaMin: 0, areaMax: 10, btu: 9000, hp: 1.0, watts: 900, label: "9,000 BTU (1.0 HP)" },
  { areaMin: 10, areaMax: 15, btu: 12000, hp: 1.5, watts: 1200, label: "12,000 BTU (1.5 HP)" },
  { areaMin: 15, areaMax: 20, btu: 18000, hp: 2.0, watts: 1800, label: "18,000 BTU (2.0 HP)" },
  { areaMin: 20, areaMax: 30, btu: 24000, hp: 2.5, watts: 2400, label: "24,000 BTU (2.5 HP)" },
  { areaMin: 30, areaMax: 40, btu: 30000, hp: 3.0, watts: 3000, label: "30,000 BTU (3.0 HP)" },
  { areaMin: 40, areaMax: 60, btu: 36000, hp: 3.5, watts: 3500, label: "36,000 BTU (3.5 HP)" },
  { areaMin: 60, areaMax: 80, btu: 48000, hp: 5.0, watts: 4800, label: "48,000 BTU (5.0 HP)" },
];

// Nhóm tải dân dụng (để phân nhánh CB)
export const LOAD_GROUPS = {
  lighting: { label: "Chiếu sáng", color: "text-yellow-500" },
  general: { label: "Ổ cắm & Thiết bị chung", color: "text-blue-500" },
  kitchen: { label: "Bếp & Nhà bếp", color: "text-orange-500" },
  heavy: { label: "Tải nặng (Bơm, Giặt, Ủi...)", color: "text-red-500" },
  ac: { label: "Máy lạnh", color: "text-cyan-500" },
};

// ===== LOẠI PHỤ TẢI CÔNG NGHIỆP =====
export const INDUSTRIAL_LOAD_TYPES = [
  { label: "Động cơ", value: "motor", cosPhi: 0.85, demandFactor: 0.7 },
  { label: "Chiếu sáng", value: "lighting", cosPhi: 0.95, demandFactor: 0.9 },
  { label: "Sưởi / Nhiệt", value: "heating", cosPhi: 1.0, demandFactor: 0.8 },
  { label: "Thiết bị hỗn hợp", value: "mixed", cosPhi: 0.8, demandFactor: 0.6 },
];

// ===== GỢI Ý MBA =====
export const TRANSFORMER_SIZES = [
  50, 75, 100, 160, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500,
];
