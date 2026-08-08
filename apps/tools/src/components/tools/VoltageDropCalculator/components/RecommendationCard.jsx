import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function RecommendationCard({ calculations, activeWireSize }) {
  const {
    recommendedWireSize,
    deltaU_percent,
    recommendedDeltaU,
    recommendedDeltaUPercent,
  } = calculations;

  if (!recommendedWireSize) return null;

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          Đề xuất khắc phục
        </CardTitle>
        <CardDescription className="text-emerald-600/80 dark:text-emerald-400/80">
          Tính toán để giảm độ sụt áp xuống dưới ngưỡng an toàn 3%.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
        <p>
          Tiết diện hiện tại <strong>{activeWireSize} mm²</strong> gây sụt áp
          quá lớn (<strong>{deltaU_percent.toFixed(2)}%</strong>).
        </p>
        <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
          <div className="flex items-center justify-between">
            <span>Khuyên dùng tiết diện tối thiểu:</span>
            <Badge
              variant="default"
              className="bg-emerald-600 px-3 py-0.5 text-sm text-white hover:bg-emerald-700"
            >
              {recommendedWireSize} mm²
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs opacity-95">
            <span>Sụt áp khi tăng cỡ dây:</span>
            <span className="font-mono font-semibold">
              {recommendedDeltaU.toFixed(1)} V (
              {recommendedDeltaUPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs italic opacity-75">
          * Khuyến nghị chỉ dựa trên khía cạnh độ sụt áp. Ní cần đối chiếu với
          dòng định mức cho phép của cáp (Ampacity) trong catalog nhà sản xuất
          nhé.
        </p>
      </CardContent>
    </Card>
  );
}
