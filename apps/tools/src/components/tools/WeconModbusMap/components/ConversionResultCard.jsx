import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function CopyValueBox({ label, sublabel, value, highlight = false, badgeText, onCopy, copiedValue }) {
  const isCopied = copiedValue === String(value);

  return (
    <div
      onClick={() => onCopy(String(value))}
      className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all hover:shadow-md ${
        highlight
          ? "border-primary/40 bg-primary/5 hover:border-primary"
          : "border-border/60 bg-background/60 hover:border-foreground/30"
      }`}
      title={`Nhấn để sao chép: ${value}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1">
          {badgeText && (
            <Badge
              variant={highlight ? "default" : "secondary"}
              className="px-1.5 py-0 font-mono text-[10px]"
            >
              {badgeText}
            </Badge>
          )}
          <span className="text-muted-foreground group-hover:text-foreground rounded p-0.5 transition-colors">
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span
          className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
            highlight ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </span>
      </div>

      {sublabel && (
        <span className="text-muted-foreground mt-1 text-[11px] leading-snug">
          {sublabel}
        </span>
      )}
    </div>
  );
}

function ReverseMatchItem({ title, subtitle, isHighlight, result, onSelectDevice, onCopy, copiedValue }) {
  if (!result) return null;

  const { addr0, addr1, hex, bitMatch, wordMatch } = result;

  const renderSpaceCard = (spaceTitle, match, isBit) => {
    return (
      <div
        className={`flex flex-col justify-between rounded-xl border p-4 ${
          match.found
            ? isBit
              ? "border-indigo-500/30 bg-indigo-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
            : "border-border/50 bg-muted/20"
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`font-mono text-xs ${
                isBit
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {spaceTitle}
            </Badge>
            {match.found && (
              <span className="text-muted-foreground font-mono text-xs">
                FC: {match.rule.functionCodes.join(" / ")}
              </span>
            )}
          </div>

          {match.found ? (
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground font-mono text-2xl font-extrabold sm:text-3xl">
                    {match.device}
                  </span>
                  {match.radix === 8 && (
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      Hệ Bát Phân (Octal) = {match.index} Dec
                    </Badge>
                  )}
                  {match.wordPart && (
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {match.wordPart}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(match.device)}
                    className="h-8 gap-1 rounded-lg font-mono text-xs"
                  >
                    {copiedValue === match.device ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectDevice(match.device)}
                    className="h-8 gap-1 rounded-lg text-xs"
                    title={`Xem chi tiết ${match.device}`}
                  >
                    Chi tiết
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-foreground/90 mt-1 text-xs font-semibold">
                {match.rule.label} ({match.rule.rangeText})
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {match.rule.description}
              </p>

              {match.isReservedGap && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Lưu ý: Địa chỉ này nằm trong vùng dự phòng mở rộng của{" "}
                    <strong>{match.rule.prefix}</strong> (vượt quá phạm vi chuẩn{" "}
                    {match.rule.rangeText}).
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground py-3 text-xs">
              Địa chỉ <code className="font-mono font-bold">{addr0}</code> ({hex}) nằm
              trong <strong>Vùng dự phòng (Reserved)</strong> của bảng{" "}
              {isBit ? "Bit (Coil)" : "Word (Register)"}.
            </div>
          )}
        </div>

        {match.found && (
          <div className="border-border/50 text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 font-mono text-[11px]">
            <span>Weintek: {match.weintekTag}</span>
            <span>0-based: {addr0}</span>
            <span>Hex: {hex}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`space-y-4 rounded-2xl border p-4 sm:p-5 ${
        isHighlight
          ? "border-primary/40 bg-card shadow-sm"
          : "border-border/60 bg-card/60"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-foreground text-sm font-bold sm:text-base">
              {title}
            </h4>
            {isHighlight && (
              <Badge className="font-mono text-[11px]">Khuyên dùng cho HMI Weintek</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="outline" className="px-2.5 py-1">
            0-based (PLC): <strong>{addr0}</strong>
          </Badge>
          <Badge variant="outline" className="px-2.5 py-1">
            1-based (+1): <strong>{addr1}</strong>
          </Badge>
          <Badge variant="secondary" className="px-2.5 py-1">
            HEX: <strong>{hex}</strong>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderSpaceCard("Bảng Bit (Coil - 0x)", bitMatch, true)}
        {renderSpaceCard("Bảng Word (Register - 4x)", wordMatch, false)}
      </div>
    </div>
  );
}

export function ConversionResultCard({
  analysis,
  offsetPreference,
  onSelectDevice,
}) {
  const { copyToClipboard } = useCopyToClipboard();
  const [copiedValue, setCopiedValue] = useState(null);

  const handleCopy = (val) => {
    setCopiedValue(val);
    copyToClipboard(val, `Đã sao chép: ${val}`);
    setTimeout(() => setCopiedValue(null), 1800);
  };

  if (!analysis) {
    return null;
  }

  if (!analysis.isValid) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1 text-sm">
          <p className="font-semibold">Không thể ánh xạ địa chỉ</p>
          <p className="text-xs leading-relaxed">{analysis.error}</p>
        </div>
      </div>
    );
  }

  // CHẾ ĐỘ 1: FORWARD (PLC DEVICE -> MODBUS)
  if (analysis.mode === "forward") {
    return (
      <div className="space-y-4">
        {analysis.results.map((item) => {
          const isBit = item.space === "bit";
          return (
            <div
              key={`${item.space}-${item.device}`}
              className="border-border/60 bg-card space-y-4 rounded-2xl border p-4 shadow-xs sm:p-6"
            >
              {/* Header của từng vùng nhớ (Bit hoặc Word) */}
              <div className="border-border/50 flex flex-wrap items-start justify-between gap-3 border-b pb-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-primary font-mono text-2xl font-extrabold sm:text-3xl">
                      {item.device}
                    </span>
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs ${
                        isBit
                          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {item.spaceLabel}
                    </Badge>
                    {item.radix === 8 && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        Hệ Bát Phân (Octal) = {item.decimalIndex} (Thập phân)
                      </Badge>
                    )}
                    {item.is32Bit && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-mono text-xs">
                        32-bit (Chiếm 2 Word liên tiếp)
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground text-sm font-medium">
                    {item.rule.label} • Phạm vi chuẩn:{" "}
                    <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                      {item.rule.rangeText}
                    </code>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.rule.description}
                  </p>
                </div>

                {/* Trạng thái hợp lệ & Function Codes */}
                <div className="flex flex-col items-end gap-1.5">
                  {item.inStandardRange ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Trong phạm vi chuẩn
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Vượt phạm vi chuẩn ({item.rule.rangeText})
                    </Badge>
                  )}
                  <span className="text-muted-foreground font-mono text-xs">
                    Modbus FC: <strong>{item.rule.functionCodes.join(", ")}</strong> •{" "}
                    {item.rule.rw}
                  </span>
                </div>
              </div>

              {/* 4 Ô kết quả chính (Click để Copy) */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <CopyValueBox
                  label="Modbus 1-Based (HMI Weintek)"
                  sublabel="Cộng +1 (Bắt đầu từ 1 trên EasyBuilder Pro / SCADA)"
                  value={item.addr1}
                  highlight={true}
                  badgeText="+1 Offset"
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />

                <CopyValueBox
                  label="Modbus 0-Based (Chuẩn PLC)"
                  sublabel="Địa chỉ thập phân gốc dùng trong lệnh RS / SERIAL_MODBUS"
                  value={item.addr0}
                  badgeText="0-Based"
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />

                <CopyValueBox
                  label="Địa chỉ HEX (Protocol Frame)"
                  sublabel={`Khung truyền thông: [${item.hexFrameBytes}] (Hi-Lo)`}
                  value={item.hex}
                  badgeText="HEX 16-bit"
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />

                <CopyValueBox
                  label="Ký hiệu Tag Weintek / Modbus"
                  sublabel={`Chuẩn Modbus 6 số: ${item.modbus6Digit}`}
                  value={item.weintekTag}
                  badgeText={item.rule.weintekPrefix}
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />
              </div>

              {/* Giải thích công thức tính */}
              <div className="bg-muted/50 border-border/50 flex flex-col justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Info className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground">Công thức ánh xạ:</span>
                  <code className="text-foreground font-mono font-semibold">
                    {item.formula}
                  </code>
                </div>
                {item.is32Bit && (
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px] font-medium">
                    Low Word = {item.addr0} (+1: {item.addr1}) | High Word ={" "}
                    {item.highWordAddr0} (+1: {item.highWordAddr1})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // CHẾ ĐỘ 2: REVERSE (MODBUS ADDRESS -> PLC DEVICE)
  const show1Based =
    offsetPreference === "both" || offsetPreference === "1-based";
  const show0Based =
    offsetPreference === "both" || offsetPreference === "0-based";

  return (
    <div className="space-y-4">
      {show1Based && analysis.oneBasedResult && (
        <ReverseMatchItem
          title={`Kết quả theo chuẩn 1-Based (+1 Offset — Màn hình HMI Weintek / EasyBuilder Pro)`}
          subtitle={`Hiểu "${analysis.query}" là địa chỉ đã cộng +1 (Địa chỉ 0-based thực tế trong khung truyền thông = ${analysis.numericValue} - 1 = ${analysis.oneBasedResult.addr0} / ${analysis.oneBasedResult.hex})`}
          isHighlight={true}
          result={analysis.oneBasedResult}
          onSelectDevice={onSelectDevice}
          onCopy={handleCopy}
          copiedValue={copiedValue}
        />
      )}

      {show0Based && analysis.zeroBasedResult && (
        <ReverseMatchItem
          title={`Kết quả theo chuẩn 0-Based (0 Offset — Địa chỉ gốc trong lệnh PLC / Khung Hex)`}
          subtitle={`Hiểu "${analysis.query}" là địa chỉ gốc 0-based của PLC (Khi đưa lên HMI Weintek cần +1 thành ${analysis.zeroBasedResult.addr1})`}
          isHighlight={offsetPreference === "0-based"}
          result={analysis.zeroBasedResult}
          onSelectDevice={onSelectDevice}
          onCopy={handleCopy}
          copiedValue={copiedValue}
        />
      )}
    </div>
  );
}
