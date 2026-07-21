import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Camera, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Import sub-components
import CameraScanner from "./components/CameraScanner";
import ImageScanner from "./components/ImageScanner";
import ScanResult from "./components/ScanResult";

export default function QrCodeScanner() {
  const [activeTab, setActiveTab] = useState("camera");
  const [scanResult, setScanResult] = useState(null);

  // Xử lý khi quét thành công
  const handleScanSuccess = (decodedText) => {
    // Phát âm thanh beep ngắn (tùy chọn, tạo trải nghiệm chuyên nghiệp)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("AudioContext không được hỗ trợ hoặc bị chặn:", e);
    }

    setScanResult(decodedText);
    toast.success("Đã quét thành công mã QR!");
  };

  // Reset để quét mã mới
  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <QrCode className="w-8 h-8 text-primary" />
          Đọc Mã QR Code
        </h1>
        <p className="text-muted-foreground">
          Giải mã nội dung QR Code nhanh chóng và bảo mật. Hỗ trợ quét trực tiếp qua camera thiết bị hoặc tải ảnh lên từ máy tính.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vùng hiển thị Scanner */}
        <div className="lg:col-span-7 w-full">
          {scanResult ? (
            <ScanResult result={scanResult} onReset={handleReset} />
          ) : (
            <Card className="border shadow-md bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Chọn phương thức quét</CardTitle>
                <CardDescription>
                  Sử dụng camera của thiết bị hoặc tải lên hình ảnh có chứa mã QR.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="camera" className="gap-2">
                      <Camera className="w-4 h-4" />
                      Quét bằng Camera
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Tải ảnh lên
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="camera" className="mt-0 focus-visible:outline-none">
                    <CameraScanner 
                      onScanSuccess={handleScanSuccess} 
                      isActive={activeTab === "camera" && !scanResult} 
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
                    <ImageScanner 
                      onScanSuccess={handleScanSuccess} 
                      isActive={activeTab === "upload" && !scanResult} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hướng dẫn sử dụng & Mẹo */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-md font-semibold flex items-center gap-2">
                Mẹo Quét QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">1</div>
                <p>
                  <strong>Đủ ánh sáng:</strong> Hãy đảm bảo môi trường xung quanh đủ sáng và camera không bị che khuất khi quét trực tiếp.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">2</div>
                <p>
                  <strong>Độ nét và góc chụp:</strong> Giữ camera vuông góc và cách mã QR khoảng 10 - 20cm để lấy nét tốt nhất. Tránh rung tay.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">3</div>
                <p>
                  <strong>Độ phân giải ảnh tải lên:</strong> Khi tải ảnh lên, hãy chọn các bức ảnh rõ nét, không bị mờ hay méo mó để thuật toán giải mã chính xác hơn.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">4</div>
                <p>
                  <strong>An toàn & Bảo mật:</strong> Toàn bộ quá trình quét và đọc mã QR đều diễn ra trực tiếp trên trình duyệt của bạn (Client-side), dữ liệu không bao giờ được gửi lên máy chủ.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
