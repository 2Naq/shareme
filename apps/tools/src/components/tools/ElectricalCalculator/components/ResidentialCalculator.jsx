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
import { Slider } from "@/components/ui/slider";
import { Home, Plus, Minus, Snowflake } from "lucide-react";
import { APPLIANCE_DATABASE, LOAD_GROUPS } from "../utils/constants";
import { calculateResidentialLoad, suggestACUnit } from "../utils/calculations";

export default function ResidentialCalculator() {
  // State: danh sách thiết bị với số lượng
  const [appliances, setAppliances] = useState(() =>
    APPLIANCE_DATABASE.map((a) => ({ ...a, qty: 0, acArea: 15 })),
  );
  const [demandFactor, setDemandFactor] = useState(0.7);

  const updateQty = useCallback((id, delta) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, qty: Math.max(0, a.qty + delta) } : a,
      ),
    );
  }, []);

  const updateACArea = useCallback((id, area) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acArea: Number(area) || 0 } : a)),
    );
  }, []);

  // Cập nhật công suất máy lạnh theo diện tích phòng
  const processedAppliances = useMemo(() => {
    return appliances.map((a) => {
      if (a.id === "ac" && a.qty > 0) {
        const ac = suggestACUnit(a.acArea);
        return { ...a, watts: ac.watts, acSuggestion: ac };
      }
      return a;
    });
  }, [appliances]);

  const results = useMemo(() => {
    return calculateResidentialLoad(processedAppliances, demandFactor);
  }, [processedAppliances, demandFactor]);

  const activeAppliances = processedAppliances.filter((a) => a.qty > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Danh sách thiết bị */}
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            Thiết Bị Trong Nhà
          </CardTitle>
          <CardDescription>
            Chọn số lượng thiết bị sử dụng để tính toán phụ tải dân dụng.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {processedAppliances.map((appliance) => (
            <div key={appliance.id}>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{appliance.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {appliance.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appliance.id === "ac" && appliance.qty > 0
                        ? `${appliance.acSuggestion?.label || "—"}`
                        : `${appliance.watts}W — cosφ ${appliance.cosPhi}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQty(appliance.id, -1)}
                    disabled={appliance.qty <= 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-mono font-bold text-sm">
                    {appliance.qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQty(appliance.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Chọn diện tích phòng cho máy lạnh */}
              {appliance.id === "ac" && appliance.qty > 0 && (
                <div className="ml-10 mt-2 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    <Snowflake className="w-4 h-4" />
                    Cấu hình máy lạnh
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      Diện tích phòng: {appliance.acArea} m²
                    </Label>
                    <Slider
                      value={[appliance.acArea]}
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        updateACArea(appliance.id, val);
                      }}
                      min={5}
                      max={80}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 m²</span>
                      <span>80 m²</span>
                    </div>
                  </div>
                  {appliance.acSuggestion && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-background border">
                        <span className="text-muted-foreground">BTU:</span>{" "}
                        <strong>
                          {appliance.acSuggestion.btu.toLocaleString()}
                        </strong>
                      </div>
                      <div className="p-2 rounded bg-background border">
                        <span className="text-muted-foreground">HP:</span>{" "}
                        <strong>{appliance.acSuggestion.hp}</strong>
                      </div>
                      <div className="p-2 rounded bg-background border col-span-2">
                        <span className="text-muted-foreground">
                          Công suất điện:
                        </span>{" "}
                        <strong>{appliance.acSuggestion.watts} W</strong> / máy
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Hệ số đồng thời */}
          <div className="pt-4 border-t space-y-2">
            <Label className="text-sm">
              Hệ số đồng thời (Demand Factor):{" "}
              <strong>{(demandFactor * 100).toFixed(0)}%</strong>
            </Label>
            <Slider
              value={[demandFactor * 100]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                setDemandFactor(val / 100);
              }}
              min={30}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Hệ số phần trăm thiết bị hoạt động đồng thời. Mặc định 70% là hợp
              lý cho hộ gia đình.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kết quả */}
      <div className="lg:col-span-5 space-y-6">
        {/* Tổng hợp */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Tổng Hợp Phụ Tải</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tổng P (tải)
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-foreground">
                  {(results.totalWatts / 1000).toFixed(2)}{" "}
                  <span className="text-sm">kW</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  P tính toán (×{(demandFactor * 100).toFixed(0)}%)
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-primary">
                  {(results.demandWatts / 1000).toFixed(2)}{" "}
                  <span className="text-sm">kW</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tổng dòng I
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-orange-500">
                  {results.totalCurrent.toFixed(1)}{" "}
                  <span className="text-sm">A</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  cosφ trung bình
                </Label>
                <div className="mt-1 font-mono text-2xl font-black text-foreground">
                  {results.weightedPF.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CB tổng + dây trục */}
        <Card>
          <CardHeader>
            <CardTitle>Đề Xuất CB Tổng & Dây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/30">
              <span className="text-sm text-muted-foreground">CB Tổng</span>
              <Badge variant="default" className="text-sm px-3 py-1">
                {results.mainCB} A
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/30">
              <span className="text-sm text-muted-foreground">
                Dây trục chính (Cu/PVC)
              </span>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 bg-background"
              >
                {results.mainWire.size} mm²
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Phân nhánh theo nhóm */}
        {results.branchDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Phân Nhánh CB Theo Nhóm</CardTitle>
              <CardDescription>
                Gợi ý CB nhánh và dây cho từng nhóm thiết bị
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhóm</TableHead>
                      <TableHead className="text-right">Công suất</TableHead>
                      <TableHead className="text-right">CB</TableHead>
                      <TableHead className="text-right">Dây</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.branchDetails.map((branch) => (
                      <TableRow key={branch.groupId}>
                        <TableCell>
                          <span
                            className={
                              LOAD_GROUPS[branch.groupId]?.color ||
                              "text-foreground"
                            }
                          >
                            {LOAD_GROUPS[branch.groupId]?.label ||
                              branch.groupId}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {(branch.watts / 1000).toFixed(2)} kW
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {branch.cb} A
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="text-xs bg-background"
                          >
                            {branch.wire.size} mm²
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chi tiết thiết bị đã chọn */}
        {activeAppliances.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Chi Tiết Thiết Bị Đã Chọn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead className="text-center">SL</TableHead>
                      <TableHead className="text-right">Đơn (W)</TableHead>
                      <TableHead className="text-right">Tổng (W)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeAppliances.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm">
                          {a.icon} {a.name}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {a.qty}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {a.watts}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {(a.watts * a.qty).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeAppliances.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Chọn thiết bị ở bên trái để bắt đầu tính toán</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
