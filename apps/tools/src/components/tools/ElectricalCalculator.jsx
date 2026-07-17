import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MathRenderer from "@/components/MathRenderer";

const SYSTEM_OPTIONS = [
  { label: "Điện 1 Pha AC (220V)", value: "1-phase" },
  { label: "Điện 3 Pha AC (380V)", value: "3-phase" },
  { label: "Điện Một Chiều (DC)", value: "DC" },
];

const TARGET_OPTIONS = [
  { label: "Dòng Điện (I)", value: "I" },
  { label: "Công Suất (P)", value: "P" },
  { label: "Điện Áp (U)", value: "U" },
];

const CB_SIZES = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500,
  630, 800, 1000, 1250, 1600,
];

const WIRE_SIZES = [
  { size: 1.5, maxI: 16 },
  { size: 2.5, maxI: 25 },
  { size: 4.0, maxI: 32 },
  { size: 6.0, maxI: 40 },
  { size: 10, maxI: 63 },
  { size: 16, maxI: 80 },
  { size: 25, maxI: 100 },
  { size: 35, maxI: 125 },
  { size: 50, maxI: 160 },
  { size: 70, maxI: 200 },
  { size: 95, maxI: 250 },
  { size: 120, maxI: 300 },
  { size: 150, maxI: 350 },
  { size: 185, maxI: 400 },
  { size: 240, maxI: 500 },
  { size: 300, maxI: 600 },
];

