import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  Camera, Upload, Barcode, ScanLine } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

// Import sub-components
import CameraScanner from "./components/CameraScanner";
import ImageScanner from "./components/ImageScanner";
import BarcodeScanner from "./components/BarcodeScanner";
import ScanResult from "./components/ScanResult";

export default function QrCodeScanner() {
  const [activeTab, setActiveTab] = useState("camera");
  const [scanResult, setScanResult] = useState(null);

  // Xử lý khi quét thành công — kết quả hiện inline phía dưới, scanner vẫn giữ nguyên
  const handleScanSuccess = (decodedText) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("AudioContext không được hỗ trợ hoặc bị chặn:", e);
    }

    setScanResult(decodedText);
    toast.success("Quét thành công!");
  };

  // Xoá kết quả — scanner vẫn giữ nguyên, sẵn sàng quét tiếp
  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-foreground mb-2 flex items-center gap-2 text-3xl font-bold">
          <ScanLine className="text-primary h-8 w-8" />
          Đọc Mã QR & Barcode
        </h1>
        <p className="text-muted-foreground">
          Giải mã nội dung QR Code và mã vạch nhanh chóng, bảo mật — toàn bộ
          xử lý trực tiếp trên trình duyệt, không gửi dữ liệu lên máy chủ.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ── Cột trái: Scanner ───────────────────────────── */}
        <div className="flex w-full flex-col gap-4 lg:col-span-7">
          {/* Card Scanner */}
          <Card className="bg-card border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Chọn phương thức quét
              </CardTitle>
              <CardDescription>
                Quét QR Code hoặc mã vạch (Barcode) bằng camera hoặc tải ảnh
                lên từ máy tính.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v);
                  // Xoá kết quả cũ khi chuyển tab
                  setScanResult(null);
                }}
                className="w-full"
              >
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="camera" className="gap-1.5 text-xs sm:text-sm">
                    <Camera className="h-3.5 w-3.5" />
                    Camera QR
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-1.5 text-xs sm:text-sm">
                    <Upload className="h-3.5 w-3.5" />
                    Ảnh QR
                  </TabsTrigger>
                  <TabsTrigger value="barcode" className="gap-1.5 text-xs sm:text-sm">
                    <Barcode className="h-3.5 w-3.5" />
                    Barcode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="camera" className="mt-0 focus-visible:outline-none">
                  <CameraScanner
                    onScanSuccess={handleScanSuccess}
                    isActive={activeTab === "camera"}
                  />
                </TabsContent>

                <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
                  <ImageScanner
                    onScanSuccess={handleScanSuccess}
                    isActive={activeTab === "upload"}
                  />
                </TabsContent>

                <TabsContent value="barcode" className="mt-0 focus-visible:outline-none">
                  <BarcodeScanner
                    onScanSuccess={handleScanSuccess}
                    isActive={activeTab === "barcode"}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* ── Kết quả inline: slide-down khi có kết quả ── */}
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
                  <strong>Đủ ánh sáng:</strong> Hãy đảm bảo môi trường xung
                  quanh đủ sáng và camera không bị che khuất khi quét trực tiếp.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  2
                </div>
                <p>
                  <strong>Độ nét và góc chụp:</strong> Giữ camera vuông góc và
                  cách mã QR khoảng 10–20cm để lấy nét tốt nhất. Tránh rung tay.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  3
                </div>
                <p>
                  <strong>Độ phân giải ảnh tải lên:</strong> Khi tải ảnh lên,
                  hãy chọn các bức ảnh rõ nét, không bị mờ hay méo mó để thuật
                  toán giải mã chính xác hơn.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium">
                  4
                </div>
                <p>
                  <strong>An toàn & Bảo mật:</strong> Toàn bộ quá trình quét và
                  đọc mã đều diễn ra trực tiếp trên trình duyệt (Client-side),
                  dữ liệu không bao giờ được gửi lên máy chủ.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
