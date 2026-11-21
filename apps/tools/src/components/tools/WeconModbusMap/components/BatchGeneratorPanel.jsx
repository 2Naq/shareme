import React, { useState, useMemo } from "react";
import {
  BIT_ADDRESS_MAP,
  WORD_ADDRESS_MAP,
  generateBatchAddressTable,
} from "../utils/weconAddressMapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ListOrdered, AlertTriangle } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function BatchGeneratorPanel({ onSelectDevice }) {
  const [space, setSpace] = useState("bit");
  const [prefix, setPrefix] = useState("M");
  const [startInput, setStartInput] = useState("0");
  const [count, setCount] = useState(16);

  const { copyToClipboard } = useCopyToClipboard();
  const [copiedCsv, setCopiedCsv] = useState(false);

  const availablePrefixes = useMemo(() => {
    return space === "bit" ? BIT_ADDRESS_MAP : WORD_ADDRESS_MAP;
  }, [space]);

  const handleSpaceChange = (newSpace) => {
    setSpace(newSpace);
    const list = newSpace === "bit" ? BIT_ADDRESS_MAP : WORD_ADDRESS_MAP;
    if (!list.some((item) => item.prefix === prefix)) {
      setPrefix(newSpace === "bit" ? "M" : "D");
    }
  };

  const batchResult = useMemo(() => {
    return generateBatchAddressTable({
      prefix,
      space,
      startInput,
      count,
    });
  }, [prefix, space, startInput, count]);

  const handleCopyTable = () => {
    if (!batchResult.rows.length) return;
    const header = "PLC Device\tHEX\tModbus 0-Based (PLC)\tModbus 1-Based (+1 Weintek)\tWeintek Tag";
    const lines = batchResult.rows.map(
      (r) => `${r.device}\t${r.hex}\t${r.addr0}\t${r.addr1}\t${r.weintekTag}`,
    );
    copyToClipboard([header, ...lines].join("\n"), "Đã sao chép bảng địa chỉ (dán trực tiếp vào Excel)!");
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="border-border/60 bg-card space-y-4 rounded-2xl border p-4 shadow-xs sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ListOrdered className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-base font-bold sm:text-lg">
              Tạo Bảng Ánh Xạ Hàng Loạt (Batch Tag Generator cho Excel / HMI)
            </h3>
          </div>
          <p className="text-muted-foreground text-xs">
            Tạo nhanh danh sách địa chỉ liên tiếp (tối đa 128 điểm) để lập bảng Tag truyền thông RS485 / Modbus RTU.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyTable}
          disabled={!batchResult.rows.length}
          className="h-9 gap-1.5 rounded-xl font-medium"
        >
          {copiedCsv ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Sao chép bảng (Excel / TSV)
        </Button>
      </div>

      {/* Bộ điều khiển tạo hàng loạt */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Chọn loại vùng nhớ */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-semibold">
            1. Vùng nhớ Modbus
          </label>
          <div className="bg-muted/60 grid grid-cols-2 gap-1 rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleSpaceChange("bit")}
              className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                space === "bit"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bit (Coil 0x)
            </button>
            <button
              type="button"
              onClick={() => handleSpaceChange("word")}
              className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                space === "word"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Word (Reg 4x)
            </button>
          </div>
        </div>

        {/* Chọn thiết bị */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-semibold">
            2. Loại thiết bị PLC
          </label>
          <div className="flex flex-wrap gap-1">
            {availablePrefixes.map((item) => (
              <button
                key={item.prefix}
                type="button"
                onClick={() => setPrefix(item.prefix)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                  prefix === item.prefix
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.prefix}
              </button>
            ))}
          </div>
        </div>

        {/* Địa chỉ bắt đầu */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-semibold">
            3. Chỉ số bắt đầu ({prefix === "X" || prefix === "Y" ? "Hệ Bát phân 0~7" : "Hệ Thập phân"})
          </label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm font-bold">
              {prefix}
            </span>
            <Input
              type="text"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="h-9 rounded-xl pl-10 font-mono text-sm"
              placeholder="0"
            />
          </div>
        </div>

        {/* Số lượng */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-semibold">
            4. Số lượng phần tử (1 ~ 128)
          </label>
          <div className="flex items-center gap-1.5">
            {[8, 16, 32, 64].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCount(preset)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-all ${
                  Number(count) === preset
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {preset}
              </button>
            ))}
            <Input
              type="number"
              min={1}
              max={128}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="h-9 w-20 rounded-xl font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {batchResult.error ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{batchResult.error}</span>
        </div>
      ) : (
        <div className="border-border/60 max-h-96 overflow-auto rounded-xl border">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/80 text-muted-foreground sticky top-0 border-b text-xs font-semibold uppercase backdrop-blur-xs">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Thiết bị PLC</th>
                <th className="px-4 py-2.5">Địa chỉ HEX</th>
                <th className="px-4 py-2.5">0-Based (PLC)</th>
                <th className="px-4 py-2.5">1-Based (+1 Weintek)</th>
                <th className="px-4 py-2.5">Weintek HMI Tag</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-mono">
              {batchResult.rows.map((row, idx) => (
                <tr
                  key={row.device}
                  onClick={() => onSelectDevice(row.device)}
                  className="hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <td className="text-muted-foreground px-4 py-2">{idx + 1}</td>
                  <td className="text-foreground px-4 py-2 font-bold">
                    {row.device}
                  </td>
                  <td className="px-4 py-2">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                      {row.hex}
                    </code>
                  </td>
                  <td className="text-foreground px-4 py-2">{row.addr0}</td>
                  <td className="text-primary px-4 py-2 font-bold">
                    {row.addr1}
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {row.weintekTag}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
