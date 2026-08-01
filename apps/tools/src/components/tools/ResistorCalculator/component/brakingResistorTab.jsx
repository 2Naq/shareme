import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MathRendererBlock from "@/components/MathRenderer";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================================
// CONSTANTS
// ============================================================

const VOLTAGE_PRESETS = [
  { acVoltage: 220, dcBrake: 360, label: "220V (1 pha)" },
  { acVoltage: 380, dcBrake: 690, label: "380V (3 pha)" },
  { acVoltage: 400, dcBrake: 720, label: "400V (3 pha)" },
  { acVoltage: 440, dcBrake: 780, label: "440V (3 pha)" },
  { acVoltage: 480, dcBrake: 850, label: "480V (3 pha)" },
];

const REFERENCES = [
  {
    title: "Mitsubishi Electric FREQROL Series Manual",
    desc: "Hướng dẫn chọn điện trở xả mã FR-ABR/FR-BR, đấu nối chân P/+ và PR.",
    docId: "FREQROL-A800/E800/F800",
    url: "https://www.mitsubishielectric.com/fa/products/drv/inv/index.html",
  },
  {
    title: "INVT Goodrive Series VFD Manual (Appendix C)",
    desc: "Bảng tra giá trị điện trở xả cho 100% momen hãm, R_min và đấu nối PB - (+).",
    docId: "GD20 / GD200A Manual",
    url: "https://www.invt.com",
  },
  {
    title: "WECON AC Drives User Manual (Appendix A.3)",
    desc: "Bảng tính chọn điện trở xả theo công suất kW và đấu nối cổng PB - (+).",
    docId: "VB / VNZ Series",
    url: "http://www.we-con.com.cn/en/",
  },
  {
    title: "Schneider Electric — Braking Resistor Instruction Sheet",
    desc: "Bảng thông số R_min, công suất và chọn mã điện trở xả Altivar ATV320/ATV900.",
    docId: "NHA87388",
    url: "https://www.se.com/ww/en/download/document/NHA87388/",
  },
  {
    title: "ABB Drives Library — Electrical Braking Guide",
    desc: "Hướng dẫn chi tiết các phương pháp hãm điện, thiết kế brake chopper & điện trở xả.",
    docId: "Doc ID: 3AFE64514482",
    url: "https://library.abb.com/",
  },
  {
    title: "Siemens Industry Online Support",
    desc: "Bảng tra R_min theo Power Module PM240-2/G120, cấu hình tham số p0219.",
    docId: "SINAMICS G120 Manual",
    url: "https://support.industry.siemens.com/",
  },
  {
    title: "IEC Webstore — IEC 61800-5-1 Safety Requirements",
    desc: "Tiêu chuẩn quốc tế: an toàn điện, an toàn nhiệt cho hệ thống biến tần có điện trở xả.",
    docId: "IEC 61800-5-1",
    url: "https://webstore.iec.ch",
  },
];

