import {
  CB_SIZES,
  WIRE_SIZES,
  MOTOR_DATABASE,
  THERMAL_RELAY_RANGES,
  VFD_SUGGESTIONS,
  VFD_PROTECTION_DEFAULTS,
  AC_BTU_TABLE,
  TRANSFORMER_SIZES,
} from "./constants";

// ===== CHỌN CB =====
export function selectCB(currentAmps, factor = 1.25) {
  const target = currentAmps * factor;
  return CB_SIZES.find((size) => size >= target) || CB_SIZES[CB_SIZES.length - 1];
}

// ===== CHỌN DÂY DẪN =====
export function selectWire(currentAmps, factor = 1.25) {
  const target = currentAmps * factor;
  const wire = WIRE_SIZES.find((w) => w.maxI >= target) || WIRE_SIZES[WIRE_SIZES.length - 1];
  return wire;
}

// ===== CHỌN RELAY NHIỆT =====
export function selectThermalRelay(currentAmps) {
  return THERMAL_RELAY_RANGES.find((r) => currentAmps >= r.min && currentAmps <= r.max)
    || THERMAL_RELAY_RANGES.find((r) => currentAmps < r.max)
    || THERMAL_RELAY_RANGES[THERMAL_RELAY_RANGES.length - 1];
}

// ===== TÍNH TOÁN MOTOR =====
export function calculateMotorParams({
  powerKW,
  voltage = 380,
  cosPhi = 0.85,
  eta = 0.88,
  startMethod = "DOL",
  startMethodFactor = 1.0,
}) {
  const P = Number(powerKW) || 0;
  const U = Number(voltage) || 380;
  const PF = Number(cosPhi) || 0.85;
  const EFF = Number(eta) || 0.88;
  const sqrt3 = Math.sqrt(3);

  // Tìm motor trong database
  const closestMotor = MOTOR_DATABASE.reduce((prev, curr) =>
    Math.abs(curr.kW - P) < Math.abs(prev.kW - P) ? curr : prev
  );

  // Dòng định mức = P / (sqrt3 * U * cosφ * η)
  const I_dm = P > 0 ? (P * 1000) / (sqrt3 * U * PF * EFF) : 0;

  // Dòng khởi động
  const startMultiplier = closestMotor.startMultiplier || 7;
  const I_start_DOL = I_dm * startMultiplier;
  const I_start = I_start_DOL * startMethodFactor;

  // Chọn CB: cho motor thường x1.5 (DOL), VFD thì x1.25
  const cbFactor = startMethod === "VFD" ? 1.25 : 1.5;
  const suggestedCB = selectCB(I_dm, cbFactor);

  // Chọn dây
  const suggestedWire = selectWire(I_dm, cbFactor);

  // Chọn relay nhiệt
  const suggestedRelay = selectThermalRelay(I_dm);

  // Gợi ý biến tần
  const vfdSuggestion = VFD_SUGGESTIONS.find((v) => v.motorKW >= P)
    || VFD_SUGGESTIONS[VFD_SUGGESTIONS.length - 1];

  // Công thức LaTeX
  const formula = String.raw`I_{\text{đm}} = \frac{P}{\sqrt{3} \cdot U \cdot \cos\varphi \cdot \eta} = \frac{${P} \times 1000}{\sqrt{3} \times ${U} \times ${PF} \times ${EFF}}`;

  return {
    motorData: closestMotor,
    I_dm: I_dm,
    I_start_DOL,
    I_start,
    startMultiplier,
    suggestedCB,
    suggestedWire,
    suggestedRelay,
    vfdSuggestion,
    vfdProtection: { ...VFD_PROTECTION_DEFAULTS },
    formula,
  };
}

// ===== TÍNH TOÁN ĐIỆN CƠ BẢN (I, P, U) =====
export function calculateBasicElectrical({
  systemType,
  calcTarget,
  voltage,
  current,
  power,
  powerFactor,
}) {
  let resI = 0, resP = 0, resU = 0;
  let currentFormula = "";

  const U = Number(voltage) || 0;
  const I = Number(current) || 0;
  const P = Number(power) * 1000 || 0;
  const PF = Number(powerFactor) || 1;
  const sqrt3 = Math.sqrt(3);

  if (calcTarget === "I") {
    if (systemType === "DC") {
      resI = U > 0 ? P / U : 0;
      currentFormula = "I = \\frac{P}{U}";
    } else if (systemType === "1-phase") {
      resI = U * PF > 0 ? P / (U * PF) : 0;
      currentFormula = "I = \\frac{P}{U \\cdot \\cos\\varphi}";
    } else if (systemType === "3-phase") {
      resI = sqrt3 * U * PF > 0 ? P / (sqrt3 * U * PF) : 0;
      currentFormula = "I = \\frac{P}{\\sqrt{3} \\cdot U \\cdot \\cos\\varphi}";
    }
  } else if (calcTarget === "P") {
    if (systemType === "DC") {
      resP = U * I;
      currentFormula = "P = U \\cdot I";
    } else if (systemType === "1-phase") {
      resP = U * I * PF;
      currentFormula = "P = U \\cdot I \\cdot \\cos\\varphi";
    } else if (systemType === "3-phase") {
      resP = sqrt3 * U * I * PF;
      currentFormula = "P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi";
    }
  } else if (calcTarget === "U") {
    if (systemType === "DC") {
      resU = I > 0 ? P / I : 0;
      currentFormula = "U = \\frac{P}{I}";
    } else if (systemType === "1-phase") {
      resU = I * PF > 0 ? P / (I * PF) : 0;
      currentFormula = "U = \\frac{P}{I \\cdot \\cos\\varphi}";
    } else if (systemType === "3-phase") {
      resU = sqrt3 * I * PF > 0 ? P / (sqrt3 * I * PF) : 0;
      currentFormula = "U = \\frac{P}{\\sqrt{3} \\cdot I \\cdot \\cos\\varphi}";
    }
  }

  const calculatedI = calcTarget === "I" ? resI : I;
  const suggestedCB = selectCB(calculatedI);
  const suggestedWire = selectWire(calculatedI);

  return {
    resultI: resI.toFixed(2),
    resultP: (resP / 1000).toFixed(2),
    resultU: resU.toFixed(2),
    formula: currentFormula,
    cbSuggested: suggestedCB,
    wireSuggested: suggestedWire.size,
  };
}

