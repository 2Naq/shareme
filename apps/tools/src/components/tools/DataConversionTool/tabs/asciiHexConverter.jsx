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
import { toHex } from "../utils";
import { ArrowLeftRight } from "lucide-react";

export default function AsciiHexConverter() {
  const [ascii, setAscii] = useState("Hello World");
  const [hex, setHex] = useState("48 65 6C 6C 6F 20 57 6F 72 6C 64");

  const syncFromAscii = (text) => {
    setAscii(text);
    const h = text
      .split("")
      .map((c) => toHex(c.charCodeAt(0), 2))
      .join(" ");
    setHex(h);
  };

  const syncFromHex = (raw) => {
    setHex(raw.toUpperCase());
    try {
      const bytes = raw
        .trim()
        .split(/\s+/)
        .map((t) => parseInt(t, 16))
        .filter((n) => !isNaN(n));
      setAscii(bytes.map((b) => String.fromCharCode(b)).join(""));
    } catch {
      setAscii("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ASCII ↔ HEX Converter</CardTitle>
          <CardDescription>
            Chuyển đổi qua lại giữa chuỗi ASCII và chuỗi HEX bytes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Văn bản ASCII</Label>
            <Input
              value={ascii}
              onChange={(e) => syncFromAscii(e.target.value)}
              placeholder="Nhập văn bản..."
            />
          </div>
          <div className="flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <Label>HEX Bytes</Label>
            <Input
              className="font-mono uppercase"
              value={hex}
              onChange={(e) => syncFromHex(e.target.value)}
              placeholder="VD: 48 65 6C 6C 6F"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bảng ASCII Reference</CardTitle>
          <CardDescription>
            Các ký tự ASCII thường dùng trong truyền thông công nghiệp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-1 text-xs">
            {[
              ["SOH", 0x01],
              ["STX", 0x02],
              ["ETX", 0x03],
              ["EOT", 0x04],
              ["ENQ", 0x05],
              ["ACK", 0x06],
              ["LF", 0x0a],
              ["CR", 0x0d],
              ["SP", 0x20],
              ["!", 0x21],
              ['"', 0x22],
              ["#", 0x23],
              ["0-9", 0x30],
              ["A", 0x41],
              ["Z", 0x5a],
              ["a", 0x61],
            ].map(([ch, code]) => (
              <div
                key={code}
                className="flex items-center justify-between gap-1 p-1.5 rounded bg-muted/40 border"
              >
                <span className="font-bold">{ch}</span>
                <span className="font-mono text-muted-foreground">
                  {toHex(code, 2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Kết quả hiện tại: {ascii.length} ký tự /{" "}
            {hex.split(/\s+/).filter(Boolean).length} bytes
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
