import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, SlidersHorizontal, Settings } from "lucide-react";

import PidParamsPanel from "./components/PidParamsPanel";
import ProcessConfigPanel from "./components/ProcessConfigPanel";
import ResponseChart from "./components/ResponseChart";
import MetricsPanel from "./components/MetricsPanel";
import AutoTunePanel from "./components/AutoTunePanel";

import { simulatePID, calculatePerformanceMetrics } from "./utils/pidEngine";

const DEFAULT_PID = { kp: 2.0, ki: 0.1, kd: 1.0 };
const DEFAULT_CONFIG = {
  sp: 100,
  kProcess: 1.0,
  tauProcess: 10.0,
  deadTime: 2.0,
  simTime: 60,
  noiseAmplitude: 0,
};

export default function PidSimulator() {
  const [pid, setPid] = useState({ ...DEFAULT_PID });
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [showMV, setShowMV] = useState(true);
  const [activeTab, setActiveTab] = useState("pid");

  // Memoize simulation data
  const simData = useMemo(() => {
    return simulatePID({
      kp: pid.kp,
      ki: pid.ki,
      kd: pid.kd,
      sp: config.sp,
      kProcess: config.kProcess,
      tauProcess: config.tauProcess,
      deadTime: config.deadTime,
      simTime: config.simTime,
      dt: 0.1,
      mvMin: 0,
      mvMax: 100,
      noiseAmplitude: config.noiseAmplitude,
    });
  }, [pid, config]);

  // Memoize metrics
  const metrics = useMemo(() => {
    return calculatePerformanceMetrics(simData);
  }, [simData]);

  const handlePidChange = useCallback((key, value) => {
    setPid((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleConfigChange = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyPreset = useCallback((preset) => {
    setPid({ kp: preset.kp, ki: preset.ki, kd: preset.kd });
  }, []);

  const handleReset = useCallback(() => {
    setPid({ ...DEFAULT_PID });
    setConfig({ ...DEFAULT_CONFIG });
  }, []);

  return (
    <div className="mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            Mô phỏng Bộ điều khiển PID
          </h1>
          <p className="text-muted-foreground text-sm">
            Mô phỏng đáp ứng PID cho đối tượng bậc 1 có trễ (FOPDT) — Chỉnh
            tham số và quan sát biểu đồ thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="show-mv"
              checked={showMV}
              onCheckedChange={setShowMV}
            />
            <Label htmlFor="show-mv" className="text-sm">
              Hiển thị MV
            </Label>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <MetricsPanel metrics={metrics} />

      {/* Main content: Chart + Sidebar */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Chart area */}
        <div className="space-y-5 lg:col-span-8">
          <ResponseChart data={simData} showMV={showMV} />
          <AutoTunePanel
            kProcess={config.kProcess}
            tauProcess={config.tauProcess}
            deadTime={config.deadTime}
            onApply={handleApplyPreset}
          />
        </div>

        {/* Sidebar: PID params + Process config */}
        <div className="lg:col-span-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea>
              <TabsList className="bg-muted/50 flex h-10! gap-1 p-1">
                <TabsTrigger value="pid" className="h-full gap-1 p-1.5">
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  <span>Tham số PID</span>
                </TabsTrigger>
                <TabsTrigger value="process" className="h-full gap-1 p-1.5">
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Đối tượng</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
            <TabsContent value="pid" className="mt-4">
              <PidParamsPanel
                kp={pid.kp}
                ki={pid.ki}
                kd={pid.kd}
                onChange={handlePidChange}
              />
            </TabsContent>
            <TabsContent value="process" className="mt-4">
              <ProcessConfigPanel
                config={config}
                onChange={handleConfigChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
