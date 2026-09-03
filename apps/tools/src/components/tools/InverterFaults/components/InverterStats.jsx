import React from "react";
import { AlertCircle, Database, Layers, Radio } from "lucide-react";

export function InverterStats({ faults, registers, selectedBrand }) {
  const totalFaults = faults.length;
  const totalRegisters = registers.length;
  const coilCount = registers.filter((r) => r.type === "coil").length;
  const holdingCount = registers.filter((r) => r.type === "holding").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-xs">
        <div className="rounded-xl bg-red-500/10 p-2.5 text-red-500">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {totalFaults}
          </div>
          <div className="text-muted-foreground text-xs">Mã lỗi & Cảnh báo</div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-xs">
        <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-500">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {totalRegisters}
          </div>
          <div className="text-muted-foreground text-xs">Thanh ghi Modbus</div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-xs">
        <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-500">
          <Radio className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {coilCount}{" "}
            <span className="text-muted-foreground text-xs font-normal">
              / {holdingCount}
            </span>
          </div>
          <div className="text-muted-foreground text-xs">
            Coil (0x) / Holding (4x)
          </div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-xs">
        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold capitalize">
            {selectedBrand === "all" ? "10+ Hãng" : selectedBrand}
          </div>
          <div className="text-muted-foreground text-xs">Hãng biến tần</div>
        </div>
      </div>
    </div>
  );
}
