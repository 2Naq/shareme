import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge } from "lucide-react";
import { MathRenderInline } from "@/components/MathRenderer";

export default function ResultCard({ calculations, statusEvaluation }) {
  const {
    deltaU,
    deltaU_percent,
    uEnd,
    loadCurrent,
    deltaP,
    deltaP_percent,
    efficiency,
  } = calculations;

  const StatusIcon = statusEvaluation.icon;

  return (
    <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Gauge className="text-primary h-24 w-24" />
      </div>

      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2 text-xl">
          <Gauge className="h-5 w-5" />
          Kết quả đo sụt áp
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Tỉ lệ sụt áp chính */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Độ sụt áp sấp xỉ
            </span>
            <div className="text-primary mt-1 font-mono text-4xl font-black">
              {deltaU.toFixed(2)} <span className="text-xl">V</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Tỷ lệ sụt áp %
            </span>
            <div
              className={`mt-1 font-mono text-3xl font-black ${
                deltaU_percent > 5
                  ? "text-red-500"
                  : deltaU_percent > 3
                    ? "text-amber-500"
                    : "text-green-600 dark:text-green-400"
              }`}
            >
              {deltaU_percent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Tiến trình trực quan của phần trạng thái sụt áp */}
        <div className="space-y-1">
          <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${Math.min(deltaU_percent, 3) * (100 / 5)}%`,
              }}
            />
            {deltaU_percent > 3 && (
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{
                  width: `${Math.min(deltaU_percent - 3, 2) * (100 / 5)}%`,
                }}
              />
            )}
            {deltaU_percent > 5 && (
              <div className="h-full flex-1 bg-red-500 transition-all duration-300" />
            )}
          </div>
          <div className="text-muted-foreground flex justify-between px-0.5 font-mono text-[10px] font-semibold">
            <span>0%</span>
            <span>Tối ưu (3%)</span>
            <span>Tối đa (5%)</span>
          </div>
        </div>

        {/* Trạng thái đánh giá */}
        <div
          className={`flex items-start gap-3 rounded-lg border p-3 ${statusEvaluation.color}`}
        >
          {StatusIcon && <StatusIcon className="mt-0.5 size-5 shrink-0" />}
          <div>
            <div className="mb-1 text-sm leading-none font-bold">
              {statusEvaluation.label}
            </div>
            <div className="text-xs leading-relaxed opacity-90">
              {statusEvaluation.desc}
            </div>
          </div>
        </div>

        {/* Chi tiết phụ tải nhận được */}
        <div className="grid grid-cols-2 gap-4 border-t pt-2 text-sm">
          <div>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              Điện áp tại phụ tải {MathRenderInline("$U_{tải}$")}
            </span>
            <span className="text-foreground font-mono text-base font-bold">
              {uEnd.toFixed(1)} V
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              Dòng điện tải {MathRenderInline("$I_{tải}$")}
            </span>
            <span className="text-foreground font-mono text-base font-bold">
              {loadCurrent.toFixed(2)} A
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">
              Hao tổn công suất (ΔP)
            </span>
            <span className="font-mono text-base font-bold text-rose-500">
              {deltaP > 1000
                ? `${(deltaP / 1000).toFixed(3)} kW`
                : `${deltaP.toFixed(1)} W`}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">
              Hao tổn công suất (%)
            </span>
            <span className="font-mono text-base font-bold text-rose-500">
              {deltaP_percent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Hiệu suất truyền tải */}
        <div className="bg-background flex items-center justify-between rounded-xl border p-3">
          <div>
            <span className="text-muted-foreground block text-xs font-medium">
              Hiệu suất truyền tải đường dây
            </span>
            <span className="text-foreground text-sm font-bold">
              Tỷ lệ công suất hữu ích
            </span>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 px-3 py-1 font-mono text-lg"
          >
            {efficiency.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
