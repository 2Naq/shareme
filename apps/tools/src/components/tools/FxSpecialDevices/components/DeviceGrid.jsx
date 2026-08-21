import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronRight } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function DeviceGrid({ devices, onSelectDevice }) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    setCopiedId(text);
    copyToClipboard(text, `Đã sao chép ${text}!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!devices || devices.length === 0) {
    return (
      <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Không tìm thấy thiết bị nào phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => {
        const isBit = device.type === "bit";
        const rwColor =
          device.rw === "R"
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            : device.rw === "W"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

        return (
          <Card
            key={device.id}
            onClick={() => onSelectDevice(device)}
            className="hover:border-primary/50 group flex cursor-pointer flex-col justify-between transition-all hover:shadow-md"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-foreground group-hover:text-primary font-mono text-lg font-bold transition-colors">
                    {device.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] uppercase ${
                      isBit
                        ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {isBit ? "Bit (M)" : "Word (D)"}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono text-[11px] ${rwColor}`}
                >
                  {device.rw}
                </Badge>
              </div>
              <CardTitle className="text-foreground mt-1 line-clamp-1 text-sm font-semibold">
                {device.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground line-clamp-3 p-4 pt-1 pb-3 text-xs">
              {device.summary}
            </CardContent>

            <CardFooter className="border-border/40 bg-muted/20 flex items-center justify-between border-t p-4 pt-2 text-xs">
              <span className="text-muted-foreground/80 max-w-42.5 truncate text-[11px]">
                {device.applicableModels.split(",")[0]}...
              </span>
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-7 w-7"
                  onClick={(e) => handleCopy(e, device.id)}
                  title={`Sao chép ${device.id}`}
                >
                  {copiedId === device.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                  onClick={() => onSelectDevice(device)}
                >
                  Chi tiết
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
