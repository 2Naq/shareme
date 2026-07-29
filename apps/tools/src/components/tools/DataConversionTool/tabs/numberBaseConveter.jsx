import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ResultRow from "../components/resultRow";
import { toHex } from "../utils";

export default function NumberBaseConverter() {
  const [dec, setDec] = useState("255");
  const [hex, setHex] = useState("FF");
  const [bin, setBin] = useState("11111111");
  const [oct, setOct] = useState("377");

  const sync = useCallback((source, raw) => {
    let num = NaN;
    if (source === "dec") num = parseInt(raw, 10);
    else if (source === "hex") num = parseInt(raw, 16);
    else if (source === "bin") num = parseInt(raw, 2);
    else if (source === "oct") num = parseInt(raw, 8);

    if (isNaN(num) || num < 0) {
      if (source === "dec") setDec(raw);
      if (source === "hex") setHex(raw.toUpperCase());
      if (source === "bin") setBin(raw);
      if (source === "oct") setOct(raw);
      return;
    }

    setDec(num.toString(10));
    setHex(num.toString(16).toUpperCase());
    setBin(num.toString(2));
    setOct(num.toString(8));
  }, []);

  const numVal = parseInt(dec, 10);
  const isValid = !isNaN(numVal) && numVal >= 0;
  const lo8 = isValid ? numVal & 0xff : 0;
  const hi8 = isValid ? (numVal >> 8) & 0xff : 0;
  const lo16 = isValid ? numVal & 0xffff : 0;
  const hi16 = isValid ? (numVal >> 16) & 0xffff : 0;
  const binPadded16 = isValid
    ? numVal.toString(2).padStart(16, "0").slice(-16)
    : "0".repeat(16);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhập giá trị</CardTitle>
          <CardDescription>
            Nhập vào bất kỳ ô nào — các ô còn lại tự cập nhật.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Thập phân (Dec)", value: dec, id: "dec" },
            { label: "Thập lục phân (Hex)", value: hex, id: "hex" },
            { label: "Nhị phân (Bin)", value: bin, id: "bin" },
            { label: "Bát phân (Oct)", value: oct, id: "oct" },
          ].map(({ label, value, id }) => (
            <div key={id} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                className="font-mono"
                value={value}
                onChange={(e) => sync(id, e.target.value)}
                placeholder={`Nhập ${label.toLowerCase()}...`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Result breakdown */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Phân tích Byte / Word</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultRow
              label="Low Byte (Byte 0)"
              value={`${lo8} / 0x${toHex(lo8, 2)}`}
            />
            <ResultRow
              label="High Byte (Byte 1)"
              value={`${hi8} / 0x${toHex(hi8, 2)}`}
            />
            <ResultRow
              label="Low Word (Word 0 — 16-bit)"
              value={`${lo16} / 0x${toHex(lo16, 4)}`}
            />
            <ResultRow
              label="High Word (Word 1 — 16-bit)"
              value={`${hi16} / 0x${toHex(hi16, 4)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Bit Map (16 bit thấp nhất)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap">
              {binPadded16.split("").map((bit, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] text-muted-foreground">
                    {15 - i}
                  </span>
                  <Badge
                    variant={bit === "1" ? "default" : "outline"}
                    className="font-mono text-xs w-7 h-7 flex items-center justify-center p-0 rounded-md"
                  >
                    {bit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
