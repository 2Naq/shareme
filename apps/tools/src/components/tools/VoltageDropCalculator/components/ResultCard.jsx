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
    <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Gauge className="w-24 h-24 text-primary" />
      </div>

      <CardHeader>
        <CardTitle className="text-primary text-xl flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Kết quả đo sụt áp
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Tỉ lệ sụt áp chính */}
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
              Độ sụt áp sấp xỉ
            </span>
            <div className="font-mono text-4xl font-black text-primary mt-1">
              {deltaU.toFixed(2)} <span className="text-xl">V</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
              Tỷ lệ sụt áp %
            </span>
            <div
              className={`font-mono text-3xl font-black mt-1 ${
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
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{
                width: `${Math.min(deltaU_percent, 3) * (100 / 5)}%`,
              }}
            />
            {deltaU_percent > 3 && (
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(deltaU_percent - 3, 2) * (100 / 5)}%`,
                }}
              />
            )}
            {deltaU_percent > 5 && (
              <div className="bg-red-500 h-full flex-1 transition-all duration-300" />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-0.5 font-mono">
            <span>0%</span>
            <span>Tối ưu (3%)</span>
            <span>Tối đa (5%)</span>
          </div>
        </div>

        {/* Trạng thái đánh giá */}
        <div
          className={`p-3 rounded-lg border flex gap-3 items-start ${statusEvaluation.color}`}
        >
          {StatusIcon && <StatusIcon className="size-5 shrink-0 mt-0.5" />}
          <div>
            <div className="font-bold text-sm leading-none mb-1">
              {statusEvaluation.label}
            </div>
            <div className="text-xs opacity-90 leading-relaxed">
              {statusEvaluation.desc}
            </div>
          </div>
        </div>

        {/* Chi tiết phụ tải nhận được */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
          <div>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              Điện áp tại phụ tải {MathRenderInline("$U_{tải}$")}
            </span>
            <span className="font-mono font-bold text-foreground text-base">
              {uEnd.toFixed(1)} V
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs items-center flex gap-1">
              Dòng điện tải {MathRenderInline("$I_{tải}$")}
            </span>
            <span className="font-mono font-bold text-foreground text-base">
              {loadCurrent.toFixed(2)} A
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block">
              Hao tổn công suất (ΔP)
            </span>
            <span className="font-mono font-bold text-rose-500 text-base">
              {deltaP > 1000
                ? `${(deltaP / 1000).toFixed(3)} kW`
                : `${deltaP.toFixed(1)} W`}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block">
              Hao tổn công suất (%)
            </span>
            <span className="font-mono font-bold text-rose-500 text-base">
              {deltaP_percent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Hiệu suất truyền tải */}
        <div className="p-3 rounded-xl bg-background border flex justify-between items-center">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">
              Hiệu suất truyền tải đường dây
            </span>
            <span className="font-bold text-foreground text-sm">
              Tỷ lệ công suất hữu ích
            </span>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-lg py-1 px-3 bg-primary/5 text-primary border-primary/20"
          >
            {efficiency.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
