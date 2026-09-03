import React from "react";
import ToolLayout from "@/components/ToolLayout";
import InverterFaults from "@/components/tools/InverterFaults";

export default function InverterFaultsPage() {
  return (
    <ToolLayout
      title="Tra Cứu Mã Lỗi & Thanh Ghi Modbus Biến Tần"
      description="Công cụ toàn diện hỗ trợ ní tra cứu mã lỗi, mã Hex/Dec, nguyên nhân,
          Gợi ý xử lý và đầy đủ thanh ghi cuộn Coil & Holding Register (RS-485
          Modbus RTU) cho các dòng biến tần Mitsubishi, Omron, Wecon..."
    >
      <InverterFaults />
    </ToolLayout>
  );
}
