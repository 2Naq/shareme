import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2 } from "lucide-react";
import { RenderMathInText } from "@/components/MathRenderer";
import { Button } from "@/components/ui/button";
import {
  SYSTEM_OPTIONS,
  MATERIAL_OPTIONS,
  STANDARD_WIRE_SIZES,
} from "../utils/constants";

export default function ConfigForm({
  systemType,
  onSystemTypeChange,
  voltage,
  setVoltage,
  inputMode,
  setInputMode,
  current,
  setCurrent,
  power,
  setPower,
  powerFactor,
  setPowerFactor,
  wireMaterial,
  setWireMaterial,
  tempOption,
  setTempOption,
  setCustomRho,
  activeRho,
  wireSizeMode,
  setWireSizeMode,
  selectedWireSize,
  setSelectedWireSize,
  customWireSize,
  setCustomWireSize,
  length,
  setLength,
  includeReactance,
  setIncludeReactance,
  reactanceVal,
  setReactanceVal,
}) {
  return (
    <Card className="lg:col-span-7">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Thông số cấu hình
        </CardTitle>
        <CardDescription>
          Nhập các giá trị thông số nguồn điện, dây dẫn và phụ tải.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hệ thống nguồn & Điện áp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hệ thống điện</Label>
            <Select value={systemType} onValueChange={onSystemTypeChange}>
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
            <Label>Điện áp định mức nguồn (V)</Label>
            <Input
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(Math.max(1, Number(e.target.value)))}
              placeholder="VD: 220"
              min="1"
            />
          </div>
        </div>

        {/* Vật liệu cáp & Nhiệt độ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border">
          <div className="space-y-2 flex flex-col justify-between">
            <Label>Vật liệu cáp</Label>
            <Select value={wireMaterial} onValueChange={setWireMaterial}>
              <SelectTrigger className="w-full m-0">
                <SelectValue placeholder="Vật liệu" />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col justify-between">
            <Label>Nhiệt độ làm việc</Label>
            <Select
              value={tempOption}
              onValueChange={setTempOption}
              disabled={wireMaterial === "custom"}
            >
              <SelectTrigger className="w-full m-0">
                <SelectValue placeholder="Nhiệt độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20°C (Tiêu chuẩn)</SelectItem>
                <SelectItem value="75">75°C (Làm việc Max)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col justify-between">
            <Label>Điện trở suất ρ (Ω·mm²/m)</Label>
            <Input
              type="number"
              step="0.0001"
              value={activeRho}
              onChange={(e) => setCustomRho(Number(e.target.value))}
              disabled={wireMaterial !== "custom"}
            />
          </div>
        </div>

        {/* Tiết diện & Chiều dài cáp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Tiết diện dây S (mm²)</Label>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() =>
                  setWireSizeMode((prev) =>
                    prev === "select" ? "custom" : "select",
                  )
                }
              >
                {wireSizeMode === "select" ? "Nhập thủ công" : "Chọn size chuẩn"}
              </Button>
            </div>

            {wireSizeMode === "select" ? (
              <Select
                value={selectedWireSize.toString()}
                onValueChange={(val) => setSelectedWireSize(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kích cỡ" />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_WIRE_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} mm²
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={customWireSize}
                onChange={(e) =>
                  setCustomWireSize(Math.max(0.1, Number(e.target.value)))
                }
                placeholder="VD: 4.5"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Chiều dài đường dây L (mét)</Label>
            <Input
              type="number"
              value={length}
              min="0.1"
              onChange={(e) => setLength(Math.max(0.1, Number(e.target.value)))}
              placeholder="VD: 150"
            />
          </div>
        </div>

        {/* Thông số phụ tải */}
        <div className="border rounded-xl p-4 space-y-4 bg-muted/20">
          <div className="flex items-center justify-between border-b pb-2">
            <Label className="font-semibold text-sm">Thông số phụ tải</Label>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-md text-xs">
              <button
                type="button"
                className={`px-3 py-1 rounded transition-colors ${
                  inputMode === "I"
                    ? "bg-background shadow-xs font-semibold animate-none"
                    : "text-muted-foreground"
                }`}
                onClick={() => setInputMode("I")}
              >
                Theo Dòng điện (I)
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded transition-colors ${
                  inputMode === "P"
                    ? "bg-background shadow-xs font-semibold animate-none"
                    : "text-muted-foreground"
                }`}
                onClick={() => setInputMode("P")}
              >
                Theo Công suất (P)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inputMode === "I" ? (
              <div className="space-y-2">
                <Label>Dòng điện tải I (Ampe)</Label>
                <Input
                  type="number"
                  value={current}
                  onChange={(e) =>
                    setCurrent(Math.max(0, Number(e.target.value)))
                  }
                  placeholder="VD: 16"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Công suất tải P (kW)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={power}
                  onChange={(e) => setPower(Math.max(0, Number(e.target.value)))}
                  placeholder="VD: 5.5"
                />
              </div>
            )}

            {systemType !== "DC" && (
              <div className="space-y-2">
                <Label>Hệ số công suất (cosφ)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1"
                  value={powerFactor}
                  onChange={(e) =>
                    setPowerFactor(
                      Math.max(0.1, Math.min(1, Number(e.target.value))),
                    )
                  }
                  placeholder="VD: 0.85"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tùy chọn cảm kháng bổ sung */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reactance"
              checked={includeReactance}
              onCheckedChange={(checked) => setIncludeReactance(checked === true)}
            />
            <label
              htmlFor="reactance"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              <span className="flex items-center gap-1">
                Bao gồm cảm kháng đường dây {RenderMathInText("$X_L$")}
              </span>
            </label>
          </div>

          {includeReactance && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Điện kháng đơn vị (x) (Ω/m)
                </Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={reactanceVal}
                  onChange={(e) => setReactanceVal(Number(e.target.value))}
                  placeholder="Mặc định: 0.00008"
                />
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                Cảm kháng mặc định thông thường của cáp là 0.08 Ω/km (0.00008
                Ω/m). Thường chỉ ảnh hưởng rõ rệt khi cáp lớn và chiều dài rất xa.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
