import React from "react";
import ToolLayout from "@/components/ToolLayout";
import WeconModbusMap from "@/components/tools/WeconModbusMap";

export default function WeconModbusMapPage() {
  return (
    <ToolLayout
      title="Ánh Xạ Địa Chỉ Modbus PLC WECON"
      description="Công cụ chuyển đổi 2 chiều giữa địa chỉ thiết bị PLC WECON (M, D, X, Y, S, SM, SD, R, T, C, LC, HSC) và địa chỉ Modbus 0-Based / 1-Based (+1 HMI Weintek)."
    >
      <WeconModbusMap />
    </ToolLayout>
  );
}
