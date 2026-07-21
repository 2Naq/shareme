import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

export default function QrLogoSettings({
  logoFile,
  handleLogoUpload,
  handleResetLogo,
  logoSize,
  setLogoSize,
  logoMargin,
  setLogoMargin,
  excavateLogo,
  setExcavateLogo,
}) {
  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Tải ảnh lên (Logo/Image):
          </Label>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                nativeButton={false}
                variant="outline"
                className="cursor-pointer gap-2 flex flex-col items-center justify-center h-fit! p-2 shadow"
                render={
                  <Label htmlFor="logo-upload">
                    <Upload className="w-4 h-4" />
                    Chọn Ảnh Từ Máy
                  </Label>
                }
              ></Button>
            </div>
            {logoFile && (
              <Button variant="destructive" size="sm" onClick={handleResetLogo}>
                Xóa Logo
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Hỗ trợ file PNG, JPG có nền trong suốt để hiển thị tốt nhất. Dung
            lượng tối đa 2MB.
          </p>
        </div>

        {logoFile && (
          <div className="space-y-4 pt-3 border-t">
            {/* Trực quan hóa xem trước logo */}
            <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg border">
              <img
                src={logoFile}
                alt="Logo Preview"
                className="w-12 h-12 rounded object-contain bg-white border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">
                  Đã nạp hình ảnh logo
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Sẵn sàng kết xuất trên QR
                </p>
              </div>
            </div>

            {/* Tùy chỉnh kích thước Logo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <Label>Kích thước Logo: {(logoSize * 100).toFixed(0)}%</Label>
                <span className="text-muted-foreground text-[10px]">
                  (Khuyên dùng: 20% - 30%)
                </span>
              </div>
              <Slider
                min={0.15}
                max={0.4} // Giới hạn max 40% để tránh hỏng mã QR
                step={0.01}
                value={[logoSize]}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  if (typeof val === "number" && !isNaN(val)) {
                    setLogoSize(val);
                  }
                }}
              />
            </div>

            {/* Tùy chỉnh khoảng giãn cách quanh Logo (Margin) */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Khoảng đệm trống xung quanh Logo: {logoMargin} px
              </Label>
              <Slider
                min={0}
                max={12}
                step={1}
                value={[logoMargin]}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  if (typeof val === "number" && !isNaN(val)) {
                    setLogoMargin(val);
                  }
                }}
              />
            </div>

            {/* Tránh đè lên chấm nền */}
            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="excavate-logo"
                checked={excavateLogo}
                onCheckedChange={setExcavateLogo}
              />
              <Label htmlFor="excavate-logo" className="text-xs cursor-pointer">
                Xóa các điểm ảnh đè dưới Logo (Nên bật để hiển thị rõ)
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
