import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function RS2NotesCard() {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Info className="h-4 w-4 shrink-0" />
          Ghi chú kỹ thuật quan trọng cho lệnh RS2
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="flex gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">*1.</span>
          <span>
            Trong lệnh <strong>RS2</strong>, có thể thiết lập tối đa <strong>4 header</strong> và tối đa <strong>4 terminator</strong>.
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">*2.</span>
          <span>
            Tuyến điều khiển (Control line) không khả dụng trên dòng PLC <strong>FX3G, FX3GC</strong> khi dùng cổng <strong>ch0</strong>. Trường hợp này đặt mặc định là <code>(1, 1, 1)</code>.
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">*3.</span>
          <span>
            Đảm bảo đặt <strong>Bit 14 = 0</strong> khi sử dụng truyền thông không giao thức (Non-protocol communication).
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">*4.</span>
          <span>
            Khi dùng truyền thông non-protocol với lệnh RS2 và bật <strong>Sum check (Bit 13 = 1)</strong>, mã kiểm tra sẽ được thêm vào sau Terminator. <strong>Bắt buộc phải bật Terminator (Bit 9 = 1)</strong> khi thêm Sum check.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
