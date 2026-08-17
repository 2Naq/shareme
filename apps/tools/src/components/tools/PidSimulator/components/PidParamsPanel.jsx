import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

/**
 * Panel nhập các tham số Kp, Ki, Kd với Slider + Input.
 */
export default function PidParamsPanel({ kp, ki, kd, onChange }) {
  const handleSlider = (key) => (v) => {
    const val = Array.isArray(v) ? v[0] : v;
    if (typeof val === "number" && !isNaN(val)) {
      onChange(key, parseFloat(val.toFixed(4)));
    }
  };

  const handleInput = (key) => (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(key, val);
    }
  };

  const params = [
    {
      key: "kp",
      label: "Kp (Proportional)",
      value: kp,
      min: 0,
      max: 50,
      step: 0.1,
      desc: "Hệ số khuếch đại tỷ lệ",
      color: "text-blue-500",
    },
    {
      key: "ki",
      label: "Ki (Integral)",
      value: ki,
      min: 0,
      max: 10,
      step: 0.01,
      desc: "Hệ số tích phân (xoá sai số tĩnh)",
      color: "text-green-500",
    },
    {
      key: "kd",
      label: "Kd (Derivative)",
      value: kd,
      min: 0,
      max: 50,
      step: 0.1,
      desc: "Hệ số vi phân (giảm vọt lố)",
      color: "text-orange-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Tham số PID</CardTitle>
        <CardDescription>Chỉnh Kp, Ki, Kd để quan sát đáp ứng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {params.map((p) => (
          <div key={p.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className={`font-semibold ${p.color}`}>{p.label}</Label>
              <Input
                type="number"
                value={p.value}
                onChange={handleInput(p.key)}
                step={p.step}
                min={p.min}
                max={p.max}
                className="h-8 w-24 text-right text-sm"
              />
            </div>
            <Slider
              value={[p.value]}
              onValueChange={handleSlider(p.key, p.max)}
              min={p.min}
              max={p.max}
              step={p.step}
            />
            <p className="text-muted-foreground text-xs">{p.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
