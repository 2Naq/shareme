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
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Tải ảnh lên (Logo/Image):
          </Label>
          <div className="flex items-center gap-3">
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
                className="flex h-fit! cursor-pointer flex-col items-center justify-center gap-2 p-2 shadow"
                render={
                  <Label htmlFor="logo-upload">
                    <Upload className="h-4 w-4" />
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
          <p className="text-muted-foreground text-xs">
            Hỗ trợ file PNG, JPG có nền trong suốt để hiển thị tốt nhất. Dung
            lượng tối đa 2MB.
          </p>
        </div>

        {logoFile && (
          <div className="space-y-4 border-t pt-3">
            {/* Trực quan hóa xem trước logo */}
            <div className="bg-muted/30 flex items-center gap-3 rounded-lg border p-2.5">
              <img
                src={logoFile}
                alt="Logo Preview"
                className="h-12 w-12 rounded border bg-white object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">
                  Đã nạp hình ảnh logo
                </p>
                <p className="text-muted-foreground text-[10px]">
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
              <Label htmlFor="excavate-logo" className="cursor-pointer text-xs">
                Xóa các điểm ảnh đè dưới Logo (Nên bật để hiển thị rõ)
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
