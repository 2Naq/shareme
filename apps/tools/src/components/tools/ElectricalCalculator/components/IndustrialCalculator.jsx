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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MathRendererBlock from "@/components/MathRenderer";
import { Factory, Plus, Trash2, Zap } from "lucide-react";
import {
  SYSTEM_OPTIONS,
  TARGET_OPTIONS,
  INDUSTRIAL_LOAD_TYPES,
} from "../utils/constants";
import {
  calculateBasicElectrical,
  calculateIndustrialLoad,
  selectCB,
  selectWire,
} from "../utils/calculations";

// Bộ đếm ID đơn giản
let nextLoadId = 1;

export default function IndustrialCalculator() {
  // ----- Phần 1: Tính toán cơ bản (giữ nguyên logic cũ) -----
  const [systemType, setSystemType] = useState("3-phase");
  const [calcTarget, setCalcTarget] = useState("I");
  const [voltage, setVoltage] = useState(380);
  const [current, setCurrent] = useState(10);
  const [power, setPower] = useState(5.5);
  const [powerFactor, setPowerFactor] = useState(0.8);

  const basicResult = useMemo(() => {
    return calculateBasicElectrical({
      systemType,
      calcTarget,
      voltage,
      current,
      power,
      powerFactor,
    });
  }, [systemType, calcTarget, voltage, current, power, powerFactor]);

  // ----- Phần 2: Bảng phụ tải công nghiệp -----
  const [loads, setLoads] = useState([
    {
      id: nextLoadId++,
      name: "Động cơ bơm nước",
      powerKW: 7.5,
      qty: 2,
      loadType: "motor",
      cosPhi: 0.85,
      demandFactor: 0.7,
    },
    {
      id: nextLoadId++,
      name: "Chiếu sáng xưởng",
      powerKW: 3,
      qty: 1,
      loadType: "lighting",
      cosPhi: 0.95,
      demandFactor: 0.9,
    },
  ]);

  const addLoad = () => {
    setLoads((prev) => [
      ...prev,
      {
        id: nextLoadId++,
        name: "Tải mới",
        powerKW: 1,
        qty: 1,
        loadType: "mixed",
        cosPhi: 0.8,
        demandFactor: 0.6,
      },
    ]);
  };

  const removeLoad = (id) => {
    setLoads((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLoad = (id, field, value) => {
    setLoads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        // Tự động cập nhật cosφ và demand factor khi đổi loại phụ tải
        if (field === "loadType") {
          const type = INDUSTRIAL_LOAD_TYPES.find((t) => t.value === value);
          if (type) {
            updated.cosPhi = type.cosPhi;
            updated.demandFactor = type.demandFactor;
          }
        }
        return updated;
      }),
    );
  };

  const industrialResult = useMemo(() => {
    return calculateIndustrialLoad(loads);
  }, [loads]);

  return (
    <div className="space-y-8">
      {/* ===== PHẦN 1: TÍNH TOÁN CƠ BẢN ===== */}
      <div>
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
          <Zap className="text-primary h-5 w-5" />
          Tính Toán Thông Số Cơ Bản
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông số hệ thống</CardTitle>
              <CardDescription>
                Nhập các thông số cần thiết để tính toán.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      <SelectValue placeholder="Chọn đại lượng" />
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-primary text-xs tracking-wider uppercase">
                    Công thức áp dụng
                  </Label>
                  <div className="bg-background bg-grid mt-2 flex min-h-15 items-center justify-center overflow-x-auto rounded border p-2">
                    <MathRendererBlock formula={basicResult.formula} />
                  </div>
                </div>
                <div>
                  <Label className="text-primary text-xs tracking-wider uppercase">
                    {TARGET_OPTIONS.find((o) => o.value === calcTarget)?.label}
                  </Label>
                  <div className="text-primary mt-1 font-mono text-4xl font-black">
                    {calcTarget === "I" && (
                      <>
                        {basicResult.resultI}{" "}
                        <span className="text-2xl">A</span>
                      </>
                    )}
                    {calcTarget === "P" && (
                      <>
                        {basicResult.resultP}{" "}
                        <span className="text-2xl">kW</span>
                      </>
                    )}
                    {calcTarget === "U" && (
                      <>
                        {basicResult.resultU}{" "}
                        <span className="text-2xl">V</span>
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
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">CB / Aptomat:</span>
                  <Badge variant="default" className="px-3 py-1 text-sm">
                    {basicResult.cbSuggested} A
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    Tiết diện dây dẫn:
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-background px-3 py-1 text-sm"
                  >
                    {basicResult.wireSuggested} mm²
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  * <strong>Lưu ý</strong>: Tiết diện dây và định mức CB tính
                  toán ở mức cơ bản (~125% In). Thực tế cần đối chiếu với điều
                  kiện môi trường và phương pháp lắp đặt.
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  * <strong>Mẹo tính nhanh tại hiện trường </strong>: <br />-
                  Đối với lưới điện 3 pha 380V tiêu chuẩn, ní có thể lấy công
                  suất định mức (kW) x2 = i<sub>đm</sub> (A) xấp xỉ. <br />- Ví
                  dụ: động cơ 11(kW) i<sub>đm</sub> = 22 A. <br />- Mẹo này
                  chính xác tới 90% đối với các động cơ thông dụng từ 4 kW đến
                  110 kW..
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== PHẦN 2: BẢNG PHỤ TẢI CÔNG NGHIỆP ===== */}
      <div>
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
          <Factory className="text-primary h-5 w-5" />
          Bảng Tổng Hợp Phụ Tải Công Nghiệp
        </h2>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh Sách Phụ Tải</CardTitle>
                <CardDescription>
                  Thêm các phụ tải trong hệ thống điện công nghiệp
                </CardDescription>
              </div>
              <Button onClick={addLoad} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Thêm tải
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-37.5">Tên phụ tải</TableHead>
                    <TableHead className="min-w-25">Loại</TableHead>
                    <TableHead className="text-right">P (kW)</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">cosφ</TableHead>
                    <TableHead className="text-right">
                      K<sub>đt</sub>
                    </TableHead>
                    <TableHead className="text-right">Tổng (kW)</TableHead>
                    <TableHead className="text-right">
                      P<sub>tt</sub> (kW)
                    </TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loads.map((load) => {
                    const totalP =
                      (Number(load.powerKW) || 0) * (Number(load.qty) || 1);
                    const demandP = totalP * (Number(load.demandFactor) || 0.7);
                    return (
                      <TableRow key={load.id}>
                        <TableCell>
                          <Input
                            value={load.name}
                            onChange={(e) =>
                              updateLoad(load.id, "name", e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={load.loadType}
                            onValueChange={(v) =>
                              updateLoad(load.id, "loadType", v)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INDUSTRIAL_LOAD_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={load.powerKW}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "powerKW",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 w-20 text-right text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={load.qty}
                            onChange={(e) =>
                              updateLoad(load.id, "qty", Number(e.target.value))
                            }
                            className="h-8 w-16 text-right text-sm"
                            min={1}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={load.cosPhi}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "cosPhi",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 w-16 text-right text-sm"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={load.demandFactor}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "demandFactor",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 w-16 text-right text-sm"
                            step="0.1"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {totalP.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-primary text-right font-mono font-semibold">
                          {demandP.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => removeLoad(load.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Kết quả tổng hợp */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                Tổng P đặt
              </Label>
              <div className="text-foreground mt-1 font-mono text-2xl font-black">
                {industrialResult.totalP.toFixed(1)}{" "}
                <span className="text-sm">kW</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                P tính toán
              </Label>
              <div className="text-primary mt-1 font-mono text-2xl font-black">
                {industrialResult.totalDemandP.toFixed(1)}{" "}
                <span className="text-sm">kW</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                Dòng tính toán (380V)
              </Label>
              <div className="mt-1 font-mono text-2xl font-black text-orange-500">
                {industrialResult.totalI.toFixed(1)}{" "}
                <span className="text-sm">A</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                MBA Gợi Ý
              </Label>
              <div className="text-foreground mt-1 font-mono text-2xl font-black">
                {industrialResult.suggestedTransformer}{" "}
                <span className="text-sm">kVA</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CB & dây tổng */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between pt-6">
              <span className="text-muted-foreground">CB Tổng</span>
              <Badge variant="default" className="px-3 py-1 text-sm">
                {industrialResult.mainCB} A
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between pt-6">
              <span className="text-muted-foreground">
                Dây trục chính (Cu/PVC)
              </span>
              <Badge
                variant="outline"
                className="bg-background px-3 py-1 text-sm"
              >
                {industrialResult.mainWire.size} mm²
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
