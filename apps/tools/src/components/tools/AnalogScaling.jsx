import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import MathRendererBlock from "../MathRenderer";

const AnalogInput = ({ className, label, value, onChange }) => {
  return (
    <div className={cn("flex-1 space-y-2", className)}>
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};

export default function AnalogScaling() {
  const [rawMin, setRawMin] = useState(4);
  const [rawMax, setRawMax] = useState(20);
  const [engMin, setEngMin] = useState(0);
  const [engMax, setEngMax] = useState(100);
  const [inputValue, setInputValue] = useState(12);

  const isValidRaw = rawMin < rawMax;
  const isValidEng = engMin < engMax;

  const calculateResult = () => {
    if (!isValidRaw || !isValidEng) return "??? Ní ơi!";
    if (rawMax === rawMin) return 0;
    const res =
      ((inputValue - rawMin) * (engMax - engMin)) / (rawMax - rawMin) +
      Number(engMin);
    return res.toFixed(2);
  };

  return (
    <Card className="bg-card mx-auto">
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-4 sm:col-span-2">
            {/* Raw Input */}
            <div>
              <h3 className="mb-3 text-lg font-bold">Thông số đầu vào (mA)</h3>
              <div className="flex gap-4">
                <AnalogInput
                  label="Min (mA):"
                  value={rawMin}
                  onChange={setRawMin}
                />
                <AnalogInput
                  label="Max (mA):"
                  value={rawMax}
                  onChange={setRawMax}
                />
              </div>
              {!isValidRaw && (
                <p className="text-destructive mt-2 text-sm">
                  {" "}
                  {"Ní ơi! Min < Max"}{" "}
                </p>
              )}
            </div>

            {/* Engineering Value */}
            <div>
              <h3 className="mb-3 text-lg font-bold">
                Dải giá trị thực tế (Engineering)
              </h3>
              <div className="flex gap-4">
                <AnalogInput label="Min:" value={engMin} onChange={setEngMin} />
                <AnalogInput label="Max:" value={engMax} onChange={setEngMax} />
              </div>
              {!isValidEng && (
                <p className="text-destructive mt-2 text-sm">
                  {" "}
                  {"Ní ơi! Min < Max"}{" "}
                </p>
              )}
            </div>

            {/* Current Input */}
            <div>
              <h3 className="mb-3 text-lg font-bold">Giá trị hiện tại (mA)</h3>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
              />
            </div>
          </div>
          {/* Result */}
          <div className="bg-grid flex flex-col items-center justify-center rounded-lg border bg-white/10 p-4">
            <MathRendererBlock
              formula={`\\frac{(${inputValue} - ${rawMin}) \\times (${engMax} - ${engMin})}{${rawMax} - ${rawMin}} + ${engMin}`}
            />
            <div>
              <strong className="text-primary">Kết quả: </strong>
              <span className="text-primary text-xl font-bold">
                {calculateResult()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
