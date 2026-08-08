import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MathRendererBlock, { MathRenderInline } from "@/components/MathRenderer";
import { Cog, ShieldCheck, Gauge, Zap, CircleQuestionMark } from "lucide-react";
import { START_METHODS } from "../utils/constants";
import { calculateMotorParams } from "../utils/calculations";

const VOLTAGE_OPTIONS = [
  { label: "380V (3 Pha)", value: 380 },
  { label: "220V (1 Pha)", value: 220 },
  { label: "440V (3 Pha)", value: 440 },
  { label: "660V (3 Pha)", value: 660 },
];

export default function MotorCalculator() {
  const [powerKW, setPowerKW] = useState(5.5);
  const [powerUnit, setPowerUnit] = useState("kW"); // kW hoặc HP
  const [voltage, setVoltage] = useState(380);
  const [cosPhi, setCosPhi] = useState(0.85);
  const [eta, setEta] = useState(0.88);
  const [startMethod, setStartMethod] = useState("DOL");

  // Chuyển đổi HP → kW nếu cần
  const effectiveKW = useMemo(() => {
    if (powerUnit === "HP") return Number(powerKW) * 0.746;
    return Number(powerKW);
  }, [powerKW, powerUnit]);

  const selectedStart = START_METHODS.find((m) => m.value === startMethod);

  const results = useMemo(() => {
    return calculateMotorParams({
      powerKW: effectiveKW,
      voltage,
      cosPhi,
      eta,
      startMethod,
      startMethodFactor: selectedStart?.factor || 1,
    });
  }, [effectiveKW, voltage, cosPhi, eta, startMethod, selectedStart]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* INPUT */}
      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="text-primary h-5 w-5" />
            Thông số Motor
          </CardTitle>
          <CardDescription>
            Nhập thông số động cơ để tính toán dòng điện, thiết bị bảo vệ và gợi
            ý biến tần.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Công suất + đơn vị */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label>Công suất</Label>
              <Input
                type="number"
                step="0.1"
                value={powerKW}
                onChange={(e) => setPowerKW(e.target.value)}
                placeholder="VD: 5.5"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn vị</Label>
              <Select value={powerUnit} onValueChange={setPowerUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kW">kW</SelectItem>
                  <SelectItem value="HP">HP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Điện áp */}
          <div className="space-y-2">
            <Label>Điện áp (V)</Label>
            <Select
              value={String(voltage)}
              onValueChange={(v) => setVoltage(Number(v))}
            >
              <SelectTrigger>
                <SelectValue>
                  {voltage
                    ? VOLTAGE_OPTIONS.find((opt) => opt.value === voltage)
                        ?.label
                    : "Chọn điện áp"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VOLTAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* cosφ & η */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Hệ số cosφ</Label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={cosPhi}
                onChange={(e) => setCosPhi(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hiệu suất η</Label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              />
            </div>
          </div>

          {/* Phương pháp khởi động */}
          <div className="space-y-2">
            <Label>Phương pháp khởi động</Label>
            <Select value={startMethod} onValueChange={setStartMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {START_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motor gần nhất */}
          <div className="bg-muted/50 space-y-1 rounded-lg p-3 text-sm">
            <div className="flex flex-row items-center gap-1">
              <p className="text-foreground font-medium">
                Motor tiêu chuẩn gần nhất:
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Thông số được tham khảo từ các motor có mặt trên thị trường
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground">
              {results.motorData.kW} kW ({results.motorData.hp} HP) <br /> I
              <sub>đm(catalog)</sub> = {results.motorData.I_dm}A,
              <br />
              cosφ = {results.motorData.cosPhi},
              <br />η = {results.motorData.eta}
            </p>
          </div>
          <div className="bg-muted/50 space-y-1 rounded-lg p-3 text-sm">
            <p className="text-foreground font-medium">
              {powerUnit === "kW"
                ? "Công thức quy đổi kW -> HP:"
                : "Công thức quy đổi HP -> kW:"}
            </p>
            <p className="text-muted-foreground">
              {powerUnit === "kW" ? (
                <MathRenderInline
                  text={String.raw`$${powerKW}\text{ kW} \div 0.746 \approx ${(Number(powerKW) / 0.746).toFixed(2)}\text{ HP}$`}
                />
              ) : (
                <MathRenderInline
                  text={String.raw`$${powerKW}\text{ HP} \times 0.746 \approx ${(Number(powerKW) * 0.746).toFixed(2)}\text{ kW}$`}
                />
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* OUTPUT */}
      <div className="space-y-6 lg:col-span-7">
        {/* Kết quả chính */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Kết Quả Tính Toán
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Công thức */}
            <div>
              <Label className="text-primary text-xs tracking-wider uppercase">
                Công thức
              </Label>
              <div className="bg-background bg-grid mt-2 flex min-h-12 items-center justify-center rounded border p-3">
                <MathRendererBlock
                  className="overflow-x-auto sm:overflow-x-hidden"
                  formula={results.formula}
                />
              </div>
            </div>

            {/* Dòng định mức */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg border p-3">
                <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                  Dòng định mức
                  <MathRenderInline text={`$I_{đm}$`} />
                </Label>
                <div className="text-primary mt-1 font-mono text-3xl font-black">
                  {results.I_dm.toFixed(2)}{" "}
                  <span className="text-lg font-semibold">A</span>
                </div>
              </div>
              <div className="bg-background rounded-lg border p-3">
                <div className="text-muted-foreground text-xs tracking-wider uppercase">
                  Dòng khởi động <MathRenderInline text={`$I_{kđ}$`} />
                </div>
                <div className="mt-1 font-mono text-3xl font-black text-orange-500">
                  {results.I_start.toFixed(1)}{" "}
                  <span className="text-lg font-semibold">A</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  DOL: {results.I_start_DOL.toFixed(1)}A (×
                  {results.startMultiplier})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Đề xuất thiết bị bảo vệ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Đề Xuất Thiết Bị Bảo Vệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground text-sm">CB / MCCB</span>
                <Badge variant="default" className="px-3 py-1 text-sm">
                  {results.suggestedCB} A
                </Badge>
              </div>
              <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground text-sm">
                  Cáp Cu/PVC
                </span>
                <Badge
                  variant="outline"
                  className="bg-background px-3 py-1 text-sm"
                >
                  {results.suggestedWire.size} mm²
                </Badge>
              </div>
              <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground text-sm">
                  Relay nhiệt
                </span>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {results.suggestedRelay.range} A
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bảng gợi ý biến tần */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-500" />
              Gợi Ý Biến Tần (VFD)
            </CardTitle>
            <CardDescription>
              Thông số tham khảo cho biến tần điều khiển motor{" "}
              {effectiveKW.toFixed(1)} kW
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông số</TableHead>
                    <TableHead className="text-right">Giá trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Công suất VFD khuyến nghị
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default">
                        {results.vfdSuggestion.vfdKW} kW
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Dòng định mức VFD
                    </TableCell>
                    <TableCell className="text-right">
                      {results.vfdSuggestion.vfdI} A
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Thời gian tăng tốc (Acc)
                    </TableCell>
                    <TableCell className="text-right">
                      {results.vfdSuggestion.accTime} s
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Thời gian giảm tốc (Dec)
                    </TableCell>
                    <TableCell className="text-right">
                      {results.vfdSuggestion.decTime} s
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-muted-foreground pt-4 pb-2 text-xs font-semibold tracking-wider uppercase"
                    >
                      Thông Số Bảo Vệ
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bảo vệ quá tải (OL)</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.overloadPercent}% /{" "}
                      {results.vfdProtection.overloadTime}s
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quá dòng tức thời (OC)</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.overCurrentPercent}% I<sub>đm</sub>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quá áp / Thấp áp</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.overVoltagePercent}% /{" "}
                      {results.vfdProtection.underVoltagePercent}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tần số (Min – Max)</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.minFreq} Hz –{" "}
                      {results.vfdProtection.maxFreq} Hz
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Số vòng quay (Min – Max)</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.minRPM} –{" "}
                      {results.vfdProtection.maxRPM} RPM
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tần số sóng mang (PWM)</TableCell>
                    <TableCell className="text-right">
                      {results.vfdProtection.carrierFreq} kHz
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              * Các thông số trên là giá trị tham khảo mặc định. Thực tế cần
              điều chỉnh theo hướng dẫn của nhà sản xuất biến tần và đặc tính
              tải cụ thể.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
