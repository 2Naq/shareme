import React, { useState, useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Brush } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useChartZoomPan } from "@/hooks/use-chart-zoom-pan";

const chartConfig = {
  sp: { label: "Setpoint (SP)", color: "#ef4444" },
  pv: { label: "Process Value (PV)", color: "#3b82f6" },
  mv: { label: "Output (MV %)", color: "#f97316" },
};

/**
 * Biểu đồ đáp ứng PID: SP, PV, MV theo thời gian.
 * Sử dụng hook dùng chung `useChartZoomPan` để Zoom In/Out & Drag Pan.
 */
export default function ResponseChart({ data, showMV = true }) {
  const [showBrush, setShowBrush] = useState(true);

  // Thời gian min/max
  const minTime = data.length > 0 ? data[0].time : 0;
  const maxTime = data.length > 0 ? data[data.length - 1].time : 60;

  // Sử dụng custom hook dùng chung
  const {
    left,
    right,
    isZoomed,
    isDragging,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    handlers,
  } = useChartZoomPan({ minDomain: minTime, maxDomain: maxTime });

  // Giảm điểm dữ liệu nếu quá lớn
  const displayData = useMemo(() => {
    const maxPoints = 600;
    const step = Math.max(1, Math.floor(data.length / maxPoints));
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Biểu đồ Đáp ứng PID</CardTitle>

        {/* Thanh công cụ Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            title="Phóng to (Zoom In)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            title="Thu nhỏ (Zoom Out)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          {isZoomed && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={resetZoom}
              title="Reset Zoom về ban đầu"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          <Button
            variant={showBrush ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowBrush(!showBrush)}
            title="Ẩn/Hiện thanh cuộn Brush"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={containerRef}
          className={`relative select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          {...handlers}
        >
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[380px] w-full"
          >
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/30"
              />
              <XAxis
                dataKey="time"
                domain={[left, right]}
                type="number"
                allowDataOverflow
                tickFormatter={(v) => `${v}s`}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                domain={["auto", "auto"]}
              />
              {showMV && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                  domain={[0, 110]}
                  tickFormatter={(v) => `${v}%`}
                />
              )}
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => `Thời gian: ${v}s`}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />

              {/* Các đường biểu đồ */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sp"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="Setpoint (SP)"
                isAnimationActive={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pv"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Process Value (PV)"
                isAnimationActive={false}
              />
              {showMV && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mv"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={false}
                  name="Output (MV %)"
                  opacity={0.7}
                  isAnimationActive={false}
                />
              )}

              {/* Thanh cuộn Brush */}
              {showBrush && (
                <Brush
                  dataKey="time"
                  height={26}
                  stroke="#3b82f6"
                  fill="var(--color-card, #fff)"
                  tickFormatter={(v) => `${v}s`}
                />
              )}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
