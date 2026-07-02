import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AnalogScaling() {
  const [rawMin, setRawMin] = useState(4);
  const [rawMax, setRawMax] = useState(20);
  const [engMin, setEngMin] = useState(0);
  const [engMax, setEngMax] = useState(100);
  const [inputValue, setInputValue] = useState(12);

  const calculateResult = () => {
    if (rawMax === rawMin) return 0;
    const res = ((inputValue - rawMin) * (engMax - engMin)) / (rawMax - rawMin) + Number(engMin);
    return res.toFixed(2);
  };

  return (
    <Card className="max-w-lg bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Thông số đầu vào (mA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Raw Input */}
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>Min (mA):</Label>
            <Input 
              type="number" 
              value={rawMin} 
              onChange={(e) => setRawMin(Number(e.target.value))} 
              className="w-24"
            />
          </div>
          <div className="space-y-2">
            <Label>Max (mA):</Label>
            <Input 
              type="number" 
              value={rawMax} 
              onChange={(e) => setRawMax(Number(e.target.value))} 
              className="w-24"
            />
          </div>
        </div>

        {/* Engineering Value */}
        <div>
          <h3 className="text-lg font-bold mb-3">Dải giá trị thực tế (Engineering)</h3>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Min:</Label>
              <Input 
                type="number" 
                value={engMin} 
                onChange={(e) => setEngMin(Number(e.target.value))} 
                className="w-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Max:</Label>
              <Input 
                type="number" 
                value={engMax} 
                onChange={(e) => setEngMax(Number(e.target.value))} 
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Current Input */}
        <div>
          <h3 className="text-lg font-bold mb-3">Giá trị hiện tại (mA)</h3>
          <Input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(Number(e.target.value))} 
            className="w-32"
          />
        </div>

        {/* Result */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
          <strong className="text-primary">Kết quả thực tế: </strong>
          <span className="text-xl font-bold text-primary">{calculateResult()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
