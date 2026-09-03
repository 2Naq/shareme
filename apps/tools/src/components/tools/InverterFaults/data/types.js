export const BRANDS = [
  { id: "all", label: "Tất cả các hãng", badge: "All" },
  {
    id: "mitsubishi",
    label: "Mitsubishi Electric",
    badge: "Mitsubishi",
    color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  },
  {
    id: "siemens",
    label: "Siemens",
    badge: "Siemens",
    color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    id: "abb",
    label: "ABB",
    badge: "ABB",
    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    id: "schneider",
    label: "Schneider Electric",
    badge: "Schneider",
    color:
      "bg-green-600/15 text-green-600 dark:text-green-400 border-green-600/30",
  },
  {
    id: "ls",
    label: "LS Electric",
    badge: "LS",
    color: "bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-600/30",
  },
  {
    id: "delta",
    label: "Delta Electronics",
    badge: "Delta",
    color:
      "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    id: "invt",
    label: "INVT",
    badge: "INVT",
    color: "bg-red-600/15 text-red-600 dark:text-red-400 border-red-600/30",
  },
  {
    id: "omron",
    label: "Omron Industrial",
    badge: "Omron",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    id: "wecon",
    label: "Wecon Technology",
    badge: "Wecon",
    color:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    id: "shihlin",
    label: "Shihlin Electric",
    badge: "Shihlin",
    color:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    id: "kaman",
    label: "Kaman Automation",
    badge: "Kaman",
    color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  {
    id: "arinco",
    label: "Arinco",
    badge: "Arinco",
    color:
      "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  },
  {
    id: "koc",
    label: "KOC / KCLY",
    badge: "KOC",
    color:
      "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
];

export const FAULT_CATEGORIES = [
  { id: "all", label: "Tất cả nhóm lỗi" },
  {
    id: "overcurrent",
    label: "Quá dòng & Chập mạch",
    color: "bg-red-500/15 text-red-600 border-red-500/30",
  },
  {
    id: "overvoltage",
    label: "Quá áp & Xả hãm",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  },
  {
    id: "overload",
    label: "Quá tải & Quá nhiệt",
    color: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  },
  {
    id: "power",
    label: "Nguồn cấp & Mất pha",
    color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  },
  {
    id: "comm",
    label: "Truyền thông & Ngoại vi",
    color: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  },
  {
    id: "hardware",
    label: "Phần cứng & CPU/Bộ nhớ",
    color: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  },
  {
    id: "warning",
    label: "Cảnh báo vận hành (Không dừng)",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  },
];

export const REGISTER_CATEGORIES = [
  { id: "all", label: "Tất cả chức năng" },
  {
    id: "control",
    label: "Lệnh điều khiển (Run/Stop/Speed)",
    color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  {
    id: "status",
    label: "Trạng thái vận hành (Status Bits)",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  },
  {
    id: "monitor",
    label: "Giám sát ngõ ra (Hz, A, V, kW)",
    color: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30",
  },
  {
    id: "fault",
    label: "Giám sát & Lịch sử mã lỗi",
    color: "bg-red-500/15 text-red-600 border-red-500/30",
  },
  {
    id: "parameter",
    label: "Tham số cài đặt",
    color: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  },
];

export const REGISTER_TYPES = [
  { id: "all", label: "Tất cả loại Modbus" },
  { id: "coil", label: "Cuộn Coil (0xxxx / Bit)" },
  { id: "holding", label: "Holding Register (4xxxx / 16-bit)" },
];
