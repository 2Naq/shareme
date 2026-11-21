import React, { useState } from "react";
import { BIT_ADDRESS_MAP, WORD_ADDRESS_MAP } from "../utils/weconAddressMapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table as TableIcon, Binary, Layers, MousePointerClick } from "lucide-react";

export function AddressReferenceTable({ onSelectExample }) {
  const [activeTab, setActiveTab] = useState("all");

  const renderTable = (title, subtitle, badgeText, items, isBit) => (
    <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3.5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-base font-bold">{title}</h3>
            <Badge
              variant="outline"
              className={`font-mono text-xs ${
                isBit
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {badgeText}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
        </div>
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <MousePointerClick className="h-3.5 w-3.5" />
          Nhấn vào dòng bất kỳ để nạp lên bộ chuyển đổi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground border-border/60 border-b text-xs font-semibold uppercase">
            <tr>
              <th className="px-4 py-3">Thiết bị (Address Type)</th>
              <th className="px-4 py-3">Kích thước (Occupation)</th>
              <th className="px-4 py-3">Phạm vi Hex</th>
              <th className="px-4 py-3">Địa chỉ 0-Based (PLC)</th>
              <th className="px-4 py-3">Địa chỉ 1-Based (+1 Weintek)</th>
              <th className="px-4 py-3 text-center">Hệ cơ số / Bước</th>
              <th className="px-4 py-3 text-center">Dự phòng (Reserved)</th>
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
            {items.map((item) => {
              const endDec0 = item.baseDec + (item.maxIndex + 1) * item.step - 1;
              const startDec1 = item.baseDec + 1;
              const endDec1 = endDec0 + 1;
              const sampleDevice = `${item.prefix}0`;

              return (
                <tr
                  key={`${item.type}-${item.prefix}`}
                  onClick={() => onSelectExample(sampleDevice)}
                  className="hover:bg-muted/40 group cursor-pointer transition-colors"
                  title={`Nhấn để thử nghiệm ${sampleDevice}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-foreground group-hover:text-primary font-mono font-bold transition-colors">
                        {item.rangeText}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.label}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {item.occupation}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    <code className="bg-muted rounded px-1.5 py-0.5">
                      {item.baseHex} ~ {item.endHex}
                    </code>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    <span className="text-foreground font-bold">{item.baseDec}</span>
                    <span className="text-muted-foreground"> ~ {endDec0}</span>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    <Badge
                      variant="secondary"
                      className="border-primary/20 bg-primary/10 text-primary font-mono text-xs font-bold"
                    >
                      {item.weintekPrefix} {startDec1} ~ {endDec1}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        {item.radix === 8 ? "Octal (0~7)" : "Decimal (10)"}
                      </Badge>
                      {item.step === 2 && (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          32-bit (2 Word/pt)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="text-muted-foreground px-4 py-3 text-center font-mono text-xs">
                    {item.reservedSize}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TableIcon className="text-primary h-5 w-5" />
          <h3 className="text-foreground text-base font-bold sm:text-lg">
            ⑧ Bảng Quy Chiếu Địa Chỉ Trạm Tớ Chuẩn Hãng WECON (Slave Station Address Table)
          </h3>
        </div>

        <div className="bg-muted/60 border-border/50 flex items-center gap-1 rounded-xl border p-1">
          {[
            { id: "all", label: "Tất cả (Bit & Word)", icon: Layers },
            { id: "bit", label: "Bảng Bit (Coil 0x)", icon: Binary },
            { id: "word", label: "Bảng Word (Register 4x)", icon: TableIcon },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="h-8 rounded-lg px-2.5 text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {(activeTab === "all" || activeTab === "bit") &&
        renderTable(
          "Bảng Địa Chỉ Bit (Bit Address / Coils)",
          "Sử dụng với mã lệnh Modbus: 0x01 (Đọc Coil), 0x05 (Ghi 1 Coil), 0x0F (Ghi nhiều Coil). Lưu ý: X và Y đánh số hệ Bát phân (Octal).",
          "Coils (0x)",
          BIT_ADDRESS_MAP,
          true,
        )}

      {(activeTab === "all" || activeTab === "word") &&
        renderTable(
          "Bảng Địa Chỉ Từ (Word Address / Holding Registers)",
          "Sử dụng với mã lệnh Modbus: 0x03 (Đọc Thanh ghi), 0x06 (Ghi 1 Thanh ghi), 0x10 (Ghi nhiều Thanh ghi). Lưu ý: LC và HSC là 32-bit (2 Word/phần tử).",
          "Registers (4x)",
          WORD_ADDRESS_MAP,
          false,
        )}
    </div>
  );
}
