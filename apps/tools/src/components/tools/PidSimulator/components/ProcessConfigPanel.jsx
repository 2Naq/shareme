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
import { MathRenderInline } from "@/components/MathRenderer";

/**
 * Panel cấu hình đối tượng điều khiển FOPDT & mô phỏng.
 */
export default function ProcessConfigPanel({ config, onChange }) {
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

  const fields = [
    {
      key: "sp",
      label: "Setpoint (SP)",
      min: 0,
      max: 500,
      step: 1,
      desc: "Giá trị đặt mong muốn",
    },
    {
      key: "kProcess",
      label: "Hệ số khuếch đại đối tượng (K)",
      min: 0.1,
      max: 5,
      step: 0.1,
      desc: "Process Gain – tỉ lệ thay đổi PV/MV",
    },
    {
      key: "tauProcess",
      label: "Hằng số thời gian (τ) giây",
      min: 0.5,
      max: 120,
      step: 0.5,
      desc: "Time constant – quán tính đối tượng",
    },
    {
      key: "deadTime",
      label: "Thời gian trễ (Td) giây",
      min: 0,
      max: 30,
      step: 0.5,
      desc: "Dead Time – trễ vận chuyển",
    },
    {
      key: "simTime",
      label: "Thời gian mô phỏng (s)",
      min: 10,
      max: 300,
      step: 5,
      desc: "Tổng thời gian chạy mô phỏng",
    },
    {
      key: "noiseAmplitude",
      label: "Biên độ nhiễu (%)",
      min: 0,
      max: 10,
      step: 0.1,
      desc: "Nhiễu cảm biến thêm vào PV",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Đối tượng & Mô phỏng</CardTitle>
        <CardDescription>
          {/* Mô hình FOPDT: G(s) = K / (τs + 1) × e⁻ᵀᵈˢ */}
          <MathRenderInline
            text={String.raw`Mô hình FOPDT: $G(s) = \frac{K}{τs + 1} \times e^{-Tds}$`}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{f.label}</Label>
              <Input
                type="number"
                value={config[f.key]}
                onChange={handleInput(f.key)}
                step={f.step}
                min={f.min}
                max={f.max}
                className="h-8 w-24 text-right text-sm"
              />
            </div>
            <Slider
              value={[config[f.key]]}
              onValueChange={handleSlider(f.key)}
              min={f.min}
              max={f.max}
              step={f.step}
            />
            <p className="text-muted-foreground text-xs">{f.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
