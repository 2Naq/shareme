import React from "react";
import { AlertTriangle, Layers, Lock, BookOpen } from "lucide-react";

export function DeviceDisclaimer() {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 dark:border-amber-500/30 dark:bg-amber-950/20">
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0 rounded-xl bg-amber-500/15 p-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:mt-2">
            <h3 className="text-foreground text-sm font-semibold sm:text-base">
              Lưu ý kỹ thuật khi tra cứu & áp dụng dữ liệu
            </h3>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] leading-none font-medium text-amber-700 dark:text-amber-300">
              Khuyến cáo
            </span>
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
            Tập lệnh và địa chỉ thanh ghi / cờ đặc biệt (M8000+, D8000+) có thể
            thay đổi tùy thuộc vào model phần cứng và phiên bản firmware. Vui
            lòng lưu ý các điểm quan trọng sau:
          </p>

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
            <div className="bg-card/80 border-border/50 rounded-xl border p-3 shadow-xs">
              <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                <Layers className="text-primary h-4 w-4 shrink-0" />
                <span>Khác biệt thế hệ PLC</span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">
                Các dòng cũ (FX0N, FX1S, FX1N, FX2N) có thể không hỗ trợ một số
                thanh ghi, mở rộng hay truyền thông so với FX3G, FX3U/FX3UC.
                Luôn đối chiếu cột{" "}
                <strong className="text-foreground font-semibold">
                  Dòng PLC hỗ trợ
                </strong>
                .
              </p>
            </div>

            <div className="bg-card/80 border-border/50 rounded-xl border p-3 shadow-xs">
              <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                <Lock className="h-4 w-4 shrink-0 text-amber-500" />
                <span>Thuộc tính Đọc / Ghi</span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">
                Không ghi đè (lệnh OUT/MOV) vào các cờ{" "}
                <strong className="text-foreground font-semibold">
                  Chỉ đọc (R)
                </strong>{" "}
                (như M8000, M8002, M8013...) để tránh xung đột hệ thống. Chỉ can
                thiệp các thiết bị có quyền{" "}
                <strong className="text-foreground font-semibold">R/W</strong>{" "}
                hoặc{" "}
                <strong className="text-foreground font-semibold">W</strong>.
              </p>
            </div>

            <div className="bg-card/80 border-border/50 rounded-xl border p-3 shadow-xs">
              <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                <BookOpen className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Đối chiếu Manual chính thức</span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">
                Dữ liệu trên công cụ mang tính tra cứu nhanh. Luôn kiểm tra lại
                với tài liệu kỹ thuật chính hãng (
                <span className="text-foreground font-semibold italic">
                  Mitsubishi FX Programming Manual
                </span>
                ) và mô phỏng trước khi nạp vào máy thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
