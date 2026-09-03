import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Database, Code, ListTree, Layers } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BRANDS } from "../data/types";

export function RegisterDetailModal({ register, isOpen, onClose }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedText, setCopiedText] = useState(false);

  if (!register) return null;

  const brandConfig = BRANDS.find((b) => b.id === register.brand);
  const isCoil = register.type === "coil";
  const rwColor =
    register.rw === "R"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : register.rw === "W"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

  const handleCopy = (text) => {
    setCopiedText(true);
    copyToClipboard(text, `Đã sao chép ${text}!`);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-1.5rem)] min-w-0 flex-col rounded-2xl p-4 sm:max-h-[90vh] sm:max-w-2xl sm:p-6">
        {/* Modal Header */}
        <DialogHeader className="border-border/50 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-primary font-mono text-2xl font-black">
                {register.addressHex0Based}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => handleCopy(register.addressHex0Based)}
                title="Sao chép địa chỉ Hex"
              >
                {copiedText ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`font-semibold ${brandConfig?.color || ""}`}
              >
                {brandConfig?.label || register.brand}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  isCoil
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                }
              >
                {isCoil ? "Coil (Bit)" : "Holding (16-bit)"}
              </Badge>
              <Badge
                variant="outline"
                className={`font-mono font-bold ${rwColor}`}
              >
                {register.rw}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-foreground mt-2 text-base font-semibold">
            {register.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Địa chỉ Dec:{" "}
            <span className="text-foreground font-mono font-bold">
              {register.addressDec1Based}
            </span>{" "}
            • Phân loại: {register.categoryLabel}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Content Body */}
        <ScrollArea className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4.5 py-2">
            {/* Description */}
            <div className="space-y-1.5">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Database className="h-4 w-4 text-cyan-500" />
                Chức năng & Diễn giải:
              </div>
              <p className="border-border/60 bg-muted/20 text-muted-foreground rounded-xl border p-3 text-xs leading-relaxed">
                {register.description}
              </p>
            </div>

            {/* Bit Breakdown (nếu có) */}
            {register.bitDetails && register.bitDetails.length > 0 && (
              <div className="space-y-2">
                <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <ListTree className="h-4 w-4 text-blue-500" />
                  Bảng giải mã chi tiết từng bit:
                </div>
                <div className="border-border/60 bg-card overflow-hidden rounded-xl border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/60 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                      <tr>
                        <th className="w-24 px-3 py-2">Vị trí Bit</th>
                        <th className="w-28 px-3 py-2">Tên cờ</th>
                        <th className="px-3 py-2">
                          Ý nghĩa khi kích hoạt (1 / True)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/40 divide-y">
                      {register.bitDetails.map((b, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="text-foreground px-3 py-2 font-mono font-bold">
                            {b.bit}
                          </td>
                          <td className="text-primary px-3 py-2 font-semibold">
                            {b.name}
                          </td>
                          <td className="text-muted-foreground px-3 py-2">
                            {b.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Example Frame */}
            {register.example && (
              <div className="space-y-1.5">
                <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <Code className="h-4 w-4 text-emerald-500" />
                  Ví dụ cấu trúc khung truyền (Modbus Frame):
                </div>
                <div className="bg-muted/50 border-border/60 text-foreground/90 rounded-xl border p-3 font-mono text-xs">
                  {register.example}
                </div>
              </div>
            )}

            {/* Applied Inverter Models */}
            {register.models && register.models.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Layers className="h-3.5 w-3.5" />
                  Dòng biến tần áp dụng:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {register.models.map((m) => (
                    <Badge key={m} variant="secondary" className="text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
