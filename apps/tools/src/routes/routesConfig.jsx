import React from "react";
import {
  Home,
  SlidersHorizontal,
  Hash,
  MonitorPlay,
  Zap,
  CircuitBoard,
  Scissors,
  Activity,
  Binary,
  QrCode,
  Scan,
  Gauge,
} from "lucide-react";

const ToolPage = React.lazy(() => import("@/pages/tools/index"));
const AnalogScalingPage = React.lazy(
  () => import("@/pages/tools/analog-scaling"),
);
const Rs485HexPage = React.lazy(() => import("@/pages/tools/rs485-hex"));
const HmiIntroPage = React.lazy(() => import("@/pages/tools/hmi-intro"));
const InverterIntroPage = React.lazy(
  () => import("@/pages/tools/inverter-intro"),
);
const SelectScrollable = React.lazy(() => import("@/pages/tools/test"));
const ElectricalCalculatorPage = React.lazy(
  () => import("@/pages/tools/electrical-calculator"),
);
const VoltageDropPage = React.lazy(() => import("@/pages/tools/voltage-drop"));
const ResistorCalculatorPage = React.lazy(
  () => import("@/pages/tools/resistor-calculator"),
);
const CableCuttingPage = React.lazy(
  () => import("@/pages/tools/cable-cutting"),
);
const DataConversionPage = React.lazy(
  () => import("@/pages/tools/data-conversion"),
);
const QrCodePage = React.lazy(() => import("@/pages/tools/qr-code"));
const QrCodeScannerPage = React.lazy(
  () => import("@/pages/tools/qr-code-scanner"),
);
const PidSimulatorPage = React.lazy(
  () => import("@/pages/tools/pid-simulator"),
);

// Định nghĩa các nhóm công cụ
export const groups = [
  {
    id: "system",
    label: "Hệ thống",
  },
  {
    id: "qr",
    label: "Mã QR Code",
  },
  {
    id: "data",
    label: "Xử lý & Chuyển đổi dữ liệu",
  },
  {
    id: "calculation",
    label: "Tính toán Kỹ thuật",
  },
  {
    id: "intro",
    label: "Tài liệu Giới thiệu",
  },
];

// Cấu hình các route của ứng dụng
export const routeConfig = [
  {
    path: "/tools",
    label: "Tổng quan",
    element: <ToolPage />,
    showInSidebar: true,
    icon: Home,
    group: "system",
  },
  {
    path: "/tools/qr-generator",
    label: "Tạo Mã QR Code",
    element: <QrCodePage />,
    showInSidebar: true,
    icon: QrCode,
    group: "qr",
  },
  {
    path: "/tools/qr-scanner",
    label: "Quét Mã QR Code",
    element: <QrCodeScannerPage />,
    showInSidebar: true,
    icon: Scan,
    group: "qr",
  },
  {
    path: "/tools/rs485-hex",
    label: "Phân tích RS485 HEX",
    element: <Rs485HexPage />,
    showInSidebar: true,
    icon: Hash,
    group: "data",
  },
  {
    path: "/tools/data-conversion",
    label: "Chuyển Đổi Dữ Liệu",
    element: <DataConversionPage />,
    showInSidebar: true,
    icon: Binary,
    group: "data",
  },
  {
    path: "/tools/analog-scaling",
    label: "Chuyển đổi Analog",
    element: <AnalogScalingPage />,
    showInSidebar: true,
    icon: SlidersHorizontal,
    group: "calculation",
  },
  {
    path: "/tools/electrical-calculator",
    label: "Tính Toán Thông số Điện",
    element: <ElectricalCalculatorPage />,
    showInSidebar: true,
    icon: Zap,
    group: "calculation",
  },
  {
    path: "/tools/voltage-drop",
    label: "Tính Độ Sụt Áp",
    element: <VoltageDropPage />,
    showInSidebar: true,
    icon: Activity,
    group: "calculation",
  },
  {
    path: "/tools/resistor-calculator",
    label: "Tính Toán Điện Trở",
    element: <ResistorCalculatorPage />,
    showInSidebar: true,
    icon: CircuitBoard,
    group: "calculation",
  },
  {
    path: "/tools/pid-simulator",
    label: "Mô Phỏng PID",
    element: <PidSimulatorPage />,
    showInSidebar: true,
    icon: Gauge,
    group: "calculation",
  },
  {
    path: "/tools/cable-cutting",
    label: "Tính Toán Cắt Máng",
    element: <CableCuttingPage />,
    showInSidebar: false,
    icon: Scissors,
    group: "calculation",
  },
  {
    path: "/tools/hmi-intro",
    label: "Giới thiệu HMI",
    element: <HmiIntroPage />,
    showInSidebar: false,
    icon: MonitorPlay,
    group: "intro",
  },
  {
    path: "/tools/inverter-intro",
    label: "Giới thiệu Inverter",
    element: <InverterIntroPage />,
    showInSidebar: false,
    icon: Zap,
    group: "intro",
  },
  {
    path: "/tools/test",
    label: "Test",
    element: <SelectScrollable />,
    showInSidebar: false,
    icon: Zap,
    group: "system",
  },
];
