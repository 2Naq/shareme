import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toHex, crc16Modbus } from "../utils";
import CopyBtn from "@/components/btnCoppy";
import { Badge } from "@/components/ui/badge";

const MODBUS_FUNCTIONS = [
  { label: "FC01 — Read Coils", value: "01" },
  { label: "FC02 — Read Discrete Inputs", value: "02" },
  { label: "FC03 — Read Holding Registers", value: "03" },
  { label: "FC04 — Read Input Registers", value: "04" },
  { label: "FC05 — Write Single Coil", value: "05" },
  { label: "FC06 — Write Single Register", value: "06" },
  { label: "FC10 — Write Multiple Registers", value: "10" },
  { label: "FC0F — Write Multiple Coils", value: "0F" },
];

export default function ModbusFrameBuilder() {
  const [slaveId, setSlaveId] = useState("01");
  const [fc, setFc] = useState("03");
  const [startAddr, setStartAddr] = useState("0000");
  const [quantity, setQuantity] = useState("000A");
  const [writeData, setWriteData] = useState("03 E8");

  const isWriteSingle = fc === "05" || fc === "06";
  const isWriteMulti = fc === "10" || fc === "0F";
  const isWrite = isWriteSingle || isWriteMulti;

  const buildFrame = () => {
    try {
      const sid = parseInt(slaveId, 16);
      const fcByte = parseInt(fc, 16);
      const addrHi = parseInt(startAddr, 16) >> 8;
      const addrLo = parseInt(startAddr, 16) & 0xff;
      const qtyHi = parseInt(quantity, 16) >> 8;
      const qtyLo = parseInt(quantity, 16) & 0xff;

      let bytes = [sid, fcByte, addrHi, addrLo];

      if (isWriteSingle) {
        const dataBytes = writeData
          .trim()
          .split(/\s+/)
          .map((b) => parseInt(b, 16))
          .filter((n) => !isNaN(n));
        bytes.push(qtyHi, qtyLo); // value for FC05/06
        // replace qty with data
        bytes = [sid, fcByte, addrHi, addrLo, ...dataBytes.slice(0, 2)];
      } else if (isWriteMulti) {
        const dataBytes = writeData
          .trim()
          .split(/\s+/)
          .map((b) => parseInt(b, 16))
          .filter((n) => !isNaN(n));
        const byteCount = dataBytes.length;
        bytes = [
          sid,
          fcByte,
          addrHi,
          addrLo,
          qtyHi,
          qtyLo,
          byteCount,
          ...dataBytes,
        ];
      } else {
        bytes.push(qtyHi, qtyLo);
      }

      const crc = crc16Modbus(bytes);
      const crcLo = crc & 0xff;
      const crcHi = (crc >> 8) & 0xff;
      const fullFrame = [...bytes, crcLo, crcHi];
      return fullFrame.map((b) => toHex(b, 2)).join(" ");
    } catch {
      return "Lỗi — kiểm tra lại dữ liệu đầu vào.";
    }
  };

  const frame = buildFrame();
  const frameBytes = frame.split(" ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modbus RTU Frame Builder</CardTitle>
          <CardDescription>
            Tạo khung Modbus RTU kèm CRC16 tự động.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Slave ID (HEX)</Label>
              <Input
                className="font-mono uppercase"
                value={slaveId}
                onChange={(e) => setSlaveId(e.target.value.toUpperCase())}
                placeholder="01"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Function Code</Label>
              <Select value={fc} onValueChange={setFc}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODBUS_FUNCTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Start Address (HEX)</Label>
              <Input
                className="font-mono uppercase"
                value={startAddr}
                onChange={(e) => setStartAddr(e.target.value.toUpperCase())}
                placeholder="0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">
                {isWriteSingle ? "Giá trị ghi (HEX)" : "Số lượng"} (HEX)
              </Label>
              <Input
                className="font-mono uppercase"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.toUpperCase())}
                placeholder="000A"
              />
            </div>
          </div>

          {isWrite && !isWriteSingle && (
            <div className="space-y-2">
              <Label className="text-xs">
                Dữ liệu ghi (HEX bytes, cách nhau bởi khoảng trắng)
              </Label>
              <Input
                className="font-mono"
                value={writeData}
                onChange={(e) => setWriteData(e.target.value)}
                placeholder="03 E8 01 90"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary text-base">RTU Frame</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-background rounded-lg border font-mono text-sm break-all flex items-start justify-between gap-2">
            <span>{frame}</span>
            <CopyBtn value={frame} className="shrink-0" />
          </div>

          {!frame.startsWith("Lỗi") && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Phân tích khung
              </span>
              <div className="flex gap-1 flex-wrap">
                {frameBytes.map((byte, i) => {
                  let label = "";
                  if (i === 0) label = "ID";
                  else if (i === 1) label = "FC";
                  else if (i === 2) label = "Addr Hi";
                  else if (i === 3) label = "Addr Lo";
                  else if (i === frameBytes.length - 2) label = "CRC Lo";
                  else if (i === frameBytes.length - 1) label = "CRC Hi";
                  else label = `D${i - 4}`;

                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <span className="text-[9px] text-muted-foreground leading-none">
                        {label}
                      </span>
                      <Badge
                        variant={
                          i === 0 || i === 1
                            ? "default"
                            : i >= frameBytes.length - 2
                              ? "secondary"
                              : "outline"
                        }
                        className="font-mono text-xs px-1.5 py-0.5 rounded"
                      >
                        {byte}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
