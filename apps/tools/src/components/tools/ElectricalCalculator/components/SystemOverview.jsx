import React, { useState, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layers,
  Plus,
  Trash2,
  Cable,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { APPLIANCE_DATABASE, WIRE_SIZES } from "../utils/constants";
import { selectCB, selectWire } from "../utils/calculations";

// Tái sử dụng logic sụt áp từ VoltageDropCalculator
import {
  calculateVoltageDrop,
  evaluateStatus,
} from "../../VoltageDropCalculator/utils/calculations";

let itemIdCounter = 1;

const QUICK_LOAD_OPTIONS = [
  { label: "— Chọn nhanh —", value: "" },
  ...APPLIANCE_DATABASE.map((a) => ({
    label: `${a.icon} ${a.name} (${a.watts}W)`,
    value: a.id,
  })),
  { label: "⚡ Tải tự nhập", value: "custom" },
];

export default function SystemOverview() {
  const [systemVoltage, setSystemVoltage] = useState(220);
  const [cableLength, setCableLength] = useState(30);
  const [wireMaterial, setWireMaterial] = useState("Cu");
  const [items, setItems] = useState([]);

  // Thêm thiết bị
  const addItem = useCallback((sourceId) => {
    if (!sourceId) return;

    if (sourceId === "custom") {
      setItems((prev) => [
        ...prev,
        {
          id: itemIdCounter++,
          name: "Thiết bị tùy chỉnh",
          watts: 500,
          qty: 1,
          cosPhi: 0.85,
        },
      ]);
      return;
    }

    const appliance = APPLIANCE_DATABASE.find((a) => a.id === sourceId);
    if (appliance) {
      setItems((prev) => [
        ...prev,
        {
          id: itemIdCounter++,
          name: appliance.name,
          watts: appliance.watts || 500,
          qty: 1,
          cosPhi: appliance.cosPhi,
        },
      ]);
    }
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }, []);

  // ===== Tính toán tổng hợp =====
  const results = useMemo(() => {
    const V = Number(systemVoltage) || 220;
    let totalWatts = 0;
    let totalApparent = 0;

    const detail = items.map((item) => {
      const w = (Number(item.watts) || 0) * (Number(item.qty) || 1);
      const pf = Number(item.cosPhi) || 0.85;
      const s = pf > 0 ? w / pf : w;
      totalWatts += w;
      totalApparent += s;
      return { ...item, totalW: w, totalVA: s };
    });

    const avgPF = totalApparent > 0 ? totalWatts / totalApparent : 0.85;
    const totalCurrent = totalWatts > 0 ? totalWatts / (V * avgPF) : 0;

    const mainCB = selectCB(totalCurrent, 1.25);
    const mainWire = selectWire(totalCurrent, 1.25);

    return {
      detail,
      totalWatts,
      totalApparent,
      avgPF,
      totalCurrent,
      mainCB,
      mainWire,
    };
  }, [items, systemVoltage]);

  // ===== Tính sụt áp =====
  const voltageDropResult = useMemo(() => {
    if (results.totalCurrent <= 0) return null;

    const rho = wireMaterial === "Cu" ? 0.0225 : 0.036; // 75°C

    const vdCalc = calculateVoltageDrop({
      systemType: "1-phase",
      voltage: systemVoltage,
      inputMode: "I",
      current: results.totalCurrent,
      power: 0,
      powerFactor: results.avgPF,
      activeRho: rho,
      activeWireSize: results.mainWire.size,
      length: Number(cableLength) || 0,
      includeReactance: false,
      reactanceVal: 0,
    });

    const status = evaluateStatus(vdCalc.deltaU_percent);

    return { ...vdCalc, status };
  }, [results, systemVoltage, cableLength, wireMaterial]);

  return (
    <div className="space-y-6">
      {/* Config nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Label className="text-xs">Điện áp nguồn (V)</Label>
            <Input
              type="number"
              value={systemVoltage}
              onChange={(e) => setSystemVoltage(Number(e.target.value))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Label className="text-xs">Chiều dài dây (m)</Label>
            <Input
              type="number"
              value={cableLength}
              onChange={(e) => setCableLength(Number(e.target.value))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Label className="text-xs">Vật liệu dây</Label>
            <Select value={wireMaterial} onValueChange={setWireMaterial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cu">Đồng (Cu)</SelectItem>
                <SelectItem value="Al">Nhôm (Al)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Label className="text-xs">Thêm thiết bị</Label>
            <Select value="" onValueChange={addItem}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thiết bị..." />
              </SelectTrigger>
              <SelectContent>
                {QUICK_LOAD_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value || "empty"}
                    value={opt.value}
                    disabled={!opt.value}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Bảng thiết bị */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Danh Sách Thiết Bị Hệ Thống
              </CardTitle>
              <CardDescription>
                Thêm tất cả các thiết bị tiêu thụ điện để tính toán tổng hợp
              </CardDescription>
            </div>
            <Button
              onClick={() => addItem("custom")}
              size="sm"
              className="gap-1"
            >
              <Plus className="w-4 h-4" /> Thêm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có thiết bị nào. Thêm thiết bị ở trên để bắt đầu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40">Tên thiết bị</TableHead>
                    <TableHead className="text-right">W/cái</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">cosφ</TableHead>
                    <TableHead className="text-right">Tổng (W)</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const totalW =
                      (Number(item.watts) || 0) * (Number(item.qty) || 1);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.watts}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "watts",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 text-sm text-right w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(item.id, "qty", Number(e.target.value))
                            }
                            className="h-8 text-sm text-right w-16"
                            min={1}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.cosPhi}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "cosPhi",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 text-sm text-right w-16"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {totalW.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kết quả tổng hợp */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tổng công suất
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-foreground">
                  {(results.totalWatts / 1000).toFixed(2)}{" "}
                  <span className="text-sm">kW</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tổng dòng điện
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-orange-500">
                  {results.totalCurrent.toFixed(1)}{" "}
                  <span className="text-sm">A</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  CB Tổng
                </Label>
                <div className="mt-2">
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {results.mainCB} A
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Dây trục chính
                </Label>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 bg-background"
                  >
                    {results.mainWire.size} mm²
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kết quả sụt áp */}
          {voltageDropResult && (
            <Card className={`border ${voltageDropResult.status.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cable className="w-5 h-5" />
                  Phân Tích Sụt Áp Đường Dây
                </CardTitle>
                <CardDescription>
                  Dây {wireMaterial === "Cu" ? "đồng" : "nhôm"}{" "}
                  {results.mainWire.size}mm², chiều dài {cableLength}m
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-background border">
                    <Label className="text-xs text-muted-foreground">
                      Sụt áp (ΔU)
                    </Label>
                    <div className="font-mono text-xl font-bold">
                      {voltageDropResult.deltaU.toFixed(2)} V
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <Label className="text-xs text-muted-foreground">
                      Tỷ lệ sụt áp
                    </Label>
                    <div className="font-mono text-xl font-bold">
                      {voltageDropResult.deltaU_percent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <Label className="text-xs text-muted-foreground">
                      Điện áp cuối dây
                    </Label>
                    <div className="font-mono text-xl font-bold">
                      {voltageDropResult.uEnd.toFixed(1)} V
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <Label className="text-xs text-muted-foreground">
                      Hiệu suất truyền tải
                    </Label>
                    <div className="font-mono text-xl font-bold">
                      {voltageDropResult.efficiency.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`p-3 rounded-lg border flex items-start gap-3 ${voltageDropResult.status.color}`}
                >
                  {voltageDropResult.deltaU_percent <= 3 ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : voltageDropResult.deltaU_percent <= 5 ? (
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">
                      {voltageDropResult.status.label}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {voltageDropResult.status.desc}
                    </p>
                  </div>
                </div>

                {/* Gợi ý nâng cấp dây nếu sụt áp lớn */}
                {voltageDropResult.recommendedWireSize && (
                  <div className="mt-4 p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      💡 Gợi ý: Nâng tiết diện dây lên{" "}
                      <strong>
                        {voltageDropResult.recommendedWireSize} mm²
                      </strong>{" "}
                      sẽ giảm sụt áp xuống còn{" "}
                      <strong>
                        {voltageDropResult.recommendedDeltaUPercent.toFixed(2)}%
                      </strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
