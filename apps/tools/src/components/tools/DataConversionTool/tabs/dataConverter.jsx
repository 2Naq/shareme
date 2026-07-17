import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultRow from "../components/resultRow";
import { toHex } from "../utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export default function DataConverter() {
  const [decVal, setDecVal] = useState("65535");
  const [hexVal, setHexVal] = useState("FFFF");
  const [isSigned, setIsSigned] = useState(false);
  const [wordSize, setWordSize] = useState("16");

  const bits = parseInt(wordSize, 10);
  const maxUnsigned = Math.pow(2, bits) - 1;

  const syncDec = (raw) => {
    setDecVal(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n)) {
      const clamped = clampUint(Math.abs(n), bits);
      setHexVal(toHex(clamped, bits / 4));
    }
  };

  const syncHex = (raw) => {
    const upper = raw.toUpperCase();
    setHexVal(upper);
    const n = parseInt(upper, 16);
    if (!isNaN(n)) {
      setDecVal(
        isSigned && n > maxUnsigned / 2
          ? (n - maxUnsigned - 1).toString()
          : n.toString(),
      );
    }
  };

  const decNum = parseInt(decVal, 10);
  const hexNum = parseInt(hexVal, 16);
  const isValidDec = !isNaN(decNum);
  const isValidHex = !isNaN(hexNum);

  // Byte / Word swap helpers
  const doByteSwap = (val16) => {
    const lo = val16 & 0xff;
    const hi = (val16 >> 8) & 0xff;
    return (lo << 8) | hi;
  };

  const doWordSwap = (val32) => {
    const lo = val32 & 0xffff;
    const hi = (val32 >> 16) & 0xffff;
    return ((lo << 16) | hi) >>> 0;
  };

  const hexNum16 = hexNum & 0xffff;
  const hexNum32 = hexNum & 0xffffffff;
  const byteSwapped = isValidHex ? doByteSwap(hexNum16) : null;
  const wordSwapped = isValidHex ? doWordSwap(hexNum32) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Decimal ↔ Hex / Byte & Word Swap
          </CardTitle>
          <CardDescription>
            Chuyển đổi Dec↔Hex và hoán đổi byte/word trong thanh ghi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-center flex-wrap">
            <div className="space-y-1 flex-1 min-w-[120px]">
              <Label className="text-xs">Kích cỡ (bit)</Label>
              <Select value={wordSize} onValueChange={setWordSize}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8-bit (Byte)</SelectItem>
                  <SelectItem value="16">16-bit (Word)</SelectItem>
                  <SelectItem value="32">32-bit (DWord)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Có dấu (Signed)</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant={!isSigned ? "default" : "outline"}
                  onClick={() => setIsSigned(false)}
                >
                  Unsigned
                </Button>
                <Button
                  size="sm"
                  variant={isSigned ? "default" : "outline"}
                  onClick={() => setIsSigned(true)}
                >
                  Signed
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Thập phân (Dec)</Label>
              <Input
                className="font-mono"
                value={decVal}
                onChange={(e) => syncDec(e.target.value)}
                placeholder="VD: 1000"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Thập lục phân (Hex)</Label>
              <Input
                className="font-mono uppercase"
                value={hexVal}
                onChange={(e) => syncHex(e.target.value)}
                placeholder="VD: 03E8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kết quả chuyển đổi</CardTitle>
          </CardHeader>
          <CardContent>
            {isValidDec && (
              <>
                <ResultRow label="Decimal" value={decVal} />
                <ResultRow
                  label="Hexadecimal"
                  value={`0x${hexVal.padStart(bits / 4, "0")}`}
                />
                <ResultRow
                  label="Binary"
                  value={decNum.toString(2).padStart(bits, "0")}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Byte Swap & Word Swap
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isValidHex ? (
              <>
                <ResultRow
                  label={`Giá trị gốc (16-bit)`}
                  value={`0x${toHex(hexNum16, 4)}`}
                />
                <ResultRow
                  label="Byte Swap (đảo 2 byte)"
                  value={
                    byteSwapped !== null
                      ? `0x${toHex(byteSwapped, 4)} (${byteSwapped})`
                      : "-"
                  }
                />
                <ResultRow
                  label={`Giá trị gốc (32-bit)`}
                  value={`0x${toHex(hexNum32, 8)}`}
                />
                <ResultRow
                  label="Word Swap (đảo 2 word)"
                  value={
                    wordSwapped !== null
                      ? `0x${toHex(wordSwapped, 8)} (${wordSwapped})`
                      : "-"
                  }
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nhập giá trị HEX hợp lệ.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
