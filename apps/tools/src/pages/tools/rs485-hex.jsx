import React from "react";
import ToolLayout from "../../components/ToolLayout";
import Rs485HexCalculator from "../../components/tools/Rs485HexCalculator";

export default function Rs485HexPage() {
  return (
    <ToolLayout
      title="RS485 Hex Calculator - Mitsubishi PLC"
      description="Công cụ tính mã Hex cấu hình RS485 cho thanh ghi D8120/D8420 PLC Mitsubishi dòng FX."
    >
      <Rs485HexCalculator />
    </ToolLayout>
  );
}
