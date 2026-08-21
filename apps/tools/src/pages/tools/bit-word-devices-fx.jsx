import React from "react";
import ToolLayout from "@/components/ToolLayout";
import FxSpecialDevices from "@/components/tools/FxSpecialDevices";

export default function BitWordDevicesFxPage() {
  return (
    <ToolLayout
      title="Tra Cứu Special Bit & Word Devices FX PLC"
      description="Công cụ tra cứu thông tin chi tiết các rơ-le phụ đặc biệt M8000+ và thanh ghi đặc biệt D8000+ dòng PLC Mitsubishi FX Series."
    >
      <FxSpecialDevices />
    </ToolLayout>
  );
}
