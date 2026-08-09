import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanLine, QrCode, Barcode } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import sub-components
import QrScanner from "./components/QrScanner";
import BarcodeScanner from "./components/BarcodeScanner";
import ScanResult from "./components/ScanResult";

export default function QrCodeScanner() {
  const [activeTab, setActiveTab] = useState("qr");
  const [scanResult, setScanResult] = useState(null);
  // Key dùng để force remount scanner component khi reset,
  // đảm bảo html5-qrcode có DOM container sạch để hoạt động lại.
  const [scanKey, setScanKey] = useState(0);

  const handleScanSuccess = (decodedText) => {
    setScanResult(decodedText);
  };

  const handleReset = () => {
    setScanResult(null);
    setScanKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-foreground mb-2 flex items-center gap-2 text-3xl font-bold">
          <ScanLine className="text-primary h-8 w-8" />
          Đọc Mã QR & Barcode
        </h1>
        <p className="text-muted-foreground">
          Giải mã nội dung QR Code và mã vạch nhanh chóng, bảo mật — toàn bộ xử
          lý trực tiếp trên trình duyệt.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ── Cột trái: Scanner ───────────────────────────── */}
        <div className="flex w-full flex-col gap-4 lg:col-span-7">
          <Card className="bg-card border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Chọn loại mã cần quét
              </CardTitle>
              <CardDescription>
                Quét QR Code hoặc mã vạch (Barcode) bằng camera hoặc tải ảnh lên
                từ máy tính.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v);
                  setScanResult(null);
                }}
                className="w-full"
              >
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="qr" className="gap-2">
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="barcode" className="gap-2">
                    <Barcode className="h-4 w-4" />
                    Barcode
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="qr"
                  className="mt-0 focus-visible:outline-none"
                >
                  <QrScanner
                    key={`qr-${scanKey}`}
                    onScanSuccess={handleScanSuccess}
                    isActive={activeTab === "qr"}
                  />
                </TabsContent>

                <TabsContent
                  value="barcode"
                  className="mt-0 focus-visible:outline-none"
                >
                  <BarcodeScanner
                    key={`barcode-${scanKey}`}
                    onScanSuccess={handleScanSuccess}
                    isActive={activeTab === "barcode"}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* ── Kết quả inline ── */}
          {scanResult && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
              <ScanResult result={scanResult} onReset={handleReset} />
            </div>
          )}
        </div>

        {/* ── Cột phải: Hướng dẫn & mẹo ────────────────── */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="bg-card border shadow-sm">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2 font-semibold">
                Mẹo Quét QR Code & Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  1
                </div>
                <p>
                  <strong>Đủ ánh sáng:</strong> Đảm bảo môi trường xung quanh đủ
                  sáng và camera không bị che khuất khi quét trực tiếp.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  2
                </div>
                <p>
                  <strong>Độ nét và góc chụp:</strong> Giữ camera vuông góc và
                  cách mã QR khoảng 10–20cm để lấy nét tốt nhất.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  3
                </div>
                <p>
                  <strong>Ảnh tải lên:</strong> Chọn ảnh rõ nét, không bị mờ hay
                  méo để thuật toán giải mã chính xác hơn.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
