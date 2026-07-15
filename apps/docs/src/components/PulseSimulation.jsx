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
        text: `[${new Date().toLocaleTimeString()}] Trả về điểm gốc Origin thành công (X = 0).`,
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
    <div className="my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden font-sans">
      {/* Simulation Banner */}
      <div className="px-6 py-4 bg-linear-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
        <div>
          <h4 className="m-0 text-lg font-bold">
            Mô phỏng Lệnh Phát Xung: DRVI vs DRVA
          </h4>
          <p className="m-0 text-xs text-emerald-100">
            Trực quan hóa sự khác biệt giữa vị trí Tương đối & Tuyệt đối
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-2 py-1 rounded font-mono">
            Mitsubishi FX
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State LED Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Vị trí thực tế (X)
            </span>
            <span className="font-mono text-xl font-bold text-zinc-850 dark:text-zinc-100">
              {currentPos} xung
            </span>
          </div>

          {/* LED Y0 */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center gap-3">
            <div
              className={clsx(
                "w-4 h-4 rounded-full transition-all duration-75 shadow-md",
                pulseActive
                  ? "bg-amber-400 shadow-amber-400/50 scale-110"
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
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center gap-3">
            <div
              className={clsx(
                "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
                isMoving
                  ? directionActive
                    ? "bg-emerald-500 shadow-emerald-500/50"
                    : "bg-indigo-500 shadow-indigo-500/50"
                  : "bg-zinc-300 dark:bg-zinc-700",
              )}
            >
              {isMoving &&
                (directionActive ? (
                  <ArrowRight className="w-2.5 h-2.5 text-white" />
                ) : (
                  <ArrowLeft className="w-2.5 h-2.5 text-white" />
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
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center gap-3">
            <div
              className={clsx(
                "w-4 h-4 rounded-full transition-all duration-300",
                isMoving
                  ? "bg-rose-500 shadow-rose-500/50 animate-pulse"
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
        <div className="p-8 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 relative">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wide">
            Mô hình băng tải tịnh tiến
          </div>
          <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg relative flex items-center border border-zinc-300 dark:border-zinc-700 overflow-visible">
            {/* Guide Rail ticks */}
            <div className="absolute left-0 right-0 flex justify-between px-2 text-[9px] font-mono text-zinc-400 dark:text-zinc-650 top-1">
              <span>-500</span>
              <span>-250</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-bold">
                0 (Origin)
              </span>
              <span>250</span>
              <span>500</span>
            </div>

            {/* Scale markings */}
            <div className="absolute left-0 right-0 h-1.5 bottom-0 flex justify-between px-2">
              <div className="w-px h-full bg-zinc-400"></div>
              <div className="w-px h-full bg-zinc-300"></div>
              <div className="w-px h-full bg-zinc-500"></div>
              <div className="w-px h-full bg-zinc-300"></div>
              <div className="w-px h-full bg-zinc-400"></div>
            </div>

            {/* Zero point indicator flag */}
            <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="w-px h-3 bg-emerald-500"></div>
            </div>

            {/* Slider Carriage */}
            <div
              className="absolute w-12 h-6 bg-zinc-800 dark:bg-zinc-200 rounded shadow-lg border border-zinc-700 dark:border-zinc-400 flex flex-col items-center justify-center transition-all duration-300 ease-out"
              style={{
                left: `calc(${getPercentage(currentPos)}% - 24px)`,
                top: "18px",
              }}
            >
              <div className="text-[10px] font-bold text-white dark:text-zinc-900 font-mono">
                {currentPos}
              </div>
              <div className="flex gap-1.5 mt-0.5">
                <div
                  className={clsx(
                    "w-1 h-1 rounded-full bg-zinc-400",
                    isMoving && "animate-bounce",
                  )}
                />
                <div
                  className={clsx(
                    "w-1 h-1 rounded-full bg-zinc-400",
                    isMoving && "animate-bounce delay-75",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings panel */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide border-b border-zinc-150 dark:border-zinc-800 pb-2">
              Cấu hình lệnh
            </h5>

            {/* Mode selection buttons */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Lựa chọn lệnh
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMode("DRVI");
                    setTargetInput(200);
                  }}
                  disabled={isMoving}
                  className={clsx(
                    "py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center",
                    mode === "DRVI"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                >
                  DDRVI (Vị trí tương đối)
                </button>
                <button
                  onClick={() => {
                    setMode("DRVA");
                    setTargetInput(200);
                  }}
                  disabled={isMoving}
                  className={clsx(
                    "py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center",
                    mode === "DRVA"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                >
                  DDRVA (Vị trí tuyệt đối)
                </button>
              </div>
            </div>

            {/* S1: Distance/Target value */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
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
                <input
                  type="number"
                  disabled={isMoving}
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {/* Quick Input Helpers */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mode === "DRVI" ? (
                  <>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(100)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      +100 xung
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(300)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      +300 xung
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(-150)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      -150 xung
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(-300)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      -300 xung
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(0)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      Về 0 (Home)
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(250)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      Đến +250
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(-250)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      Đến -250
                    </button>
                    <button
                      disabled={isMoving}
                      onClick={() => setQuickInput(500)}
                      className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] rounded cursor-pointer"
                    >
                      Đến +500
                    </button>
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
                  <button
                    key={s}
                    disabled={isMoving}
                    onClick={() => setSpeed(s)}
                    className={clsx(
                      "flex-1 py-1.5 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer",
                      speed === s
                        ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    )}
                  >
                    {s === "slow"
                      ? "Chậm"
                      : s === "medium"
                        ? "Thường"
                        : "Nhanh"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Console and Log */}
          <div className="flex flex-col h-full space-y-4">
            <h5 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide border-b border-zinc-150 dark:border-zinc-800 pb-2">
              Điều khiển & Trạng thái
            </h5>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleStart}
                disabled={isMoving}
                className={clsx(
                  "py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow cursor-pointer text-white",
                  isMoving
                    ? "bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed text-zinc-500 shadow-none"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20",
                )}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Chạy Lệnh
              </button>

              <button
                onClick={() => stopMovement(true)}
                disabled={!isMoving}
                className={clsx(
                  "py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow cursor-pointer text-white",
                  !isMoving
                    ? "bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed text-zinc-500 shadow-none"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20",
                )}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Dừng Khẩn
              </button>

              <button
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 text-xs font-bold transition-all border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Về Origin
              </button>
            </div>

            {/* Log Console Box */}
            <div className="flex-1 flex flex-col min-h-[160px] bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="px-3 py-1.5 bg-zinc-950 border-b border-zinc-850 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Console Log
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto font-mono text-[10px] space-y-1.5 text-zinc-350 max-h-[180px]">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={clsx(
                      log.type === "error" && "text-rose-450 font-semibold",
                      log.type === "warning" && "text-amber-400 font-semibold",
                      log.type === "success" &&
                        "text-emerald-400 font-semibold",
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

        {/* Explain Card */}
        <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/10 flex gap-3 text-xs leading-relaxed text-zinc-650 dark:text-zinc-300">
          <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-800 dark:text-emerald-400">
              Cách so sánh đơn giản:
            </span>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>
                <strong>Lệnh DDRVI (Tương đối):</strong> Vị trí tiếp theo phụ
                thuộc vào vị trí hiện tại. Nếu đang ở{" "}
                <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">
                  100
                </code>
                , kích hoạt di chuyển{" "}
                <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">
                  +200
                </code>{" "}
                sẽ đưa bạn tới{" "}
                <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">
                  300
                </code>
                .
              </li>
              <li>
                <strong>Lệnh DDRVA (Tuyệt đối):</strong> Vị trí đích đến hoàn
                toàn cố định so với điểm gốc (Origin). Bất kể bạn đang ở đâu,
                kích hoạt di chuyển đến vị trí{" "}
                <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">
                  200
                </code>{" "}
                sẽ luôn dừng lại chính xác tại vị trí{" "}
                <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">
                  200
                </code>{" "}
                trên trục tọa độ.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
