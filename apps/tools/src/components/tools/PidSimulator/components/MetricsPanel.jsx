import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  Activity,
} from "lucide-react";

/**
 * Panel hiển thị các chỉ số hiệu suất PID.
 */
export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  const items = [
    {
      icon: Clock,
      label: "Rise Time (10→90%)",
      value: `${metrics.riseTime} s`,
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Overshoot",
      value: `${metrics.overshoot} %`,
      color:
        metrics.overshoot > 20
          ? "text-red-500"
          : metrics.overshoot > 10
            ? "text-amber-500"
            : "text-green-500",
      badge:
        metrics.overshoot > 20
          ? "destructive"
          : metrics.overshoot > 10
            ? "outline"
            : "secondary",
      badgeText:
        metrics.overshoot > 20
          ? "Cao"
          : metrics.overshoot > 10
            ? "Trung bình"
            : "Tốt",
    },
    {
      icon: Target,
      label: "Settling Time (±2%)",
      value: `${metrics.settlingTime} s`,
      color: "text-purple-500",
    },
    {
      icon: AlertTriangle,
      label: "Sai số xác lập",
      value: metrics.steadyStateError.toFixed(2),
      color: metrics.steadyStateError > 1 ? "text-red-500" : "text-green-500",
    },
    {
      icon: Activity,
      label: "IAE (Tích phân sai số)",
      value: metrics.iae.toFixed(1),
      color: "text-indigo-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Chỉ số Hiệu suất</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-muted/40 flex flex-col items-center gap-1.5 rounded-lg p-3 text-center"
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <p className="text-muted-foreground text-[11px] leading-tight">
                  {item.label}
                </p>
                <p className={`text-lg font-bold ${item.color}`}>
                  {item.value}
                </p>
                {item.badge && (
                  <Badge variant={item.badge} className="text-[10px]">
                    {item.badgeText}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