const DUTY_CYCLE_REF = [
  {
    app: "Dừng khẩn cấp / Ít khi dừng",
    ed: "5% – 10%",
    power: (
      <>
        (0.1 ~ 0.15) × P<sub>motor</sub>
      </>
    ),
  },
  {
    app: "Băng tải, máy nén, máy công cụ",
    ed: "10% – 20%",
    power: (
      <>
        (0.2 ~ 0.3) × P<sub>motor</sub>
      </>
    ),
  },
  {
    app: "Máy ly tâm, máy giặt công nghiệp",
    ed: "30% – 50%",
    power: (
      <>
        (0.4 ~ 0.5) × P<sub>motor</sub>
      </>
    ),
  },
  {
    app: "Cẩu trục nâng hạ, thang máy",
    ed: "50% – 100%",
    power: (
      <>
        (0.8 ~ 1.2) × P<sub>motor</sub>
      </>
    ),
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function safeParseFloat(value) {
  const num = parseFloat(value);
  return typeof num === "number" && !isNaN(num) && isFinite(num) ? num : 0;
}

function formatPower(watts) {
  if (watts === 0) return "0 W";
  if (watts >= 1000) return `${(watts / 1000).toFixed(2)} kW`;
  return `${watts.toFixed(1)} W`;
}

function formatOhm(ohms) {
  if (ohms === 0) return "0 Ω";
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
  return `${ohms.toFixed(2)} Ω`;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function BrakingResistorTab() {
  // --- State ---
  const [voltageKey, setVoltageKey] = useState("380");
  const [motorPower, setMotorPower] = useState("15");
  const [rMin, setRMin] = useState("30");
  const [tBrake, setTBrake] = useState("10");
  const [tCycle, setTCycle] = useState("60");
  const [torqueFactor, setTorqueFactor] = useState(100); // %

  // --- Derived values ---
  const selectedVoltage = useMemo(
    () =>
      VOLTAGE_PRESETS.find((v) => String(v.acVoltage) === voltageKey) ||
      VOLTAGE_PRESETS[1],
    [voltageKey],
  );

  const results = useMemo(() => {
    const pMotor = safeParseFloat(motorPower) * 1000; // kW → W
    const rMinVal = safeParseFloat(rMin);
    const tBrakeVal = safeParseFloat(tBrake);
    const tCycleVal = safeParseFloat(tCycle);
    const uDcBrake = selectedVoltage.dcBrake;
    const tbPercent = torqueFactor / 100;

    // Braking power
    const pBrake = pMotor * tbPercent;

    // R_br = U_DC_brake^2 / P_brake
    const rBr = pBrake > 0 ? (uDcBrake * uDcBrake) / pBrake : 0;

    // Duty cycle %ED = t_brake / t_cycle × 100%
    const edPercent = tCycleVal > 0 ? (tBrakeVal / tCycleVal) * 100 : 0;

    // P_br = P_motor × %ED
    const pBr = pMotor * (edPercent / 100);

    // Warnings
    const rTooLow = rBr > 0 && rMinVal > 0 && rBr < rMinVal;
    const divByZero = tCycleVal === 0;
    const invalidPower = pMotor <= 0;

    return {
      uDcBrake,
      pMotor,
      pBrake,
      rBr,
      rMinVal,
      edPercent,
      pBr,
      tbPercent,
      rTooLow,
      divByZero,
      invalidPower,
      tBrakeVal,
      tCycleVal,
    };
  }, [motorPower, rMin, tBrake, tCycle, torqueFactor, selectedVoltage]);

  // --- KaTeX formulas ---
  const formulaRbr = useMemo(() => {
    if (results.invalidPower || results.pBrake === 0) {
      return String.raw`R_{br} = \frac{U_{DC\_brake}^2}{P_{brake}} = \text{N/A}`;
    }
    return String.raw`R_{br} = \frac{U_{DC\_brake}^2}{P_{brake}} = \frac{${results.uDcBrake}^2}{${results.pBrake.toFixed(0)}} = ${results.rBr.toFixed(2)} \ \Omega`;
  }, [results]);

  const formulaED = useMemo(() => {
    if (results.divByZero) {
      return String.raw`\%ED = \frac{t_{brake}}{t_{cycle}} \times 100\% = \text{N/A (chia cho 0)}`;
    }
    return String.raw`\%ED = \frac{t_{brake}}{t_{cycle}} \times 100\% = \frac{${results.tBrakeVal}}{${results.tCycleVal}} \times 100\% = ${results.edPercent.toFixed(1)}\%`;
  }, [results]);

  const formulaPbr = useMemo(() => {
    if (results.invalidPower || results.divByZero) {
      return String.raw`P_{br} = P_{motor} \times \%ED = \text{N/A}`;
    }
    return String.raw`P_{br} = P_{motor} \times \%ED = ${(results.pMotor / 1000).toFixed(1)} \text{ kW} \times ${results.edPercent.toFixed(1)}\% = ${formatPower(results.pBr)}`;
  }, [results]);

  // --- Validation helpers ---
  const hasValidResults =
    !results.invalidPower && !results.divByZero && results.rBr > 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* ============== LEFT: INPUTS ============== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="size-5 text-primary" />
                Thông số đầu vào
              </CardTitle>
              <CardDescription>
                Nhập thông số biến tần và tải để tính chọn điện trở xả
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* Voltage */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="voltage-select">Điện áp lưới AC</Label>
                <Select value={voltageKey} onValueChange={setVoltageKey}>
                  <SelectTrigger id="voltage-select" className="w-full">
                    <SelectValue placeholder="Chọn điện áp">
                      {voltageKey ? (
                        <>
                          {
                            VOLTAGE_PRESETS.find(
                              (v) => String(v.acVoltage) === voltageKey,
                            )?.label
                          }{" "}
                          →{" "}
                          <span>
                            U<sub>DC</sub>
                          </span>{" "}
                          ≈{" "}
                          {
                            VOLTAGE_PRESETS.find(
                              (v) => String(v.acVoltage) === voltageKey,
                            )?.dcBrake
                          }{" "}
                          VDC
                        </>
                      ) : (
                        "Chọn điện áp"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {VOLTAGE_PRESETS.map((v) => (
                      <SelectItem key={v.acVoltage} value={String(v.acVoltage)}>
                        {v.label} →{" "}
                        <span>
                          U<sub>DC</sub>
                        </span>{" "}
                        ≈ {v.dcBrake} VDC
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motor Power */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="motor-power">
                  Công suất động cơ{" "}
                  <span>
                    P<sub>motor</sub>
                  </span>{" "}
                  (kW)
                </Label>
                <Input
                  id="motor-power"
                  type="number"
                  min="0"
                  step="0.1"
                  value={motorPower}
                  onChange={(e) => setMotorPower(e.target.value)}
                  placeholder="Ví dụ: 15"
                />
              </div>

              {/* R_min */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-min">
                  Điện trở tối thiểu{" "}
                  <span>
                    R<sub>min</sub>
                  </span>{" "}
                  (Ω) — theo nhà sản xuất
                </Label>
                <Input
                  id="r-min"
                  type="number"
                  min="0"
                  step="1"
                  value={rMin}
                  onChange={(e) => setRMin(e.target.value)}
                  placeholder="Ví dụ: 30"
                />
              </div>

              {/* Torque Factor */}
              <div className="flex flex-col gap-2">
                <Label>
                  Hệ số momen hãm{" "}
                  <span>
                    T<sub>b</sub>
                  </span>
                  %:{" "}
                  <Badge variant="secondary" className="ml-1 font-mono">
                    {torqueFactor}%
                  </Badge>
                </Label>
                <Slider
                  min={50}
                  max={200}
                  step={5}
                  value={[torqueFactor]}
                  onValueChange={(v) => {
                    const val = Array.isArray(v) ? v[0] : v;
                    if (typeof val === "number" && !isNaN(val)) {
                      setTorqueFactor(val);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Thường lấy 100% ~ 150%. Tải nặng ta có thể lên 200%.
                </p>
              </div>

              {/* t_brake */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-brake">
                  Thời gian hãm{" "}
                  <span>
                    t<sub>brake</sub>
                  </span>{" "}
                  (giây)
                </Label>
                <Input
                  id="t-brake"
                  type="number"
                  min="0"
                  step="0.5"
                  value={tBrake}
                  onChange={(e) => setTBrake(e.target.value)}
                  placeholder="Ví dụ: 10"
                />
              </div>

              {/* t_cycle */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-cycle">
                  Thời gian chu kỳ{" "}
                  <span>
                    t<sub>cycle</sub>
                  </span>{" "}
                  (giây)
                </Label>
                <Input
                  id="t-cycle"
                  type="number"
                  min="0"
                  step="1"
                  value={tCycle}
                  onChange={(e) => setTCycle(e.target.value)}
                  placeholder="Ví dụ: 60"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============== RIGHT: RESULTS ============== */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Summary result card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kết quả tính toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* R_br */}
                <div className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Điện trở xả R<sub>br</sub>
                  </p>
                  <p className="text-2xl font-black font-mono text-primary">
                    {hasValidResults ? formatOhm(results.rBr) : "—"}
                  </p>
                </div>

                {/* %ED */}
                <div className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Duty Cycle %ED
                  </p>
                  <p className="text-2xl font-black font-mono text-primary">
                    {!results.divByZero
                      ? `${results.edPercent.toFixed(1)}%`
                      : "—"}
                  </p>
                </div>

                {/* P_br */}
                <div className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Công suất P<sub>br</sub>
                  </p>
                  <p className="text-2xl font-black font-mono text-primary">
                    {hasValidResults ? formatPower(results.pBr) : "—"}
                  </p>
                </div>
              </div>

              {/* Warnings / Recommendations */}
              <div className="mt-4 flex flex-col gap-2">
                {results.rTooLow && (
                  <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertDescription>
                      <strong>Cảnh báo:</strong> R<sub>br</sub> ={" "}
                      {formatOhm(results.rBr)} <strong>&lt;</strong> R
                      <sub>min</sub> = {formatOhm(results.rMinVal)}. Giá trị
                      điện trở tính được nhỏ hơn mức tối thiểu cho phép. Cần
                      chọn điện trở lớn hơn hoặc bằng R<sub>min</sub>.
                    </AlertDescription>
                  </Alert>
                )}
                {hasValidResults && !results.rTooLow && (
                  <Alert className="border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400 [&>svg]:text-green-600">
                    <CheckCircle2 className="size-4" />
                    <AlertDescription>
                      <strong>Khuyến nghị:</strong> Chọn điện trở xả có thông số{" "}
                      <strong className="font-mono">
                        {formatOhm(
                          results.rBr < results.rMinVal
                            ? results.rMinVal
                            : results.rBr,
                        )}{" "}
                        — {formatPower(results.pBr)}
                      </strong>{" "}
                      (hoặc ghép song song/nối tiếp các điện trở nhỏ hơn).
                    </AlertDescription>
                  </Alert>
                )}
                {results.divByZero && (
                  <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertDescription>
                      t<sub>cycle</sub> không được bằng 0 (chia cho 0).
                    </AlertDescription>
                  </Alert>
                )}
                {results.invalidPower && (
                  <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertDescription>
                      Công suất động cơ P<sub>motor</sub> phải lớn hơn 0.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulas card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Công thức tính toán</CardTitle>
              <CardDescription>
                Chi tiết các bước tính chọn điện trở xả
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Step 1: R_br */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Bước 1: Tính giá trị điện trở R<sub>br</sub>
                </p>
                <div className="overflow-x-auto">
                  <MathRendererBlock formula={formulaRbr} />
                </div>
              </div>

              {/* Step 2: %ED */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Bước 2: Tính chu kỳ hãm %ED
                </p>
                <div className="overflow-x-auto">
                  <MathRendererBlock formula={formulaED} />
                </div>
              </div>

              {/* Step 3: P_br */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Bước 3: Tính công suất điện trở P<sub>br</sub>
                </p>
                <div className="overflow-x-auto">
                  <MathRendererBlock formula={formulaPbr} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Bảng tra %ED tham khảo theo ứng dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-semibold">
                      Loại phụ tải / Ứng dụng
                    </th>
                    <th className="text-center py-2 px-2 font-semibold">
                      Duty Cycle (%ED)
                    </th>
                    <th className="text-center py-2 px-2 font-semibold">
                      Công suất khuyến nghị
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DUTY_CYCLE_REF.map((row) => (
                    <tr
                      key={row.app}
                      className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-2 px-2">{row.app}</td>
                      <td className="text-center py-2 px-2 font-mono text-xs">
                        {row.ed}
                      </td>
                      <td className="text-center py-2 px-2 font-mono text-xs">
                        {row.power}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        {/* Technical references & Industry standards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Các nguồn tham khảo, tiêu chuẩn kỹ thuật
            </CardTitle>
            <CardDescription>
              Cơ sở lý thuyết dựa trên thông số tra cứu từ tài liệu chính thức
              của các hãng sản xuất biến tần
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs">
            <AccordionBorders />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function AccordionBorders() {
  return (
    <Accordion multiple defaultValue={["Khái niệm"]}>
      {REFERENCES.map((item) => (
        <AccordionItem
          key={item.title}
          value={item.title}
          className="border-b px-4 last:border-b-0"
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-2 -mx-2 no-underline! hover:bg-muted/50 rounded-md transition-colors"
            >
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 ">
                <p className="m-0!">{item.desc}</p>
                {item.docId && (
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    {item.docId}
                  </span>
                )}
              </div>
            </a>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
