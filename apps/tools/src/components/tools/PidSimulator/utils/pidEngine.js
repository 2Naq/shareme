/**
 * Hàm mô phỏng đáp ứng PID cho đối tượng bậc 1 có trễ (FOPDT).
 *
 * Mô hình đối tượng: G(s) = K_process / (Tau_process * s + 1) * e^(-Td * s)
 *
 * @param {object} params - Tham số PID và đối tượng
 * @returns {Array<{time: number, sp: number, pv: number, mv: number, error: number}>}
 */
export function simulatePID({
  kp = 1.0,
  ki = 0.0,
  kd = 0.0,
  sp = 100,
  kProcess = 1.0,
  tauProcess = 10.0,
  deadTime = 0,
  simTime = 60,
  dt = 0.1,
  mvMin = 0,
  mvMax = 100,
  noiseAmplitude = 0,
  spStepTime = 0,
  spStepValue = 0,
  disturbanceTime = 0,
  disturbanceValue = 0,
}) {
  const totalSteps = Math.floor(simTime / dt);
  const deadTimeSteps = Math.max(0, Math.round(deadTime / dt));
  const data = [];

  let pv = 0;
  let integral = 0;
  let mv = 0;

  // Buffer lưu trữ giá trị MV quá khứ để mô phỏng Dead Time
  const mvBuffer = new Array(deadTimeSteps + 1).fill(0);
  let bufferIndex = 0;

  for (let i = 0; i <= totalSteps; i++) {
    const time = parseFloat((i * dt).toFixed(4));

    // Tính setpoint hiện tại (có thể có bước nhảy)
    let currentSP = sp;
    if (spStepTime > 0 && time >= spStepTime) {
      currentSP = sp + spStepValue;
    }

    // Thêm nhiễu vào PV
    const noise =
      noiseAmplitude > 0 ? (Math.random() - 0.5) * 2 * noiseAmplitude : 0;
    const pvNoisy = pv + noise;

    // Tính sai số
    const error = currentSP - pvNoisy;

    // --- Thuật toán PID (Positional Form) ---
    // Khâu P
    const pTerm = kp * error;

    // Khâu I (với Anti-Windup Clamping)
    integral += error * dt;
    const iTerm = ki * integral;

    // Khâu D (Derivative on PV để tránh Derivative Kick)
    const dPV = i > 0 ? (pvNoisy - (data[i - 1]?.pv ?? 0)) / dt : 0;
    const dTerm = -kd * dPV;

    // Tổng ngõ ra thô
    let mvRaw = pTerm + iTerm + dTerm;

    // --- Anti-Windup Clamping ---
    if (mvRaw > mvMax) {
      // Nếu ngõ ra bão hòa trên và sai số vẫn dương -> Đóng băng tích phân
      if (error > 0) {
        integral -= error * dt;
      }
      mvRaw = mvMax;
    } else if (mvRaw < mvMin) {
      // Nếu ngõ ra bão hòa dưới và sai số vẫn âm -> Đóng băng tích phân
      if (error < 0) {
        integral -= error * dt;
      }
      mvRaw = mvMin;
    }

    mv = Math.max(mvMin, Math.min(mvMax, mvRaw));

    // --- Mô phỏng Dead Time ---
    mvBuffer[bufferIndex] = mv;
    const delayedIndex =
      (bufferIndex - deadTimeSteps + mvBuffer.length) % mvBuffer.length;
    const mvDelayed = mvBuffer[delayedIndex];
    bufferIndex = (bufferIndex + 1) % mvBuffer.length;

    // --- Mô phỏng đối tượng FOPDT bằng Euler ---
    // dPV/dt = (K_process * MV_delayed - PV) / Tau_process
    let disturbance = 0;
    if (disturbanceTime > 0 && time >= disturbanceTime) {
      disturbance = disturbanceValue;
    }
    const dpv =
      ((kProcess * mvDelayed - pv + disturbance) / Math.max(tauProcess, 0.01)) *
      dt;
    pv += dpv;

    data.push({
      time,
      sp: parseFloat(currentSP.toFixed(2)),
      pv: parseFloat(pvNoisy.toFixed(2)),
      mv: parseFloat(mv.toFixed(2)),
      error: parseFloat(error.toFixed(2)),
    });
  }

  return data;
}

/**
 * Tính các chỉ số hiệu suất PID từ dữ liệu mô phỏng.
 */
export function calculatePerformanceMetrics(data) {
  if (!data || data.length === 0) {
    return {
      riseTime: 0,
      settlingTime: 0,
      overshoot: 0,
      steadyStateError: 0,
      iae: 0,
    };
  }

  const finalSP = data[data.length - 1].sp;
  const dt = data.length > 1 ? data[1].time - data[0].time : 0.1;

  // Rise Time: Thời gian PV đạt 90% SP lần đầu
  let riseTime = 0;
  const target90 = finalSP * 0.9;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pv >= target90) {
      riseTime = data[i].time;
      break;
    }
  }

  // Overshoot (%)
  let maxPV = 0;
  for (const d of data) {
    if (d.pv > maxPV) maxPV = d.pv;
  }
  const overshoot =
    finalSP > 0 ? Math.max(0, ((maxPV - finalSP) / finalSP) * 100) : 0;

  // Settling Time: Thời gian PV nằm trong ±2% SP kể từ đó trở đi
  let settlingTime = 0;
  const band = finalSP * 0.02;
  for (let i = data.length - 1; i >= 0; i--) {
    if (Math.abs(data[i].pv - finalSP) > band) {
      settlingTime = i < data.length - 1 ? data[i + 1].time : data[i].time;
      break;
    }
  }

  // Steady State Error
  const lastN = Math.min(20, data.length);
  let sumLast = 0;
  for (let i = data.length - lastN; i < data.length; i++) {
    sumLast += Math.abs(data[i].error);
  }
  const steadyStateError = sumLast / lastN;

  // IAE (Integral of Absolute Error)
  let iae = 0;
  for (const d of data) {
    iae += Math.abs(d.error) * dt;
  }

  return {
    riseTime: parseFloat(riseTime.toFixed(2)),
    settlingTime: parseFloat(settlingTime.toFixed(2)),
    overshoot: parseFloat(overshoot.toFixed(1)),
    steadyStateError: parseFloat(steadyStateError.toFixed(2)),
    iae: parseFloat(iae.toFixed(1)),
  };
}

/**
 * Tính tham số PID theo phương pháp Ziegler-Nichols (dựa trên FOPDT).
 */
export function zieglerNicholsFOPDT(kProcess, tauProcess, deadTime) {
  if (kProcess <= 0 || tauProcess <= 0 || deadTime <= 0) {
    return null;
  }

  const ratio = tauProcess / deadTime;

  // P-only
  const pOnly = {
    kp: parseFloat(((ratio / kProcess) * 1.0).toFixed(3)),
    ki: 0,
    kd: 0,
    label: "P",
  };

  // PI
  const pi = {
    kp: parseFloat(((0.9 * ratio) / kProcess).toFixed(3)),
    ki: parseFloat(((0.9 * ratio) / (kProcess * 3.33 * deadTime)).toFixed(4)),
    kd: 0,
    label: "PI",
  };

  // PID
  const pid = {
    kp: parseFloat(((1.2 * ratio) / kProcess).toFixed(3)),
    ki: parseFloat(((1.2 * ratio) / (kProcess * 2.0 * deadTime)).toFixed(4)),
    kd: parseFloat(((1.2 * ratio * 0.5 * deadTime) / kProcess).toFixed(4)),
    label: "PID",
  };

  return { pOnly, pi, pid };
}
