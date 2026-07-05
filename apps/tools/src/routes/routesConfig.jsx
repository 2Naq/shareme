import { Home, SlidersHorizontal, Hash, MonitorPlay, Zap } from 'lucide-react';
import ToolPage from '../pages/tool/index';
import AnalogScalingPage from '../pages/tool/analog-scaling';
import Rs485HexPage from '../pages/tool/rs485-hex';
import HmiIntroPage from '../pages/tool/hmi-intro';
import InverterIntroPage from '../pages/tool/inverter-intro';
import SelectScrollable from '@/pages/tool/test';
import ElectricalCalculatorPage from '../pages/tool/electrical-calculator';

// Cấu hình các route của ứng dụng
// Bạn có thể thêm icon, group, hoặc thuộc tính ẩn/hiện để sau này dùng cho Sidebar
export const routeConfig = [
  {
    path: '/tool',
    label: 'Tổng quan',
    element: <ToolPage />,
    showInSidebar: true,
    icon: Home,
  },
  {
    path: '/tool/rs485-hex',
    label: 'Phân tích RS485 HEX',
    element: <Rs485HexPage />,
    showInSidebar: true,
    icon: Hash,
  },
  {
    path: '/tool/analog-scaling',
    label: 'Chuyển đổi Analog',
    element: <AnalogScalingPage />,
    showInSidebar: true,
    icon: SlidersHorizontal,
  },
  {
    path: '/tool/electrical-calculator',
    label: 'Tính Toán Điện',
    element: <ElectricalCalculatorPage />,
    showInSidebar: true,
    icon: Zap,
  },
  {
    path: '/tool/hmi-intro',
    label: 'Giới thiệu HMI',
    element: <HmiIntroPage />,
    showInSidebar: false,
    icon: MonitorPlay,
  },
  {
    path: '/tool/inverter-intro',
    label: 'Giới thiệu Inverter',
    element: <InverterIntroPage />,
    showInSidebar: false,
    icon: Zap,
  },
  {
    path: '/tool/test',
    label: 'Test',
    element: <SelectScrollable />,
    showInSidebar: false,
    icon: Zap,
  },
];
