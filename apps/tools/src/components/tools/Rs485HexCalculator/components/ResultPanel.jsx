import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function ResultPanel({
  binaryFormatted,
  hexCode,
  ladderCommand,
  hexInput,
  hexError,
  onHexInput,
  onHexFocus,
  onHexBlur,
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

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
              className={`font-mono text-2xl font-black tracking-wider h-12 ${
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
      </CardContent>
    </Card>
  );
}
