import React from "react";
import { Badge } from "@/components/ui/badge";
import { BRANDS } from "../data/types";
import { ArrowRight, AlertCircle, Database } from "lucide-react";

export function InverterGrid({ items, activeTab, onSelectItem }) {
  if (!items || items.length === 0) {
    return (
      <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Không tìm thấy mục nào phù hợp với bộ lọc.
        </p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn bộ danh sách.
        </p>
      </div>
    );
  }

  if (activeTab === "faults") {
    return (
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((fault) => {
          const brandConfig = BRANDS.find((b) => b.id === fault.brand);

          return (
            <div
              key={fault.id}
              onClick={() => onSelectItem(fault)}
              className="border-border/60 bg-card hover:border-primary/40 group flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all hover:shadow-md"
            >
              <div className="space-y-2.5">
                {/* Header: Fault Code + Brand */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-red-500/10 p-1.5 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-foreground group-hover:text-primary font-mono text-lg font-bold transition-colors">
                      {fault.code}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold ${brandConfig?.color || ""}`}
                  >
                    {brandConfig?.badge || fault.brand}
                  </Badge>
                </div>

                {/* Fault Name & Category */}
                <div>
                  <h3 className="text-foreground text-sm font-semibold line-clamp-1">
                    {fault.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[11px]">
                      {fault.categoryLabel}
                    </Badge>
                    {fault.hexCode !== "-" && (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Hex: {fault.hexCode} (Dec: {fault.decCode})
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Cause Snippet */}
                <p className="text-muted-foreground text-xs line-clamp-2">
                  {fault.causes[0]}
                </p>
              </div>

              {/* Footer: Models + Action */}
              <div className="border-border/40 text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-xs">
                <span className="truncate max-w-[180px]">
                  {fault.models.join(", ")}
                </span>
                <span className="text-primary flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5">
                  Chi tiết <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Modbus Registers Grid View
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((reg) => {
        const brandConfig = BRANDS.find((b) => b.id === reg.brand);
        const isCoil = reg.type === "coil";
        const rwColor =
          reg.rw === "R"
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            : reg.rw === "W"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

        return (
          <div
            key={reg.id}
            onClick={() => onSelectItem(reg)}
            className="border-border/60 bg-card hover:border-primary/40 group flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all hover:shadow-md"
          >
            <div className="space-y-2.5">
              {/* Header: Modbus Hex Address + Brand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-cyan-500/10 p-1.5 text-cyan-500">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-foreground group-hover:text-primary font-mono text-base font-bold transition-colors">
                      {reg.addressHex0Based}
                    </span>
                    <span className="text-muted-foreground ml-1.5 font-mono text-xs">
                      (Dec: {reg.addressDec1Based})
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold ${brandConfig?.color || ""}`}
                >
                  {brandConfig?.badge || reg.brand}
                </Badge>
              </div>

              {/* Register Name & Badges */}
              <div>
                <h3 className="text-foreground text-sm font-semibold line-clamp-1">
                  {reg.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${
                      isCoil
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                    }`}
                  >
                    {isCoil ? "Coil (Bit)" : "Holding (16-bit)"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] font-bold ${rwColor}`}
                  >
                    {reg.rw}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {reg.categoryLabel}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-xs line-clamp-2">
                {reg.description}
              </p>
            </div>

            {/* Footer */}
            <div className="border-border/40 text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span className="truncate max-w-[180px]">
                {reg.models?.join(", ") || brandConfig?.label}
              </span>
              <span className="text-primary flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5">
                Xem bit & khung truyền <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
