import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Cpu, Info, Code, ShieldCheck } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DeviceDetailModal({ device, isOpen, onClose }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedType, setCopiedType] = React.useState(null);

  if (!device) return null;

  const isBit = device.type === "bit";
  const rwColor =
    device.rw === "R"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : device.rw === "W"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

  const handleCopyText = (type, text) => {
    setCopiedType(type);
    copyToClipboard(text, `Đã sao chép!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-1.5rem)] min-w-0 flex-col rounded-2xl p-4 sm:max-h-[90vh] sm:max-w-3xl sm:pr-3">
        <DialogHeader className="border-border/50 border-b pr-7 pb-4 sm:pr-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-primary font-mono text-xl font-black sm:text-2xl">
                {device.id}
              </span>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] uppercase sm:text-xs ${
                  isBit
                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}
              >
                {isBit ? "Special Bit (M)" : "Special Word (D)"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`font-mono text-[10px] sm:text-xs ${rwColor}`}
              >
                Quyền: {device.rw}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs sm:h-8 sm:px-2.5"
                onClick={() => handleCopyText("id", device.id)}
              >
                {copiedType === "id" ? (
                  <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="mr-1 h-3.5 w-3.5" />
                )}
                Sao chép
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-1 overflow-y-auto pr-3 pb-2">
          <DialogTitle className="text-foreground mt-2 text-base font-bold wrap-break-word sm:text-lg">
            {device.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-xs wrap-break-word sm:text-sm">
            {device.summary}
          </DialogDescription>
          <div className="min-w-0 space-y-4 pt-3 sm:space-y-5 sm:pt-4">
            {/* Detailed Description */}
            <div className="min-w-0 space-y-1.5">
              <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                <Info className="text-primary h-3.5 w-3.5 shrink-0" />
                Mô tả chi tiết & Cơ chế hoạt động
              </h4>
              <p className="text-foreground/90 bg-muted/30 border-border/40 rounded-xl border p-3 text-xs leading-relaxed wrap-break-word sm:p-3.5 sm:text-sm">
                {device.description}
              </p>
            </div>

            {/* Key Properties Grid */}
            <div className="grid min-w-0 grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div className="border-border/40 bg-card min-w-0 rounded-xl border p-3">
                <span className="text-muted-foreground mb-0.5 block font-medium">
                  Giá trị khởi tạo / Trạng thái:
                </span>
                <span className="text-foreground font-semibold wrap-break-word">
                  {device.initialValue}
                </span>
              </div>
              <div className="border-border/40 bg-card min-w-0 rounded-xl border p-3">
                <span className="text-muted-foreground mb-0.5 flex items-center gap-1 font-medium">
                  <Cpu className="h-3 w-3 shrink-0 text-indigo-500" />
                  Dòng PLC áp dụng:
                </span>
                <span className="text-foreground font-semibold wrap-break-word">
                  {device.applicableModels}
                </span>
              </div>
            </div>

            {/* Ladder Code Example */}
            {device.ladderExample && (
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-muted-foreground flex items-center gap-1.5 truncate text-xs font-semibold tracking-wider uppercase">
                    <Code className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    Ví dụ đoạn lệnh Ladder
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 shrink-0 px-2 text-[11px]"
                    onClick={() =>
                      handleCopyText("ladder", device.ladderExample)
                    }
                  >
                    {copiedType === "ladder" ? (
                      <Check className="mr-1 h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="mr-1 h-3 w-3" />
                    )}
                    Sao chép
                  </Button>
                </div>
                <ScrollArea className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 sm:p-3.5">
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre text-slate-100">
                    <code>{device.ladderExample}</code>
                  </pre>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}

            {/* Technical Notes & Warnings */}
            {device.notes && (
              <div className="min-w-0 space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs sm:p-3.5">
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  Lưu ý kỹ thuật:
                </span>
                <p className="leading-relaxed wrap-break-word text-amber-900 dark:text-amber-200">
                  {device.notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
