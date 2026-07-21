import React from "react";
import ToolLayout from "@/components/ToolLayout";
import QrCodeScanner from "@/components/tools/QrCodeScanner";

export default function QrCodeScannerPage() {
  return (
    <ToolLayout>
      <QrCodeScanner />
    </ToolLayout>
  );
}
