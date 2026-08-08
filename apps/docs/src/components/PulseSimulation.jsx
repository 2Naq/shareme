import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Terminal,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";

// Import shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function PulseSimulation() {
  const [mode, setMode] = useState("DRVI"); // DRVI or DRVA
  const [currentPos, setCurrentPos] = useState(0);
  const [targetInput, setTargetInput] = useState(200);
  const [speed, setSpeed] = useState("medium"); // slow, medium, fast
  const [isMoving, setIsMoving] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [directionActive, setDirectionActive] = useState(true); // true = Forward, false = Reverse
  const [logs, setLogs] = useState([
    {
      id: 1,
      text: "Hệ thống PLC đã sẵn sàng. Trạng thái: READY.",
      type: "info",
    },
  ]);

  const intervalRef = useRef(null);
  const pulseToggleRef = useRef(null);
  const logIdRef = useRef(2);

  // Speed configuration (step values and intervals)
  const speedConfigs = {
    slow: { interval: 100, step: 10, label: "Thấp (100 Hz)" },
    medium: { interval: 40, step: 15, label: "Trung bình (500 Hz)" },
    fast: { interval: 15, step: 20, label: "Cao (1000 Hz)" },
  };

  const addLog = (text, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: logIdRef.current++, text: `[${time}] ${text}`, type },
      ...prev.slice(0, 19), // Limit to last 20 logs
    ]);
  };

  // Handle stop/reset
  const stopMovement = (isEmergency = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pulseToggleRef.current) {
      clearInterval(pulseToggleRef.current);
      pulseToggleRef.current = null;
    }
    setIsMoving(false);
    setPulseActive(false);
    if (isEmergency) {
      addLog(
        "LỆNH DỪNG KHẨN CẤP! Ngắt phát xung ngay lập tức. Cờ bận M8147 tắt.",
        "error",
      );
    }
  };

  const handleReset = () => {
    stopMovement();
    setCurrentPos(0);
    setTargetInput(mode === "DRVI" ? 200 : 0);
    setLogs([
      {
        id: logIdRef.current++,
        text: `[${new Date().toLocaleTimeString()}]: Đã về gốc (Origin) thành công (X = 0).`,
        type: "info",
      },
    ]);
  };

  const handleStart = () => {
    if (isMoving) return;

    const targetVal = Number(targetInput);
    if (isNaN(targetVal)) {
      addLog("Lỗi: Giá trị nhập S1 không hợp lệ.", "error");
      return;
    }

    let startPos = currentPos;
    let destPos = 0;

    if (mode === "DRVI") {
      destPos = startPos + targetVal;
    } else {
      destPos = targetVal;
    }

    // Clamp boundary: -500 to +500 pulses
    const maxBound = 500;
    const minBound = -500;
    let clampedDest = Math.max(minBound, Math.min(maxBound, destPos));

    if (destPos !== clampedDest) {
      addLog(
        `Cảnh báo: Vị trí ${destPos} vượt giới hạn hành trình. Tự động giới hạn về ${clampedDest}.`,
        "warning",
      );
      destPos = clampedDest;
    }

    if (startPos === destPos) {
      addLog(
        `Vị trí đích trùng với vị trí hiện tại (${startPos}). Không cần di chuyển.`,
        "warning",
      );
      return;
    }

    setIsMoving(true);
    const movingForward = destPos > startPos;
    setDirectionActive(movingForward);

    addLog(
      `Kích hoạt ${mode === "DRVI" ? "DDRVI" : "DDRVA"}: S1 (Đích/Quãng đường) = ${targetVal}, S2 (Tốc độ) = ${speedConfigs[speed].label}.`,
      "success",
    );
    addLog(
      `Đang phát xung ở Y0. Chiều quay Y4: ${movingForward ? "ON (Quay thuận)" : "OFF (Quay nghịch)"}. Cờ Busy M8147 kích hoạt.`,
    );

    const config = speedConfigs[speed];
    let tempPos = startPos;

    // Simulate pulse output indicator flashing
    pulseToggleRef.current = setInterval(() => {
      setPulseActive((prev) => !prev);
    }, 80);

    // Position update loop
    intervalRef.current = setInterval(() => {
      if (movingForward) {
        tempPos += config.step;
        if (tempPos >= destPos) {
          tempPos = destPos;
          setCurrentPos(tempPos);
          stopMovement();
          addLog(
            `Đã đến vị trí đích: X = ${tempPos}. Hoàn thành phát xung. Cờ Busy M8147 tắt.`,
            "success",
          );
        } else {
          setCurrentPos(tempPos);
        }
      } else {
        tempPos -= config.step;
        if (tempPos <= destPos) {
          tempPos = destPos;
          setCurrentPos(tempPos);
          stopMovement();
          addLog(
            `Đã đến vị trí đích: X = ${tempPos}. Hoàn thành phát xung. Cờ Busy M8147 tắt.`,
            "success",
          );
        } else {
          setCurrentPos(tempPos);
        }
      }
    }, config.interval);
  };

  // Stop simulation on unmount
  useEffect(() => {
    return () => stopMovement();
  }, []);

  // Quick inputs helper
  const setQuickInput = (val) => {
    if (isMoving) return;
    setTargetInput(val);
  };

  // Convert position to track percentage (scale -500 to +500 maps to 0% to 100%)
  const getPercentage = (pos) => {
    return ((pos + 500) / 1000) * 100;
  };

  return (
    <Card className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white font-sans shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Simulation Banner */}
      <div className="flex items-center justify-between bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white">
        <div>
          <h4 className="m-0 text-lg font-bold text-white">
            Mô phỏng Lệnh Phát Xung: DRVI vs DRVA
          </h4>
          <p className="m-0 text-xs text-emerald-100">
            Trực quan hóa sự khác biệt giữa vị trí Tương đối & Tuyệt đối
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-none bg-white/20 font-mono text-white hover:bg-white/30"
        >
          Mitsubishi FX
        </Badge>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* State LED Panel */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="border-zinc-150 flex items-center justify-between rounded-xl border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Vị trí thực tế (X)
            </span>
            <span className="text-zinc-850 font-mono text-xl font-bold dark:text-zinc-100">
              {currentPos} xung
            </span>
          </div>

          {/* LED Y0 */}
          <div className="border-zinc-150 flex items-center gap-3 rounded-xl border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div
              className={clsx(
                "h-4 w-4 rounded-full shadow-md transition-all duration-75",
                pulseActive
                  ? "scale-110 bg-amber-400 shadow-amber-400/50"
                  : "bg-zinc-300 dark:bg-zinc-700",
              )}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Y0 (Phát xung)
              </span>
              <span className="text-[10px] text-zinc-400">
                {pulseActive ? "Phát xung..." : "OFF"}
              </span>
            </div>
          </div>

          {/* LED Y4 */}
          <div className="border-zinc-150 flex items-center gap-3 rounded-xl border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div
              className={clsx(
                "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300",
                isMoving
                  ? directionActive
                    ? "bg-emerald-500 shadow-emerald-500/50"
                    : "bg-indigo-500 shadow-indigo-500/50"
                  : "bg-zinc-300 dark:bg-zinc-700",
              )}
            >
              {isMoving &&
                (directionActive ? (
                  <ArrowRight className="h-2.5 w-2.5 text-white" />
                ) : (
                  <ArrowLeft className="h-2.5 w-2.5 text-white" />
                ))}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Y4 (Chiều quay)
              </span>
              <span className="text-[10px] text-zinc-400">
                {isMoving
                  ? directionActive
                    ? "ON (Thuận +)"
                    : "OFF (Nghịch -)"
                  : "OFF"}
              </span>
            </div>
          </div>

          {/* LED M8147 */}
          <div className="border-zinc-150 flex items-center gap-3 rounded-xl border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div
              className={clsx(
                "h-4 w-4 rounded-full transition-all duration-300",
                isMoving
                  ? "animate-pulse bg-rose-500 shadow-rose-500/50"
                  : "bg-emerald-500 shadow-emerald-500/50",
              )}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                M8147 (Cờ bận Busy)
              </span>
              <span className="text-[10px] text-zinc-400">
                {isMoving ? "BUSY (ON)" : "READY (OFF)"}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Axis Track */}
        <div className="border-zinc-150 relative rounded-xl border bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
            Mô hình băng tải tịnh tiến
          </div>
          <div className="relative flex h-12 w-full items-center overflow-visible rounded-lg border border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
            {/* Guide Rail ticks */}
            <div className="dark:text-zinc-650 absolute top-1 right-0 left-0 flex justify-between px-2 font-mono text-[9px] text-zinc-400">
              <span>-500</span>
              <span>-250</span>
              <span className="font-bold text-zinc-500 dark:text-zinc-400">
                0 (Origin)
              </span>
              <span>250</span>
              <span>500</span>
            </div>

            {/* Scale markings */}
            <div className="absolute right-0 bottom-0 left-0 flex h-1.5 justify-between px-2">
              <div className="h-full w-px bg-zinc-400"></div>
              <div className="h-full w-px bg-zinc-300"></div>
              <div className="h-full w-px bg-zinc-500"></div>
              <div className="h-full w-px bg-zinc-300"></div>
              <div className="h-full w-px bg-zinc-400"></div>
            </div>

            {/* Zero point indicator flag */}
            <div className="absolute -top-4.5 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-3 w-px bg-emerald-500"></div>
            </div>

            {/* Slider Carriage */}
            <div
              className="absolute flex h-6 w-12 flex-col items-center justify-center rounded border border-zinc-700 bg-zinc-800 shadow-lg transition-all duration-300 ease-out dark:border-zinc-400 dark:bg-zinc-200"
              style={{
                left: `calc(${getPercentage(currentPos)}% - 24px)`,
                top: "18px",
              }}
            >
              <div className="font-mono text-[10px] font-bold text-white dark:text-zinc-900">
                {currentPos}
              </div>
              <div className="mt-0.5 flex gap-1.5">
                <div
                  className={clsx(
                    "h-1 w-1 rounded-full bg-zinc-400",
                    isMoving && "animate-bounce",
                  )}
                />
                <div
                  className={clsx(
                    "h-1 w-1 rounded-full bg-zinc-400",
                    isMoving && "animate-bounce delay-75",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration & Controls */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Settings panel */}
          <div className="space-y-4">
            <h5 className="text-zinc-850 border-zinc-150 border-b pb-2 text-sm font-bold tracking-wide uppercase dark:border-zinc-800 dark:text-zinc-200">
              Cấu hình lệnh
            </h5>

            {/* Mode selection with Tabs */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Lựa chọn lệnh
              </label>
              <Tabs
                value={mode}
                onValueChange={(val) => {
                  setMode(val);
                  setTargetInput(val === "DRVI" ? 200 : 0);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="DRVI"
                    disabled={isMoving}
                    className="cursor-pointer"
                  >
                    DDRVI (Vị trí tương đối)
                  </TabsTrigger>
                  <TabsTrigger
                    value="DRVA"
                    disabled={isMoving}
                    className="cursor-pointer"
                  >
                    DDRVA (Vị trí tuyệt đối)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* S1: Distance/Target value */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {mode === "DRVI"
                    ? "Quãng đường di chuyển (S1): Xung"
                    : "Tọa độ vị trí đích (S1): Xung"}
                </label>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Giới hạn [-500, 500]
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  disabled={isMoving}
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Quick Input Helpers */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mode === "DRVI" ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(100)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      +100 xung
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(300)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      +300 xung
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(-150)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      -150 xung
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(-300)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      -300 xung
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(0)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      Về 0 (Home)
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(250)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      Đến +250
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(-250)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      Đến -250
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isMoving}
                      onClick={() => setQuickInput(500)}
                      className="h-7 cursor-pointer text-[10px]"
                    >
                      Đến +500
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* S2: Frequency (Speed) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Tốc độ phát xung (S2)
              </label>
              <div className="flex gap-2">
                {Object.keys(speedConfigs).map((s) => (
                  <Button
                    key={s}
                    variant={speed === s ? "default" : "outline"}
                    size="sm"
                    disabled={isMoving}
                    onClick={() => setSpeed(s)}
                    className="flex-1 cursor-pointer"
                  >
                    {s === "slow"
                      ? "Chậm"
                      : s === "medium"
                        ? "Thường"
                        : "Nhanh"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Console and Log */}
          <div className="flex h-full flex-col space-y-4">
            <h5 className="text-zinc-850 border-zinc-150 border-b pb-2 text-sm font-bold tracking-wide uppercase dark:border-zinc-800 dark:text-zinc-200">
              Điều khiển & Trạng thái
            </h5>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleStart}
                disabled={isMoving}
                className="cursor-pointer bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                <Play className="mr-1 h-3.5 w-3.5 fill-current" />
                Chạy Lệnh
              </Button>

              <Button
                variant="destructive"
                onClick={() => stopMovement(true)}
                disabled={!isMoving}
                className="cursor-pointer font-bold"
              >
                <Square className="mr-1 h-3.5 w-3.5 fill-current" />
                Dừng Khẩn
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                className="cursor-pointer"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Về Origin
              </Button>
            </div>

            {/* Log Console Box */}
            <div className="flex min-h-40 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="border-zinc-850 flex items-center gap-1.5 border-b bg-zinc-950 px-3 py-1.5">
                <Terminal className="h-3 w-3 text-zinc-500" />
                <span className="font-mono text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Console Log
                </span>
              </div>
              <div className="text-zinc-350 max-h-45 flex-1 space-y-1.5 overflow-y-auto p-3 font-mono text-[10px]">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={clsx(
                      log.type === "error" && "text-rose-450 font-semibold",
                      log.type === "warning" && "font-semibold text-amber-400",
                      log.type === "success" &&
                        "font-semibold text-emerald-400",
                      log.type === "info" && "text-zinc-300",
                    )}
                  >
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explain Card using Alert Component */}
        <Alert className="text-zinc-650 border-emerald-100 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/10 dark:text-zinc-300">
          <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="font-bold text-emerald-800 dark:text-emerald-400">
            Cách so sánh đơn giản:
          </AlertTitle>
          <AlertDescription className="text-zinc-650 mt-1 dark:text-zinc-300">
            <ul className="list-disc space-y-1 pl-4">
              <li>
                <strong>Lệnh DDRVI (Tương đối):</strong> Vị trí tiếp theo phụ
                thuộc vào vị trí hiện tại. Nếu đang ở{" "}
                <code className="bg-zinc-150 rounded px-1 py-0.5 font-mono text-[10px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  100
                </code>
                , kích hoạt di chuyển{" "}
                <code className="bg-zinc-150 rounded px-1 py-0.5 font-mono text-[10px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  +200
                </code>{" "}
                sẽ đưa ní tới{" "}
                <code className="bg-zinc-150 rounded px-1 py-0.5 font-mono text-[10px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  300
                </code>
                .
              </li>
              <li>
                <strong>Lệnh DDRVA (Tuyệt đối):</strong> Vị trí đích đến hoàn
                toàn cố định so với điểm gốc (Origin). Bất kể ní đang ở đâu,
                kích hoạt di chuyển đến vị trí{" "}
                <code className="bg-zinc-150 rounded px-1 py-0.5 font-mono text-[10px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  200
                </code>{" "}
                sẽ luôn dừng lại chính xác tại vị trí{" "}
                <code className="bg-zinc-150 rounded px-1 py-0.5 font-mono text-[10px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  200
                </code>{" "}
                trên trục tọa độ.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
