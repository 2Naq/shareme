import React from "react";
import { Cpu, Binary, Radio, AlertTriangle } from "lucide-react";

export function DeviceStats({ devices }) {
  const total = devices.length;
  const bitCount = devices.filter((d) => d.type === "bit").length;
  const wordCount = devices.filter((d) => d.type === "word").length;
  const commCount = devices.filter((d) => d.category === "comm").length;
  const errorCount = devices.filter((d) => d.category === "error").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5">
        <div className="bg-primary/10 text-primary rounded-xl p-2.5">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {total}
          </div>
          <div className="text-muted-foreground text-xs">Tổng Devices</div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5">
        <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-500">
          <Binary className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {bitCount}{" "}
            <span className="text-muted-foreground text-xs font-normal">
              / {wordCount}
            </span>
          </div>
          <div className="text-muted-foreground text-xs">
            Bit (M) / Word (D)
          </div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5">
        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
          <Radio className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {commCount}
          </div>
          <div className="text-muted-foreground text-xs">
            Truyền Thông Serial
          </div>
        </div>
      </div>

      <div className="border-border/60 bg-card flex items-center gap-3 rounded-2xl border p-3.5">
        <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="text-foreground font-mono text-xl font-bold">
            {errorCount}
          </div>
          <div className="text-muted-foreground text-xs">Cờ & Mã Lỗi</div>
        </div>
      </div>
    </div>
  );
}
