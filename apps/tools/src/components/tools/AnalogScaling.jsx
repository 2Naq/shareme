import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import MathRenderer from "../MathRenderer";

const AnalogInput = ({ className, label, value, onChange }) => {
  return (
    <div className={cn("space-y-2 flex-1", className)}>
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
    <Card className=" mx-auto bg-card ">
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-4">
            {/* Raw Input */}
            <div>
              <h3 className="text-lg font-bold mb-3">Thông số đầu vào (mA)</h3>
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
                <p className="text-sm text-destructive mt-2">
                  {" "}
                  {"Ní ơi! Min < Max"}{" "}
                </p>
              )}
            </div>

            {/* Engineering Value */}
            <div>
              <h3 className="text-lg font-bold mb-3">
                Dải giá trị thực tế (Engineering)
              </h3>
              <div className="flex gap-4">
                <AnalogInput label="Min:" value={engMin} onChange={setEngMin} />
                <AnalogInput label="Max:" value={engMax} onChange={setEngMax} />
              </div>
              {!isValidEng && (
                <p className="text-sm text-destructive mt-2">
                  {" "}
                  {"Ní ơi! Min < Max"}{" "}
                </p>
              )}
            </div>

            {/* Current Input */}
            <div>
              <h3 className="text-lg font-bold mb-3">Giá trị hiện tại (mA)</h3>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
              />
            </div>
          </div>
          {/* Result */}
          <div className="p-4 bg-white/10 border bg-grid rounded-lg flex flex-col items-center justify-center">
            <MathRenderer
              formula={`\\frac{(${inputValue} - ${rawMin}) \\times (${engMax} - ${engMin})}{${rawMax} - ${rawMin}} + ${engMin}`}
            />
            <div>
              <strong className="text-primary">Kết quả: </strong>
              <span className="text-xl font-bold text-primary">
                {calculateResult()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
