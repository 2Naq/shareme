import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { STANDARD_WIRE_SIZES } from "./constants";

export function calculateVoltageDrop({
  systemType,
  voltage,
  inputMode,
  current,
  power,
  powerFactor,
  activeRho,
  activeWireSize,
  length,
  includeReactance,
  reactanceVal,
}) {
  const L = Number(length) || 0;
  const S = activeWireSize;
  const U = Number(voltage) || 220;
  const PF = systemType === "DC" ? 1 : Number(powerFactor) || 0.85;

  // 1. Tính dòng điện tải I nếu người dùng nhập công suất P
  let I = 0;
  let P_load = 0; // W

  if (inputMode === "I") {
    I = Number(current) || 0;
    // Tính ngược lại công suất tải để tính hao hụt %
    if (systemType === "DC") {
      P_load = U * I;
    } else if (systemType === "1-phase") {
      P_load = U * I * PF;
    } else if (systemType === "3-phase") {
      P_load = Math.sqrt(3) * U * I * PF;
    }
  } else {
    P_load = (Number(power) || 0) * 1000; // kW -> W
    if (systemType === "DC") {
      I = U > 0 ? P_load / U : 0;
    } else if (systemType === "1-phase") {
      I = U * PF > 0 ? P_load / (U * PF) : 0;
    } else if (systemType === "3-phase") {
      I = Math.sqrt(3) * U * PF > 0 ? P_load / (Math.sqrt(3) * U * PF) : 0;
    }
  }

  // 2. Điện trở và cảm kháng của dây dẫn (cho 1 sợi đơn)
  const R_single = S > 0 ? (activeRho * L) / S : 0;
  const X_single = includeReactance ? (Number(reactanceVal) || 0.00008) * L : 0;

  // Kháng trở tổng hợp (Z)
  // Z = R*cos(phi) + X*sin(phi)
  const sinPhi = systemType === "DC" ? 0 : Math.sqrt(Math.max(0, 1 - PF * PF));
  const Z_single = R_single * PF + X_single * sinPhi;

  // 3. Tính độ sụt áp (Delta U)
  let deltaU = 0;
  let multiplier = 2; // DC và 1 Pha đi-về có 2 dây dẫn

  if (systemType === "3-phase") {
    // 3 Pha cân bằng thì sụt áp dây pha = sqrt(3) * I * Z_single
    multiplier = Math.sqrt(3);
    deltaU = multiplier * I * Z_single;
  } else {
    // DC & 1 Pha
    deltaU = multiplier * I * Z_single;
  }

  // Tỷ lệ sụt áp phần trăm
  const deltaU_percent = U > 0 ? (deltaU / U) * 100 : 0;
  const U_end = Math.max(0, U - deltaU);

  // 4. Hao hụt công suất trên đường dây (Delta P)
  // DC và 1 pha: Delta P = 2 * I^2 * R
  // 3 pha: Delta P = 3 * I^2 * R
  const wireCount = systemType === "3-phase" ? 3 : 2;
  const deltaP = wireCount * (I * I) * R_single; // tính trên điện trở thuần R
  const deltaP_percent = P_load > 0 ? (deltaP / (P_load + deltaP)) * 100 : 0;

  // Hiệu suất truyền tải
  const efficiency = P_load > 0 ? (P_load / (P_load + deltaP)) * 100 : 100;
  const totalP = P_load + deltaP;

  // 5. Tính toán công thức LaTeX hiển thị
  let latexFormula = "";
  if (systemType === "DC") {
    latexFormula = String.raw`\Delta U = 2 \cdot I \cdot R = 2 \cdot I \cdot \rho \cdot \frac{L}{S}`;
  } else if (systemType === "1-phase") {
    if (includeReactance) {
      latexFormula = String.raw`\Delta U = 2 \cdot I \cdot \left( \frac{\rho \cdot L}{S} \cdot \cos\varphi + X_L \cdot \sin\varphi \right)`;
    } else {
      latexFormula = String.raw`\Delta U = 2 \cdot I \cdot \frac{\rho \cdot L}{S} \cdot \cos\varphi`;
    }
  } else if (systemType === "3-phase") {
    if (includeReactance) {
      latexFormula = String.raw`\Delta U = \sqrt{3} \cdot I \cdot \left( \frac{\rho \cdot L}{S} \cdot \cos\varphi + X_L \cdot \sin\varphi \right)`;
    } else {
      latexFormula = String.raw`\Delta U = \sqrt{3} \cdot I \cdot \frac{\rho \cdot L}{S} \cdot \cos\varphi`;
    }
  }

  // 6. Gợi ý tiết diện dây tối ưu (để độ sụt áp < 3%)
  let recommendedWireSize = null;
  let recommendedDeltaUPercent = 0;
  let recommendedDeltaU = 0;

  if (deltaU_percent > 3) {
    // Thử trong list dây chuẩn xem size nào đạt < 3%
    for (const size of STANDARD_WIRE_SIZES) {
      const R_temp = (activeRho * L) / size;
      const X_temp = includeReactance
        ? (Number(reactanceVal) || 0.00008) * L
        : 0;
      const Z_temp = R_temp * PF + X_temp * sinPhi;
      const dU_temp = multiplier * I * Z_temp;
      const dU_pct_temp = (dU_temp / U) * 100;

      if (dU_pct_temp < 3) {
        recommendedWireSize = size;
        recommendedDeltaUPercent = dU_pct_temp;
        recommendedDeltaU = dU_temp;
        break;
      }
    }
  }

  return {
    loadCurrent: I,
    loadPower: P_load,
    totalPower: totalP,
    rCable: R_single * multiplier, // Tổng trở kháng vòng lặp (hoặc 3 pha tương đương)
    deltaU,
    deltaU_percent,
    uEnd: U_end,
    deltaP,
    deltaP_percent,
    efficiency,
    latexFormula,
    recommendedWireSize,
    recommendedDeltaUPercent,
    recommendedDeltaU,
  };
}

export function evaluateStatus(deltaUPercent) {
  if (deltaUPercent <= 3.0) {
    return {
      label: "An toàn / Rất tốt",
      color:
        "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50",
      icon: CheckCircle2,
      desc: "Độ sụt áp nằm trong mức tối ưu khuyến nghị (dưới 3%). Phù hợp cho cả chiếu sáng và thiết bị động lực.",
    };
  } else if (deltaUPercent <= 5.0) {
    return {
      label: "Chấp nhận được",
      color:
        "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/30 border-amber-200 dark:border-amber-800/50",
      icon: Info,
      desc: "Độ sụt áp ở mức trung bình (3% - 5%). Phù hợp với hầu hết thiết bị động lực nhưng có thể làm giảm hiệu suất thiết bị, chiếu sáng nhạy cảm.",
    };
  } else {
    return {
      label: "Cảnh báo / Quá tải áp",
      color:
        "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
      icon: AlertTriangle,
      desc: "Độ sụt áp vượt quá ngưỡng cho phép (trên 5%). Có nguy cơ gây hại thiết bị, động cơ bị quá nhiệt do điện áp thấp, hao tổn điện năng lớn. Cần tăng tiết diện dây!",
    };
  }
}
