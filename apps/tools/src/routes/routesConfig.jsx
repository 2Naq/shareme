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
} from "lucide-react";

const ToolPage = React.lazy(() => import("@/pages/tool/index"));
const AnalogScalingPage = React.lazy(
  () => import("@/pages/tool/analog-scaling"),
);
const Rs485HexPage = React.lazy(() => import("@/pages/tool/rs485-hex"));
const HmiIntroPage = React.lazy(() => import("@/pages/tool/hmi-intro"));
const InverterIntroPage = React.lazy(
  () => import("@/pages/tool/inverter-intro"),
);
const SelectScrollable = React.lazy(() => import("@/pages/tool/test"));
const ElectricalCalculatorPage = React.lazy(
  () => import("@/pages/tool/electrical-calculator"),
);
const VoltageDropPage = React.lazy(() => import("@/pages/tool/voltage-drop"));
const ResistorCalculatorPage = React.lazy(
  () => import("@/pages/tool/resistor-calculator"),
);
const CableCuttingPage = React.lazy(() => import("@/pages/tool/cable-cutting"));
const DataConversionPage = React.lazy(
  () => import("@/pages/tool/data-conversion"),
);
const QrCodePage = React.lazy(() => import("@/pages/tool/qr-code"));
const QrCodeScannerPage = React.lazy(
  () => import("@/pages/tool/qr-code-scanner"),
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
    path: "/tool",
    label: "Tổng quan",
    element: <ToolPage />,
    showInSidebar: true,
    icon: Home,
    group: "system",
  },
  {
    path: "/tool/qr-code",
    label: "Tạo Mã QR Code",
    element: <QrCodePage />,
    showInSidebar: true,
    icon: QrCode,
    group: "qr",
  },
  {
    path: "/tool/qr-code-scanner",
    label: "Quét Mã QR Code",
    element: <QrCodeScannerPage />,
    showInSidebar: true,
    icon: Scan,
    group: "qr",
  },
  {
    path: "/tool/rs485-hex",
    label: "Phân tích RS485 HEX",
    element: <Rs485HexPage />,
    showInSidebar: true,
    icon: Hash,
    group: "data",
  },
  {
    path: "/tool/data-conversion",
    label: "Chuyển Đổi Dữ Liệu",
    element: <DataConversionPage />,
    showInSidebar: true,
    icon: Binary,
    group: "data",
  },
  {
    path: "/tool/analog-scaling",
    label: "Chuyển đổi Analog",
    element: <AnalogScalingPage />,
    showInSidebar: true,
    icon: SlidersHorizontal,
    group: "calculation",
  },
  {
    path: "/tool/electrical-calculator",
    label: "Tính Toán Thông số Điện",
    element: <ElectricalCalculatorPage />,
    showInSidebar: true,
    icon: Zap,
    group: "calculation",
  },
  {
    path: "/tool/voltage-drop",
    label: "Tính Độ Sụt Áp",
    element: <VoltageDropPage />,
    showInSidebar: true,
    icon: Activity,
    group: "calculation",
  },
  {
    path: "/tool/resistor-calculator",
    label: "Tính Toán Điện Trở",
    element: <ResistorCalculatorPage />,
    showInSidebar: true,
    icon: CircuitBoard,
    group: "calculation",
  },
  {
    path: "/tool/cable-cutting",
    label: "Tính Toán Cắt Máng",
    element: <CableCuttingPage />,
    showInSidebar: false,
    icon: Scissors,
    group: "calculation",
  },
  {
    path: "/tool/hmi-intro",
    label: "Giới thiệu HMI",
    element: <HmiIntroPage />,
    showInSidebar: false,
    icon: MonitorPlay,
    group: "intro",
  },
  {
    path: "/tool/inverter-intro",
    label: "Giới thiệu Inverter",
    element: <InverterIntroPage />,
    showInSidebar: false,
    icon: Zap,
    group: "intro",
  },
  {
    path: "/tool/test",
    label: "Test",
    element: <SelectScrollable />,
    showInSidebar: false,
    icon: Zap,
    group: "system",
  },
];