export default function ElectricalCalculator() {
  const [systemType, setSystemType] = useState("3-phase");
  const [calcTarget, setCalcTarget] = useState("I");

  const [voltage, setVoltage] = useState(380);
  const [current, setCurrent] = useState(10);
  const [power, setPower] = useState(5.5); // kW
  const [powerFactor, setPowerFactor] = useState(0.8);

  const { resultI, resultP, resultU, formula, cbSuggested, wireSuggested } =
    useMemo(() => {
      let resI = 0,
        resP = 0,
        resU = 0;
      let currentFormula = "";

      const U = Number(voltage) || 0;
      const I = Number(current) || 0;
      const P = Number(power) * 1000 || 0; // Chuyển kW sang W
      const PF = Number(powerFactor) || 1;
      const sqrt3 = Math.sqrt(3); // Căn 3
      // Công thức
      if (calcTarget === "I") {
        if (systemType === "DC") {
          resI = U > 0 ? P / U : 0;
          currentFormula = "I = \\frac{P}{U}";
        } else if (systemType === "1-phase") {
          resI = U * PF > 0 ? P / (U * PF) : 0;
          currentFormula = "I = \\frac{P}{U \\cdot \\cos\\varphi}";
        } else if (systemType === "3-phase") {
          resI = sqrt3 * U * PF > 0 ? P / (sqrt3 * U * PF) : 0;
          currentFormula =
            "I = \\frac{P}{\\sqrt{3} \\cdot U \\cdot \\cos\\varphi}";
        }
      } else if (calcTarget === "P") {
        if (systemType === "DC") {
          resP = U * I;
          currentFormula = "P = U \\cdot I";
        } else if (systemType === "1-phase") {
          resP = U * I * PF;
          currentFormula = "P = U \\cdot I \\cdot \\cos\\varphi";
        } else if (systemType === "3-phase") {
          resP = sqrt3 * U * I * PF;
          currentFormula =
            "P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi";
        }
      } else if (calcTarget === "U") {
        if (systemType === "DC") {
          resU = I > 0 ? P / I : 0;
          currentFormula = "U = \\frac{P}{I}";
        } else if (systemType === "1-phase") {
          resU = I * PF > 0 ? P / (I * PF) : 0;
          currentFormula = "U = \\frac{P}{I \\cdot \\cos\\varphi}";
        } else if (systemType === "3-phase") {
          resU = sqrt3 * I * PF > 0 ? P / (sqrt3 * I * PF) : 0;
          currentFormula =
            "U = \\frac{P}{\\sqrt{3} \\cdot I \\cdot \\cos\\varphi}";
        }
      }

      // Chọn thiết bị dựa trên dòng điện (I)
      let calculatedI = calcTarget === "I" ? resI : I;

      // Gợi ý CB: Dòng CB thường bằng 1.25 -> 1.5 lần dòng định mức tải
      let targetCb = calculatedI * 1.25;
      let selectedCb =
        CB_SIZES.find((size) => size >= targetCb) ||
        CB_SIZES[CB_SIZES.length - 1];

      // Gợi ý dây dẫn
      let selectedWire =
        WIRE_SIZES.find((wire) => wire.maxI >= targetCb) ||
        WIRE_SIZES[WIRE_SIZES.length - 1];

      return {
        resultI: resI.toFixed(2),
        resultP: (resP / 1000).toFixed(2), // Chuyển lại thành kW
        resultU: resU.toFixed(2),
        formula: currentFormula,
        cbSuggested: selectedCb,
        wireSuggested: selectedWire.size,
      };
    }, [systemType, calcTarget, voltage, current, power, powerFactor]);

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Toán Thông Số Điện
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán công suất, dòng điện, điện áp và gợi ý chọn thiết bị
          CB, dây dẫn...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông số hệ thống</CardTitle>
            <CardDescription>
              Nhập các thông số cần thiết để tính toán.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Hệ thống điện</Label>
                <Select
                  value={systemType}
                  onValueChange={(val) => {
                    setSystemType(val);
                    if (val === "1-phase" && voltage !== 220) setVoltage(220);
                    if (val === "3-phase" && voltage !== 380) setVoltage(380);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn hệ thống" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Đại lượng cần tính</Label>
                <Select value={calcTarget} onValueChange={setCalcTarget}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn đại lượng">
                      {calcTarget
                        ? `${
                            TARGET_OPTIONS.find((opt) => {
                              console.log(opt);
                              return opt.value === calcTarget;
                            }).label
                          }`
                        : "Chọn đại lượng"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {calcTarget !== "U" && (
                <div className="space-y-2">
                  <Label>Điện áp (V)</Label>
                  <Input
                    type="number"
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    placeholder="VD: 380"
                  />
                </div>
              )}

              {calcTarget !== "P" && (
                <div className="space-y-2">
                  <Label>Công suất (kW)</Label>
                  <Input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="VD: 5.5"
                  />
                </div>
              )}

              {calcTarget !== "I" && (
                <div className="space-y-2">
                  <Label>Dòng điện (A)</Label>
                  <Input
                    type="number"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    placeholder="VD: 10.5"
                  />
                </div>
              )}

              {systemType !== "DC" && (
                <div className="space-y-2">
                  <Label>Hệ số công suất (cosφ)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={powerFactor}
                    onChange={(e) => setPowerFactor(e.target.value)}
                    placeholder="VD: 0.8"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Kết Quả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-xs text-primary uppercase tracking-wider">
                  Công thức áp dụng
                </Label>
                <div className="mt-2 p-2 bg-background rounded border flex justify-center overflow-x-auto min-h-[60px] items-center bg-grid">
                  <MathRenderer formula={formula} />
                </div>
              </div>

              <div>
                <Label className="text-xs text-primary uppercase tracking-wider">
                  {TARGET_OPTIONS.find((o) => o.value === calcTarget)?.label}
                </Label>
                <div className="mt-1 font-mono text-4xl font-black text-primary">
                  {calcTarget === "I" && (
                    <>
                      {resultI} <span className="text-2xl">A</span>
                    </>
                  )}
                  {calcTarget === "P" && (
                    <>
                      {resultP} <span className="text-2xl">kW</span>
                    </>
                  )}
                  {calcTarget === "U" && (
                    <>
                      {resultU} <span className="text-2xl">V</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đề Xuất Thiết Bị</CardTitle>
              <CardDescription>
                Tham khảo chọn CB và cáp điện (Cu/PVC)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">CB / Aptomat:</span>
                <Badge variant="default" className="text-sm px-3 py-1">
                  {cbSuggested} A
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">
                  Tiết diện dây dẫn:
                </span>
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 bg-background"
                >
                  {wireSuggested} mm²
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Lưu ý: Tiết diện dây và định mức CB tính toán ở mức cơ bản
                (~125% In). Thực tế cần đối chiếu với điều kiện môi trường và
                phương pháp lắp đặt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
