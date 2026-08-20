import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

/**
 * Phân tích chuỗi nhị phân 16-bit thành 4 nibble hex
 * Trả về mảng [{binary: "0000", hex: "0"}, ...]
 */
function parseNibbles(binaryFormatted) {
  const raw = binaryFormatted.replace(/\s/g, "");
  const nibbles = [];
  for (let i = 0; i < raw.length; i += 4) {
    const chunk = raw.substring(i, i + 4);
    const hexDigit = parseInt(chunk, 2).toString(16).toUpperCase();
    nibbles.push({ binary: chunk, hex: hexDigit });
  }
  return nibbles;
}

export default function ResultPanel({
  binaryFormatted,
  hexCode,
  ladderCommand,
  hexInput,
  hexError,
  onHexInput,
  onHexFocus,
  onHexBlur,
  register = "D8120",
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const nibbles = useMemo(
    () => parseNibbles(binaryFormatted),
    [binaryFormatted],
  );

  // Lấy mã hex thuần (không có H)
  const pureHex = hexCode.replace(/^H/i, "");

  return (
    <Card className="bg-primary/5 border-primary/20 max-w-sm">
      <CardHeader>
        <CardTitle className="text-primary">Kết quả</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-primary text-xs tracking-wider uppercase">
            Chuỗi nhị phân 16-bit
          </Label>
          <div className="text-foreground mt-1 font-mono text-lg font-bold tracking-widest">
            {binaryFormatted}
          </div>
        </div>

        <div>
          <Label className="text-primary text-xs tracking-wider uppercase">
            Mã Hex (nhập để tra ngược)
          </Label>
          <div className="mt-1 flex items-center gap-2">
            <Input
              value={hexInput || hexCode}
              onChange={(e) => onHexInput(e.target.value)}
              onFocus={onHexFocus}
              onBlur={onHexBlur}
              placeholder="VD: H8081 hoặc 8081"
              className={`h-12 font-mono text-2xl font-black tracking-wider ${
                hexError
                  ? "border-destructive text-destructive"
                  : "text-primary border-primary/30 focus-visible:ring-primary/30"
              }`}
            />
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-12 w-12 shrink-0"
              onClick={() => copyToClipboard(hexCode)}
              title="Sao chép mã Hex"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {hexError && (
            <p className="text-destructive mt-1 text-xs">{hexError}</p>
          )}
        </div>

        {/* ── Ví dụ lệnh ── */}
        <div>
          <Label className="text-primary text-xs tracking-wider uppercase">
            Ví dụ
          </Label>
          <div className="bg-secondary mt-1 flex w-full items-center justify-between gap-2 rounded-lg border p-3">
            <span className="text-secondary-foreground truncate font-mono text-base">
              {ladderCommand}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
              onClick={() => copyToClipboard(ladderCommand)}
              title="Sao chép lệnh"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {/* ── Sơ đồ Ladder ── */}
        <div>
          <Label className="text-primary text-xs tracking-wider uppercase">
            Chương trình Ladder
          </Label>
          <div className="bg-background mt-2 overflow-x-auto rounded-lg border p-3">
            {/* Hàng trên: Rung ladder */}
            <div className="flex items-center gap-0 font-mono text-xs">
              {/* Contact M8002 */}
              <div className="flex flex-col items-center">
                <div className="border-foreground/30 text-foreground rounded border px-1.5 py-0.5 text-[10px] font-semibold">
                  M8002
                </div>
              </div>
              {/* Line */}
              <div className="bg-foreground/30 h-px flex-1" />
              {/* Coil MOV */}
              <div className="border-foreground/30 flex items-center overflow-hidden rounded border">
                <div className="bg-muted border-foreground/30 border-r px-2 py-1 text-center">
                  <div className="text-foreground font-bold">MOV</div>
                </div>
                <div className="border-foreground/30 border-r px-2 py-1 text-center">
                  <div className="text-primary font-bold">H{pureHex}</div>
                </div>
                <div className="px-2 py-1 text-center">
                  <div className="text-foreground font-bold">{register}</div>
                </div>
              </div>
              {/* End line */}
              <div className="bg-foreground/30 h-px w-2" />
            </div>

            {/* Hàng dưới: Phân tích bit */}
            <div className="mt-4 flex items-start gap-1 font-mono text-[10px]">
              <span className="text-foreground mt-1 mr-1 font-bold">
                {register} = [
              </span>
              <div className="flex items-start gap-0">
                {nibbles.map((nibble, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Label bit */}
                    {i === 0 && (
                      <div className="text-muted-foreground mb-0.5 text-[9px]">
                        b15
                      </div>
                    )}
                    {i === nibbles.length - 1 && (
                      <div className="text-muted-foreground mb-0.5 ml-auto text-[9px]">
                        b0
                      </div>
                    )}
                    {i > 0 && i < nibbles.length - 1 && (
                      <div className="mb-0.5 text-[9px] text-transparent">
                        .
                      </div>
                    )}
                    {/* Binary */}
                    <div className="border-foreground/20 bg-muted/50 text-foreground rounded-sm border px-1.5 py-0.5 font-semibold tracking-wider">
                      {nibble.binary}
                    </div>
                    {/* Hex digit */}
                    <div className="text-primary mt-0.5 font-bold">
                      {nibble.hex}
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-foreground mt-1 ml-1 font-bold">]</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
