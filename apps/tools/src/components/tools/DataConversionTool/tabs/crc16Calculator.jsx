import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultRow from "../components/resultRow";
import { crc16Modbus, toHex } from "../utils";
import { Button } from "@/components/ui/button";
import CopyBtn from "@/components/btnCoppy";

export default function Crc16Calculator() {
  const [input, setInput] = useState("01 03 00 00 00 0A");
  const [inputMode, setInputMode] = useState("hex"); // hex | ascii

  const parseBytes = (raw, mode) => {
    try {
      if (mode === "hex") {
        const tokens = raw.trim().split(/\s+/);
        return tokens.map((t) => parseInt(t, 16)).filter((n) => !isNaN(n));
      } else {
        return raw.split("").map((c) => c.charCodeAt(0));
      }
    } catch {
      return [];
    }
  };

  const bytes = parseBytes(input, inputMode);
  const crc = bytes.length > 0 ? crc16Modbus(bytes) : null;
  const crcLo = crc !== null ? crc & 0xff : null;
  const crcHi = crc !== null ? (crc >> 8) & 0xff : null;
  const fullFrame =
    crc !== null
      ? [...bytes, crcLo, crcHi].map((b) => toHex(b, 2)).join(" ")
      : "";

  return (
    <div className="grid grid-row-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CRC16 Modbus Calculator</CardTitle>
            <CardDescription>
              Tính CRC-16 theo chuẩn Modbus RTU (Polynomial 0xA001).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chế độ nhập</Label>
              <div className="flex gap-2">
                {["hex", "ascii"].map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={inputMode === m ? "default" : "outline"}
                    onClick={() => setInputMode(m)}
                  >
                    {m === "hex" ? "HEX Bytes" : "ASCII Text"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                {inputMode === "hex"
                  ? "HEX bytes (cách nhau bởi khoảng trắng)"
                  : "ASCII Text"}
              </Label>
              <Input
                className="font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  inputMode === "hex" ? "VD: 01 03 00 00 00 0A" : "VD: Hello"
                }
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Đã parse:{" "}
              <span className="font-mono font-semibold">{bytes.length}</span>{" "}
              bytes
              {bytes.length > 0 && (
                <span className="ml-2 font-mono text-foreground">
                  [{bytes.map((b) => toHex(b, 2)).join(" ")}]
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-base">
              Kết quả CRC16
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crc !== null ? (
              <>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    CRC Value
                  </span>
                  <div className="font-mono text-4xl font-black text-primary">
                    0x{toHex(crc, 4)}
                  </div>
                  <div className="font-mono text-sm text-muted-foreground mt-1">
                    Decimal: {crc}
                  </div>
                </div>
                <ResultRow
                  label="CRC Low Byte (gửi trước)"
                  value={`0x${toHex(crcLo, 2)} (${crcLo})`}
                />
                <ResultRow
                  label="CRC High Byte (gửi sau)"
                  value={`0x${toHex(crcHi, 2)} (${crcHi})`}
                />
                <div className="space-y-1 pt-2 border-t">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                    Full Frame (kèm CRC)
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-background rounded-lg border">
                    <span className="font-mono text-sm text-foreground break-all">
                      {fullFrame}
                    </span>
                    <CopyBtn value={fullFrame} />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nhập dữ liệu hợp lệ để xem kết quả.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <AccordionBorders className="w-full" />
    </div>
  );
}

const items = [
  {
    title: "Khái niệm",
    content:
      "CRC16 (Cyclic Redundancy Check 16-bit) là mã kiểm tra lỗi 16-bit (2 byte) được đặt ở cuối mỗi khung truyền Modbus RTU.",
  },
  {
    title: "Cách hoạt động",
    content:
      "Thuật toán CRC16 tính toán toàn bộ dữ liệu trong khung truyền để tạo ra một giá trị kiểm tra duy nhất.",
  },
  {
    title: "Vai trò",
    content:
      "Thiết bị nhận sẽ tính lại CRC và so sánh với CRC nhận được để phát hiện lỗi truyền thông do nhiễu hoặc sai lệch dữ liệu.",
  },
];

function AccordionBorders() {
  return (
    <Accordion
      multiple
      className="rounded-lg border"
      defaultValue={["Khái niệm"]}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.title}
          value={item.title}

          className="border-b px-4 last:border-b-0"
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
