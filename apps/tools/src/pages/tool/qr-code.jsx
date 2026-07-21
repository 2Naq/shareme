import React from "react";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import ToolLayout from "@/components/ToolLayout";

export default function QrCodePage() {
  return (
    <ToolLayout>
      <QrCodeGenerator />
    </ToolLayout>
  );
}
