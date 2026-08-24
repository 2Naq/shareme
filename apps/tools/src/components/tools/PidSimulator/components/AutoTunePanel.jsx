import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";
import { zieglerNicholsFOPDT } from "../utils/pidEngine";

/**
 * Panel gợi ý tham số PID theo Ziegler-Nichols.
 */
export default function AutoTunePanel({
  kProcess,
  tauProcess,
  deadTime,
  onApply,
}) {
  const suggestions = zieglerNicholsFOPDT(kProcess, tauProcess, deadTime);

  if (!suggestions) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wand2 className="h-4 w-4" />
            Auto-Tune (Ziegler-Nichols)
          </CardTitle>
          <CardDescription>
            Cần cài đặt Dead Time (Td) &gt; 0 để tính toán tham số gợi ý.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const presets = [suggestions.pOnly, suggestions.pi, suggestions.pid];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Auto-Tune (Ziegler-Nichols)
        </CardTitle>
        <CardDescription>
          Gợi ý tham số dựa trên mô hình FOPDT: K={kProcess}, τ={tauProcess}s,
          Td={deadTime}s
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {presets.map((preset) => (
            <div
              key={preset.label}
              className="bg-muted/40 flex flex-col gap-2 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono">
                  {preset.label}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => onApply(preset)}
                >
                  Áp dụng
                </Button>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Kp:</span>{" "}
                  <span className="font-semibold text-blue-500">
                    {preset.kp}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Ki:</span>{" "}
                  <span className="font-semibold text-green-500">
                    {preset.ki}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Kd:</span>{" "}
                  <span className="font-semibold text-orange-500">
                    {preset.kd}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
