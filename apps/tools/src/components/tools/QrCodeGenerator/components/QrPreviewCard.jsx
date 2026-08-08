import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

export default function QrPreviewCard({
  qrRef,
  fileName,
  setFileName,
  downloadSize,
  setDownloadSize,
  downloadFormat,
  setDownloadFormat,
  handleDownload,
}) {
  return (
    <div className="space-y-6 lg:sticky lg:top-8 lg:col-span-5">
      <Card className="bg-card overflow-hidden shadow">
        <div className="bg-muted/40 flex items-center justify-between border-b p-4">
          <span className="text-sm font-semibold">Xem Trước Mã QR</span>
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-500">
            Real-time
          </span>
        </div>

        <CardContent className="flex flex-col items-center justify-center space-y-6 p-6">
          {/* QR Code Container */}
          <div className="border-muted/50 flex min-h-75 min-w-75 items-center justify-center rounded-xl border bg-white p-4 shadow-lg transition-all dark:bg-zinc-900">
            <div ref={qrRef} className="h-70 w-70" />
          </div>

          {/* Form Tải Về */}
          <div className="w-full space-y-4 border-t pt-3">
            {/* Tên file */}
            <div className="space-y-1.5">
              <Label htmlFor="file-name" className="text-xs">
                Tên tệp khi tải về:
              </Label>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="shareme-qrcode"
                className="h-9"
              />
            </div>

            {/* Tùy chọn Kích thước xuất bản */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Kích thước tải (px):</Label>
                <Select
                  value={String(downloadSize)}
                  onValueChange={(val) => setDownloadSize(Number(val))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">256 x 256 px</SelectItem>
                    <SelectItem value="512">512 x 512 px (Chuẩn)</SelectItem>
                    <SelectItem value="1024">1024 x 1024 px (HD)</SelectItem>
                    <SelectItem value="2048">2048 x 2048 px (In ấn)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Định dạng file:</Label>
                <Select
                  value={downloadFormat}
                  onValueChange={setDownloadFormat}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Khuyên dùng)</SelectItem>
                    <SelectItem value="svg">SVG (File Vector)</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Các nút Hành động */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <Button
                onClick={handleDownload}
                className="h-10 w-full gap-2 font-medium"
              >
                <Download className="h-4 w-4" />
                Tải Mã QR Về Máy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips quét mã an toàn */}
      <div className="space-y-1 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-xs text-yellow-600 dark:text-yellow-400">
        <p className="font-bold">⚠️ Mẹo Quét QR An Toàn:</p>
        <p>
          1. Nếu chèn Logo lớn, vui lòng chọn dải màu có độ tương phản cao với
          nền (ví dụ: nền trắng, chấm xanh đậm) để camera điện thoại dễ nhận
          diện.
        </p>
        <p>
          2. Khi tải file Vector (SVG), bạn có thể phóng to vô hạn mà không bị
          vỡ hình, cực kỳ phù hợp khi thiết kế in ấn bao bì, tờ rơi hoặc
          standee.
        </p>
      </div>
    </div>
  );
}
