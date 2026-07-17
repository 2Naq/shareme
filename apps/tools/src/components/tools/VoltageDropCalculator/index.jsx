// oxlint-disable react-hooks/exhaustive-deps no-useless-escape
import React, { useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { SYSTEM_OPTIONS, MATERIAL_OPTIONS } from "./utils/constants";
import { calculateVoltageDrop, evaluateStatus } from "./utils/calculations";

import ConfigForm from "./components/ConfigForm";
import ResultCard from "./components/ResultCard";
import RecommendationCard from "./components/RecommendationCard";
import FormulaCard from "./components/FormulaCard";
import WiringDiagram from "./components/WiringDiagram";

export default function VoltageDropCalculator() {
  const [systemType, setSystemType] = useState("1-phase");
  const [voltage, setVoltage] = useState(220);
  const [inputMode, setInputMode] = useState("I"); // I: dòng điện, P: công suất
  const [current, setCurrent] = useState(16);
  const [power, setPower] = useState(3.5); // kW
  const [powerFactor, setPowerFactor] = useState(0.85);

  const [wireMaterial, setWireMaterial] = useState("Cu");
  const [tempOption, setTempOption] = useState("75"); // 20: 20°C, 75: 75°C
  const [customRho, setCustomRho] = useState(0.0225);

  const [wireSizeMode, setWireSizeMode] = useState("select"); // select hoặc custom
  const [selectedWireSize, setSelectedWireSize] = useState(2.5);
  const [customWireSize, setCustomWireSize] = useState(2.5);

  const [length, setLength] = useState(100); // mét
  const [includeReactance, setIncludeReactance] = useState(false);
  const [reactanceVal, setReactanceVal] = useState(0.00008); // X = 0.08 Ohm/km = 0.00008 Ohm/m

  // Đồng bộ điện áp định mức khi thay đổi hệ thống điện
  const handleSystemTypeChange = (value) => {
    setSystemType(value);
    const selectedSystem = SYSTEM_OPTIONS.find((opt) => opt.value === value);
    if (selectedSystem) {
      setVoltage(selectedSystem.defaultV);
    }
  };

  // Đồng bộ điện trở suất khi chọn vật liệu/nhiệt độ
  const activeRho = useMemo(() => {
    if (wireMaterial === "custom") {
      return Number(customRho) || 0;
    }
    const mat = MATERIAL_OPTIONS.find((opt) => opt.value === wireMaterial);
    if (mat) {
      return tempOption === "20" ? mat.rho20 : mat.rho75;
    }
    return 0.0178;
  }, [wireMaterial, tempOption, customRho]);

  // Tiết diện dây đang hoạt động
  const activeWireSize = useMemo(() => {
    if (wireSizeMode === "custom") {
      return Number(customWireSize) || 1.5;
    }
    return Number(selectedWireSize) || 2.5;
  }, [wireSizeMode, selectedWireSize, customWireSize]);

  // Thực hiện tính toán
  const calculations = useMemo(() => {
    return calculateVoltageDrop({
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
    });
  }, [
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
  ]);

  // Trạng thái đánh giá độ sụt áp
  const statusEvaluation = useMemo(() => {
    return evaluateStatus(calculations.deltaU_percent);
  }, [calculations.deltaU_percent]);

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Zap className="text-primary w-8 h-8" />
          Tính Độ Sụt Áp & Hao Hụt Đường Dây
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán sụt điện áp cuối đường dây, điện năng hao tổn và
          hiệu suất truyền tải nguồn điện.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ConfigForm
          systemType={systemType}
          onSystemTypeChange={handleSystemTypeChange}
          voltage={voltage}
          setVoltage={setVoltage}
          inputMode={inputMode}
          setInputMode={setInputMode}
          current={current}
          setCurrent={setCurrent}
          power={power}
          setPower={setPower}
          powerFactor={powerFactor}
          setPowerFactor={setPowerFactor}
          wireMaterial={wireMaterial}
          setWireMaterial={setWireMaterial}
          tempOption={tempOption}
          setTempOption={setTempOption}
          customRho={customRho}
          setCustomRho={setCustomRho}
          activeRho={activeRho}
          wireSizeMode={wireSizeMode}
          setWireSizeMode={setWireSizeMode}
          selectedWireSize={selectedWireSize}
          setSelectedWireSize={setSelectedWireSize}
          customWireSize={customWireSize}
          setCustomWireSize={setCustomWireSize}
          length={length}
          setLength={setLength}
          includeReactance={includeReactance}
          setIncludeReactance={setIncludeReactance}
          reactanceVal={reactanceVal}
          setReactanceVal={setReactanceVal}
        />

        <div className="lg:col-span-5 space-y-6">
          <ResultCard
            calculations={calculations}
            statusEvaluation={statusEvaluation}
          />

          <RecommendationCard
            calculations={calculations}
            activeWireSize={activeWireSize}
          />

          <FormulaCard calculations={calculations} />
        </div>
      </div>

      <WiringDiagram
        voltage={voltage}
        systemType={systemType}
        wireMaterial={wireMaterial}
        activeWireSize={activeWireSize}
        length={length}
        activeRho={activeRho}
        calculations={calculations}
      />
    </div>
  );
}
