import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ArrowLeftRight, Sparkles } from "lucide-react";

const QUICK_EXAMPLES = [
  { label: "M0 → 4097 / 4096", value: "M0", type: "PLC → Modbus" },
  { label: "4097 → M0 / D0", value: "4097", type: "Weintek (+1) → PLC" },
  { label: "4096 → M0 / D0", value: "4096", type: "PLC (0-based) → PLC" },
  { label: "D100", value: "D100", type: "Word" },
  { label: "X10 (Octal)", value: "X10", type: "Octal Bit" },
  { label: "Y20 (Octal)", value: "Y20", type: "Octal Bit" },
  { label: "LC0 (32-bit)", value: "LC0", type: "Bit & 2-Word" },
  { label: "SD2590", value: "SD2590", type: "Special Word" },
  { label: "R100", value: "R100", type: "Extended Word" },
  { label: "D2000.E", value: "D2000.E", type: "Bit in Word" },
  { label: "0x1000", value: "0x1000", type: "Hex → PLC" },
  { label: "57353", value: "57353", type: "Weintek → X10" },
];

export function ConverterPanel({
  query,
  setQuery,
  offsetPreference,
  setOffsetPreference,
  analysis,
}) {
  return (
    <div className="border-border/60 bg-card space-y-4 rounded-2xl border p-4 shadow-xs sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-base font-bold sm:text-lg">
              Chuyển Đổi & Tra Cứu 2 Chiều (PLC ⇄ Modbus / Weintek HMI)
            </h3>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Nhập <strong>địa chỉ thiết bị PLC</strong> (VD:{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">M0</code>,{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">D100</code>,{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">X10</code>)
            hoặc <strong>số địa chỉ Modbus / Hex</strong> (VD:{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">4097</code>,{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">4096</code>,{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono">0x1000</code>)
            để tra cứu xuôi & ngược tức thì.
          </p>
        </div>

        {/* Chế độ hiển thị Offset cho tra cứu ngược */}
        <div className="bg-muted/60 border-border/50 flex shrink-0 items-center gap-1 self-start rounded-xl border p-1 sm:self-auto">
          {[
            { id: "both", label: "Cả 2 chuẩn (0 & +1)" },
            { id: "1-based", label: "Weintek (+1)" },
            { id: "0-based", label: "PLC gốc (0)" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setOffsetPreference(mode.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                offsetPreference === mode.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ô nhập liệu chính */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập M0, D100, X10, Y20, LC0, D2000.E hoặc 4097, 4096, 0x1000..."
          className="focus-visible:ring-primary/30 h-12 rounded-xl pr-28 pl-12 font-mono text-base font-semibold sm:h-14 sm:text-lg"
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
          {analysis?.isValid && (
            <Badge
              variant="secondary"
              className="hidden font-mono text-[11px] sm:inline-flex"
            >
              {analysis.mode === "forward" ? "PLC → Modbus" : "Modbus → PLC"}
            </Badge>
          )}
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
              title="Xóa ô nhập"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Các gợi ý thử nhanh */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
          <Sparkles className="text-primary h-3.5 w-3.5" />
          Thử nhanh:
        </span>
        {QUICK_EXAMPLES.map((item) => {
          const isActive = query.trim().toUpperCase() === item.value.toUpperCase();
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setQuery(item.value)}
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-all ${
                isActive
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