// ===== TÍNH TOÁN TẢI DÂN DỤNG =====
export function calculateResidentialLoad(appliances, demandFactor = 0.7) {
  // appliances: [{ ...applianceData, qty: number, acArea?: number }]
  let totalWatts = 0;
  let weightedPF = 0;
  let totalApparent = 0;

  const details = appliances
    .filter((a) => a.qty > 0)
    .map((a) => {
      const watts = a.watts * a.qty;
      const apparent = a.cosPhi > 0 ? watts / a.cosPhi : watts;
      totalWatts += watts;
      totalApparent += apparent;
      return {
        ...a,
        totalWatts: watts,
        totalApparent: apparent,
      };
    });

  weightedPF = totalApparent > 0 ? totalWatts / totalApparent : 0.85;

  const demandWatts = totalWatts * demandFactor;
  const totalCurrent = demandWatts > 0 ? demandWatts / (220 * weightedPF) : 0;

  const mainCB = selectCB(totalCurrent, 1.25);
  const mainWire = selectWire(totalCurrent, 1.25);

  // Tính CB nhánh theo nhóm
  const groups = {};
  for (const item of details) {
    if (!groups[item.group]) {
      groups[item.group] = { watts: 0, apparent: 0, items: [] };
    }
    groups[item.group].watts += item.totalWatts;
    groups[item.group].apparent += item.totalApparent;
    groups[item.group].items.push(item);
  }

  const branchDetails = Object.entries(groups).map(([groupId, data]) => {
    const branchI = data.watts > 0
      ? data.watts / (220 * (data.watts / data.apparent || 0.85))
      : 0;
    return {
      groupId,
      ...data,
      current: branchI,
      cb: selectCB(branchI),
      wire: selectWire(branchI),
    };
  });

  return {
    details,
    totalWatts,
    demandWatts,
    demandFactor,
    weightedPF,
    totalCurrent,
    mainCB,
    mainWire,
    branchDetails,
  };
}

// ===== GỢI Ý MÁY LẠNH =====
export function suggestACUnit(areaSqm) {
  const area = Number(areaSqm) || 0;
  return AC_BTU_TABLE.find((ac) => area >= ac.areaMin && area < ac.areaMax)
    || AC_BTU_TABLE[AC_BTU_TABLE.length - 1];
}

// ===== TÍNH TOÁN PHỤ TẢI CÔNG NGHIỆP =====
export function calculateIndustrialLoad(loads) {
  // loads: [{ name, powerKW, qty, loadType, cosPhi, demandFactor }]
  let totalP = 0;
  let totalDemandP = 0;

  const details = loads.map((load) => {
    const p = (Number(load.powerKW) || 0) * (Number(load.qty) || 1);
    const dp = p * (Number(load.demandFactor) || 0.7);
    totalP += p;
    totalDemandP += dp;
    return { ...load, totalP: p, demandP: dp };
  });

  const avgPF = 0.85;
  const sqrt3 = Math.sqrt(3);
  const totalI = totalDemandP > 0
    ? (totalDemandP * 1000) / (sqrt3 * 380 * avgPF)
    : 0;

  const mainCB = selectCB(totalI, 1.25);
  const mainWire = selectWire(totalI, 1.25);

  // Gợi ý MBA: lấy kVA = totalDemandP / avgPF, sau đó lấy MBA chuẩn gần nhất (lớn hơn)
  const requiredKVA = avgPF > 0 ? totalDemandP / avgPF : totalDemandP;
  const suggestedTransformer =
    TRANSFORMER_SIZES.find((s) => s >= requiredKVA) ||
    TRANSFORMER_SIZES[TRANSFORMER_SIZES.length - 1];

  return {
    details,
    totalP,
    totalDemandP,
    totalI,
    mainCB,
    mainWire,
    requiredKVA,
    suggestedTransformer,
  };
}
