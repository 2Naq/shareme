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
        <CardTitle className="text-emerald-700 dark:text-emerald-400 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
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
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex justify-between items-center">
            <span>Khuyên dùng tiết diện tối thiểu:</span>
            <Badge
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-0.5"
            >
              {recommendedWireSize} mm²
            </Badge>
          </div>
          <div className="flex justify-between items-center text-xs opacity-95">
            <span>Sụt áp khi tăng cỡ dây:</span>
            <span className="font-semibold font-mono">
              {recommendedDeltaU.toFixed(1)} V ({recommendedDeltaUPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <p className="text-xs opacity-75 italic mt-1">
          * Khuyến nghị chỉ dựa trên khía cạnh độ sụt áp. Ní cần đối chiếu với dòng định
          mức cho phép của cáp (Ampacity) trong catalog nhà sản xuất nhé.
        </p>
      </CardContent>
    </Card>
  );
}
