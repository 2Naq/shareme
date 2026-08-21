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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="border-border/50 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono text-2xl font-black">
                {device.id}
              </span>
              <Badge
                variant="outline"
                className={`font-mono text-xs uppercase ${
                  isBit
                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}
              >
                {isBit ? "Special Bit Device (M)" : "Special Word Device (D)"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`font-mono text-xs ${rwColor}`}
              >
                Quyền: {device.rw}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                onClick={() => handleCopyText("id", device.id)}
              >
                {copiedType === "id" ? (
                  <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="mr-1 h-3.5 w-3.5" />
                )}
                Sao chép mã
              </Button>
            </div>
          </div>
          <DialogTitle className="text-foreground mt-2 text-lg font-bold">
            {device.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm">
            {device.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Detailed Description */}
          <div className="space-y-1.5">
            <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <Info className="text-primary h-3.5 w-3.5" />
              Mô tả chi tiết & Cơ chế hoạt động
            </h4>
            <p className="text-foreground/90 bg-muted/30 border-border/40 rounded-xl border p-3.5 text-sm leading-relaxed">
              {device.description}
            </p>
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div className="border-border/40 bg-card rounded-xl border p-3">
              <span className="text-muted-foreground mb-0.5 block font-medium">
                Giá trị khởi tạo / Trạng thái:
              </span>
              <span className="text-foreground font-semibold">
                {device.initialValue}
              </span>
            </div>
            <div className="border-border/40 bg-card rounded-xl border p-3">
              <span className="text-muted-foreground mb-0.5 flex items-center gap-1 font-medium">
                <Cpu className="h-3 w-3 text-indigo-500" />
                Dòng PLC áp dụng:
              </span>
              <span className="text-foreground font-semibold">
                {device.applicableModels}
              </span>
            </div>
          </div>

          {/* Ladder Code Example */}
          {device.ladderExample && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                  <Code className="h-3.5 w-3.5 text-emerald-500" />
                  Ví dụ đoạn lệnh Ladder (Mnemonic)
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-6 px-2 text-[11px]"
                  onClick={() => handleCopyText("ladder", device.ladderExample)}
                >
                  {copiedType === "ladder" ? (
                    <Check className="mr-1 h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="mr-1 h-3 w-3" />
                  )}
                  Sao chép Ladder
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-slate-100">
                <code>{device.ladderExample}</code>
              </pre>
            </div>
          )}

          {/* Technical Notes & Warnings */}
          {device.notes && (
            <div className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs">
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Lưu ý kỹ thuật:
              </span>
              <p className="leading-relaxed text-amber-900 dark:text-amber-200">
                {device.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
