// apps/tools/src/components/tools/FxSpecialDevices/data/fxDevicesData.js
// Điểm xuất trung tâm (Entry Point) của cơ sở dữ liệu Special Devices PLC Mitsubishi FX
// Chia tách module thành bitDevices.js và wordDevices.js để tối ưu cấu trúc code và bảo trì dễ dàng.

import { BIT_DEVICES } from "./bitDevices";
import { WORD_DEVICES } from "./wordDevices";

export const CATEGORIES = [
  { id: "all", label: "Tất cả Danh mục", icon: "Layers" },
  { id: "system", label: "Trạng thái & Điều khiển Hệ thống", icon: "Cpu" },
  { id: "clock", label: "Đồng hồ RTC & Cờ Xung Chu kỳ", icon: "Clock" },
  { id: "math", label: "Cờ Phép toán & Trạng thái Lệnh", icon: "Calculator" },
  {
    id: "error",
    label: "Cờ & Mã Báo lỗi (Error Codes)",
    icon: "AlertTriangle",
  },
  {
    id: "comm",
    label: "Truyền thông Serial / RS / Modbus / N:N",
    icon: "Radio",
  },
  {
    id: "positioning",
    label: "Phát Xung Tốc độ cao & Định vị (Motion)",
    icon: "Activity",
  },
  { id: "analog", label: "Bo & Module Mở rộng Analog", icon: "Sliders" },
];

export const ACCESS_MODES = [
  { id: "all", label: "Tất cả R/W" },
  {
    id: "R",
    label: "Chỉ đọc (Read Only)",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "W",
    label: "Chỉ ghi (Write Only)",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "R/W",
    label: "Đọc & Ghi (Read/Write)",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
];

export { BIT_DEVICES, WORD_DEVICES };

export const ALL_DEVICES = [...BIT_DEVICES, ...WORD_DEVICES];
