import { Home, SlidersHorizontal, Hash, MonitorPlay, Zap } from 'lucide-react';
import ToolPage from '../pages/tool/index';
import AnalogScalingPage from '../pages/tool/analog-scaling';
import Rs485HexPage from '../pages/tool/rs485-hex';
import HmiIntroPage from '../pages/tool/hmi-intro';
import InverterIntroPage from '../pages/tool/inverter-intro';

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
    path: '/tool/analog-scaling',
    label: 'Chuyển đổi Analog',
    element: <AnalogScalingPage />,
    showInSidebar: true,
    icon: SlidersHorizontal,
  },
  {
    path: '/tool/rs485-hex',
    label: 'Phân tích RS485 HEX',
    element: <Rs485HexPage />,
    showInSidebar: true,
    icon: Hash,
  },
  {
    path: '/tool/hmi-intro',
    label: 'Giới thiệu HMI',
    element: <HmiIntroPage />,
    showInSidebar: true,
    icon: MonitorPlay,
  },
  {
    path: '/tool/inverter-intro',
    label: 'Giới thiệu Inverter',
    element: <InverterIntroPage />,
    showInSidebar: true,
    icon: Zap,
  },
];
