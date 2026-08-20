import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  DATA_LENGTH_OPTIONS,
  PARITY_OPTIONS,
  STOP_BIT_OPTIONS,
  BAUD_OPTIONS,
  PROTOCOL_OPTIONS,
} from "./constants";

export default function LE3UFormFields({
  dataLength,
  setDataLength,
  parity,
  setParity,
  stopBit,
  setStopBit,
  baud,
  setBaud,
  protocol,
  setProtocol,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* BIT 0 */}
      <div className="space-y-2">
        <Label>Độ dài dữ liệu (Bit 0)</Label>
        <Select value={dataLength} onValueChange={setDataLength}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn độ dài">
              {dataLength
                ? `${DATA_LENGTH_OPTIONS.find((opt) => opt.value === dataLength)?.label} (${dataLength})`
                : "Chọn độ dài"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {DATA_LENGTH_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 2-1 */}
      <div className="space-y-2">
        <Label>Parity (Bit 2-1)</Label>
        <Select value={parity} onValueChange={setParity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Parity">
              {parity
                ? `${PARITY_OPTIONS.find((opt) => opt.value === parity)?.label} (${parity})`
                : "Chọn Parity"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PARITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 3 */}
      <div className="space-y-2">
        <Label>Stop Bit (Bit 3)</Label>
        <Select value={stopBit} onValueChange={setStopBit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Stop Bit">
              {stopBit
                ? `${STOP_BIT_OPTIONS.find((opt) => opt.value === stopBit)?.label} (${stopBit})`
                : "Chọn Stop Bit"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STOP_BIT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 7-4 */}
      <div className="space-y-2">
        <Label>Tốc độ Baud (Bit 7-4)</Label>
        <Select value={baud} onValueChange={setBaud}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tốc độ">
              {baud
                ? `${BAUD_OPTIONS.find((opt) => opt.value === baud)?.label} (${baud})`
                : "Chọn tốc độ"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BAUD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 15-12 */}
      <div className="space-y-2">
        <Label>Giao thức (Bit 15-12)</Label>
        <Select value={protocol} onValueChange={setProtocol}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn giao thức">
              {protocol
                ? `${PROTOCOL_OPTIONS.find((opt) => opt.value === protocol)?.label} (${protocol})`
                : "Chọn giao thức"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PROTOCOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
