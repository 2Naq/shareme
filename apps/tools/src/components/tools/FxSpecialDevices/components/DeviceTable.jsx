import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function DeviceTable({ devices, onSelectDevice }) {
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
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn
          bộ danh sách.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card w-full overflow-x-auto rounded-2xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground border-border/60 border-b text-xs font-semibold uppercase">
          <tr>
            <th scope="col" className="w-28 px-4 py-3.5">
              Mã Device
            </th>
            <th scope="col" className="w-24 px-4 py-3.5">
              Loại
            </th>
            <th scope="col" className="min-w-45 px-4 py-3.5">
              Tên chức năng
            </th>
            <th scope="col" className="min-w-70 px-4 py-3.5">
              Mô tả chi tiết
            </th>
            <th scope="col" className="w-24 px-4 py-3.5 text-center">
              R/W
            </th>
            <th scope="col" className="w-24 px-4 py-3.5 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/40 divide-y">
          {devices.map((device) => {
            const isBit = device.type === "bit";
            const rwColor =
              device.rw === "R"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                : device.rw === "W"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

            return (
              <tr
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className="hover:bg-muted/40 group cursor-pointer transition-colors"
              >
                {/* Device Code */}
                <td className="text-foreground px-4 py-3 font-mono font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="group-hover:text-primary text-base transition-colors">
                      {device.id}
                    </span>
                  </div>
                </td>

                {/* Type Badge */}
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[11px] uppercase ${
                      isBit
                        ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {isBit ? "Bit (M)" : "Word (D)"}
                  </Badge>
                </td>

                {/* Name */}
                <td className="text-foreground px-4 py-3 font-medium">
                  {device.name}
                </td>

                {/* Summary */}
                <td className="text-muted-foreground line-clamp-2 px-4 py-3 text-xs">
                  {device.summary}
                </td>

                {/* R/W */}
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[11px] ${rwColor}`}
                  >
                    {device.rw}
                  </Badge>
                </td>

                {/* Action buttons */}
                <td className="px-4 py-3 text-right">
                  <div
                    className="flex items-center justify-end gap-1"
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
                      size="icon"
                      className="text-muted-foreground hover:text-primary h-7 w-7"
                      onClick={() => onSelectDevice(device)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
