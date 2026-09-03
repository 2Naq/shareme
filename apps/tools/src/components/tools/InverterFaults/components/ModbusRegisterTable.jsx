import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { BRANDS } from "../data/types";

export function ModbusRegisterTable({ registers, onSelectRegister }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    setCopiedId(text);
    copyToClipboard(text, `Đã sao chép địa chỉ ${text}!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!registers || registers.length === 0) {
    return (
      <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Không tìm thấy thanh ghi Modbus nào phù hợp với bộ lọc.
        </p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn
          bộ danh sách.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card w-full overflow-x-auto rounded-2xl border shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground border-border/60 border-b text-xs font-semibold uppercase">
          <tr>
            <th scope="col" className="w-36 px-4 py-3.5">
              Địa Chỉ Modbus
            </th>
            <th scope="col" className="w-28 px-4 py-3.5">
              Hãng
            </th>
            <th scope="col" className="min-w-48 px-4 py-3.5">
              Tên Thanh Ghi / Tín Hiệu
            </th>
            <th scope="col" className="w-28 px-4 py-3.5">
              Loại
            </th>
            <th scope="col" className="w-20 px-4 py-3.5 text-center">
              R/W
            </th>
            <th scope="col" className="min-w-64 px-4 py-3.5">
              Mô tả & Chức năng
            </th>
            <th scope="col" className="w-24 px-4 py-3.5 text-right">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/40 divide-y">
          {registers.map((reg) => {
            const brandConfig = BRANDS.find((b) => b.id === reg.brand);
            const isCoil = reg.type === "coil";
            const rwColor =
              reg.rw === "R"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                : reg.rw === "W"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

            return (
              <tr
                key={reg.id}
                onClick={() => onSelectRegister(reg)}
                className="hover:bg-muted/40 group cursor-pointer transition-colors"
              >
                {/* Modbus Address (Dec + Hex) */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="group-hover:text-primary text-foreground text-sm transition-colors">
                      {reg.addressHex0Based}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, reg.addressHex0Based)}
                      className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      title="Sao chép địa chỉ Hex"
                    >
                      {copiedId === reg.addressHex0Based ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">
                    Dec: {reg.addressDec1Based}
                  </div>
                </td>

                {/* Brand */}
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold ${brandConfig?.color || ""}`}
                  >
                    {brandConfig?.badge || reg.brand}
                  </Badge>
                </td>

                {/* Register Name */}
                <td className="px-4 py-3">
                  <div className="text-foreground font-medium">{reg.name}</div>
                  <div className="text-muted-foreground/80 text-xs">
                    {reg.categoryLabel}
                  </div>
                </td>

                {/* Type (Coil or Holding) */}
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={`text-[11px] ${
                      isCoil
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                    }`}
                  >
                    {isCoil ? "Coil (Bit)" : "Holding (16-bit)"}
                  </Badge>
                </td>

                {/* R/W */}
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] font-bold ${rwColor}`}
                  >
                    {reg.rw}
                  </Badge>
                </td>

                {/* Description */}
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  <p className="line-clamp-2">{reg.description}</p>
                </td>

                {/* View Details Action */}
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 rounded-lg px-2 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRegister(reg);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Xem
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
