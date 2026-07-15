import React from "react";
import {
  Home,
  SlidersHorizontal,
  Hash,
  MonitorPlay,
  Zap,
  CircuitBoard,
  Scissors,
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
const ResistorCalculatorPage = React.lazy(
  () => import("@/pages/tool/resistor-calculator"),
);
const CableCuttingPage = React.lazy(() => import("@/pages/tool/cable-cutting"));

// Cấu hình các route của ứng dụng
export const routeConfig = [
  {
    path: "/tool",
    label: "Tổng quan",
    element: <ToolPage />,
    showInSidebar: true,
    icon: Home,
  },
  {
    path: "/tool/rs485-hex",
    label: "Phân tích RS485 HEX",
    element: <Rs485HexPage />,
    showInSidebar: true,
    icon: Hash,
  },
  {
    path: "/tool/analog-scaling",
    label: "Chuyển đổi Analog",
    element: <AnalogScalingPage />,
    showInSidebar: true,
    icon: SlidersHorizontal,
  },
  {
    path: "/tool/electrical-calculator",
    label: "Tính Toán Điện",
    element: <ElectricalCalculatorPage />,
    showInSidebar: true,
    icon: Zap,
  },
  {
    path: "/tool/resistor-calculator",
    label: "Tính Toán Điện Trở",
    element: <ResistorCalculatorPage />,
    showInSidebar: true,
    icon: CircuitBoard,
  },
  {
    path: "/tool/cable-cutting",
    label: "Tính Toán Cắt Máng",
    element: <CableCuttingPage />,
    showInSidebar: false,
    icon: Scissors,
  },
  {
    path: "/tool/hmi-intro",
    label: "Giới thiệu HMI",
    element: <HmiIntroPage />,
    showInSidebar: false,
    icon: MonitorPlay,
  },
  {
    path: "/tool/inverter-intro",
    label: "Giới thiệu Inverter",
    element: <InverterIntroPage />,
    showInSidebar: false,
    icon: Zap,
  },
  {
    path: "/tool/test",
    label: "Test",
    element: <SelectScrollable />,
    showInSidebar: false,
    icon: Zap,
  },
];
