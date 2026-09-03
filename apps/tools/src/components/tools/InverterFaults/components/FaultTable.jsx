import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { BRANDS } from "../data/types";

export function FaultTable({ faults, onSelectFault }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    setCopiedId(text);
    copyToClipboard(text, `Đã sao chép mã lỗi ${text}!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!faults || faults.length === 0) {
    return (
      <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Không tìm thấy mã lỗi nào phù hợp với bộ lọc.
        </p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn bộ danh sách.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card w-full overflow-x-auto rounded-2xl border shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground border-border/60 border-b text-xs font-semibold uppercase">
          <tr>
            <th scope="col" className="w-28 px-4 py-3.5">
              Mã Lỗi (PU)
            </th>
            <th scope="col" className="w-28 px-4 py-3.5">
              Hãng
            </th>
            <th scope="col" className="min-w-50 px-4 py-3.5">
              Tên Lỗi Sự Cố
            </th>
            <th scope="col" className="w-28 px-4 py-3.5 text-center">
              Mã Hex / Dec
            </th>
            <th scope="col" className="w-36 px-4 py-3.5">
              Phân loại
            </th>
            <th scope="col" className="min-w-64 px-4 py-3.5">
              Nguyên nhân chính
            </th>
            <th scope="col" className="w-24 px-4 py-3.5 text-right">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/40 divide-y">
          {faults.map((fault) => {
            const brandConfig = BRANDS.find((b) => b.id === fault.brand);

            return (
              <tr
                key={fault.id}
                onClick={() => onSelectFault(fault)}
                className="hover:bg-muted/40 group cursor-pointer transition-colors"
              >
                {/* Fault Code */}
                <td className="text-foreground px-4 py-3 font-mono font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="group-hover:text-primary text-base transition-colors">
                      {fault.code}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, fault.code)}
                      className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      title="Sao chép mã lỗi"
                    >
                      {copiedId === fault.code ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Brand Badge */}
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold ${brandConfig?.color || ""}`}
                  >
                    {brandConfig?.badge || fault.brand}
                  </Badge>
                </td>

                {/* Fault Name */}
                <td className="px-4 py-3">
                  <div className="text-foreground font-medium">{fault.name}</div>
                  <div className="text-muted-foreground/80 text-xs">
                    {fault.models.slice(0, 3).join(", ")}
                    {fault.models.length > 3 ? "..." : ""}
                  </div>
                </td>

                {/* Hex / Dec */}
                <td className="px-4 py-3 text-center font-mono text-xs">
                  {fault.hexCode !== "-" ? (
                    <Badge variant="secondary" className="font-mono">
                      {fault.hexCode} / {fault.decCode}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">
                    {fault.categoryLabel}
                  </Badge>
                </td>

                {/* Primary Cause */}
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  <p className="line-clamp-2">{fault.causes[0]}</p>
                </td>

                {/* View Details Action */}
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 rounded-lg px-2 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFault(fault);
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
