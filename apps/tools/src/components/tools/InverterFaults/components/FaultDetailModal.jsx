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
import {
  Copy,
  Check,
  AlertCircle,
  Wrench,
  Lightbulb,
  Database,
} from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BRANDS } from "../data/types";

export function FaultDetailModal({ fault, isOpen, onClose }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedCode, setCopiedCode] = useState(false);

  if (!fault) return null;

  const brandConfig = BRANDS.find((b) => b.id === fault.brand);

  const handleCopy = (text) => {
    setCopiedCode(true);
    copyToClipboard(text, `Đã sao chép mã lỗi ${text}!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-1.5rem)] min-w-0 flex-col rounded-2xl p-4 sm:max-h-[90vh] sm:max-w-2xl sm:p-6">
        {/* Modal Header */}
        <DialogHeader className="border-border/50 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-primary font-mono text-2xl font-black">
                {fault.code}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => handleCopy(fault.code)}
                title="Sao chép mã lỗi"
              >
                {copiedCode ? (
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
                {brandConfig?.label || fault.brand}
              </Badge>
              <Badge variant="secondary">{fault.categoryLabel}</Badge>
            </div>
          </div>
          <DialogTitle className="text-foreground mt-2 text-base font-semibold">
            {fault.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Dòng biến tần áp dụng: {fault.models.join(", ")}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Content Body */}
        <ScrollArea className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4.5 py-2">
            {/* Communication Codes Overview */}
            {fault.hexCode !== "-" && (
              <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-xl border p-3">
                <div className="text-xs">
                  <span className="text-muted-foreground">
                    Mã Hex truyền thông:{" "}
                  </span>
                  <span className="text-foreground font-mono font-bold">
                    {fault.hexCode}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Mã Dec: </span>
                  <span className="text-foreground font-mono font-bold">
                    {fault.decCode}
                  </span>
                </div>
              </div>
            )}

            {/* Causes Section */}
            <div className="space-y-2">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Nguyên nhân kích hoạt sự cố:
              </div>
              <ul className="border-border/60 bg-muted/20 space-y-1.5 rounded-xl border p-3 text-xs leading-relaxed">
                {fault.causes.map((cause, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground flex items-start gap-2"
                  >
                    <span className="font-bold text-amber-500">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Section */}
            <div className="space-y-2">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Wrench className="h-4 w-4 text-emerald-500" />
                Quy trình kiểm tra & Khắc phục:
              </div>
              <ol className="border-border/60 bg-muted/20 space-y-2 rounded-xl border p-3 text-xs leading-relaxed">
                {fault.solutions.map((sol, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground flex items-start gap-2"
                  >
                    <span className="font-mono font-bold text-emerald-500">
                      {idx + 1}.
                    </span>
                    <span>{sol}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expert Field Tips */}
            {fault.expertTips && (
              <div className="space-y-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4" />
                  Mẹo:
                </div>
                <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                  {fault.expertTips}
                </p>
              </div>
            )}

            {/* Related Modbus Registers */}
            {fault.relatedRegisters && fault.relatedRegisters.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Database className="h-3.5 w-3.5" />
                  Thanh ghi Modbus liên quan:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fault.relatedRegisters.map((reg) => (
                    <Badge
                      key={reg}
                      variant="secondary"
                      className="font-mono text-xs"
                    >
                      {reg}
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
