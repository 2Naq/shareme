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
  HEADER_OPTIONS,
  TERMINATOR_OPTIONS,
  CONTROL_LINE_OPTIONS,
  SUM_CHECK_OPTIONS,
  PROTOCOL_OPTIONS,
  CONTROL_PROCEDURE_OPTIONS,
} from "./constants";

export default function RS2FormFields({
  dataLength,
  setDataLength,
  parity,
  setParity,
  stopBit,
  setStopBit,
  baud,
  setBaud,
  header,
  setHeader,
  terminator,
  setTerminator,
  controlLine,
  setControlLine,
  sumCheck,
  setSumCheck,
  protocol,
  setProtocol,
  controlProcedure,
  setControlProcedure,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Bit 0: Data Length */}
      <div className="space-y-2">
        <Label>Độ dài dữ liệu (Bit 0)</Label>
        <Select value={dataLength} onValueChange={setDataLength}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn độ dài">
              {DATA_LENGTH_OPTIONS.find((o) => o.value === dataLength)?.label} [{dataLength}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {DATA_LENGTH_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 1, Bit 2: Parity */}
      <div className="space-y-2">
        <Label>Kiểm tra chẵn lẻ (Bit 2, Bit 1)</Label>
        <Select value={parity} onValueChange={setParity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn parity">
              {PARITY_OPTIONS.find((o) => o.value === parity)?.label} [{parity}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PARITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 3: Stop Bit */}
      <div className="space-y-2">
        <Label>Bit dừng - Stop bit (Bit 3)</Label>
        <Select value={stopBit} onValueChange={setStopBit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn stop bit">
              {STOP_BIT_OPTIONS.find((o) => o.value === stopBit)?.label} [{stopBit}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STOP_BIT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 4, 5, 6, 7: Baud Rate */}
      <div className="space-y-2">
        <Label>Tốc độ truyền - Baud rate (Bit 7..4)</Label>
        <Select value={baud} onValueChange={setBaud}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tốc độ baud">
              {BAUD_OPTIONS.find((o) => o.value === baud)?.label} [{baud}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {BAUD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 8: Header */}
      <div className="space-y-2">
        <Label>Header (Bit 8)</Label>
        <Select value={header} onValueChange={setHeader}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Header">
              {HEADER_OPTIONS.find((o) => o.value === header)?.label} [{header}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {HEADER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 9: Terminator */}
      <div className="space-y-2">
        <Label>Terminator (Bit 9)</Label>
        <Select value={terminator} onValueChange={setTerminator}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Terminator">
              {TERMINATOR_OPTIONS.find((o) => o.value === terminator)?.label} [{terminator}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TERMINATOR_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 10, 11, 12: Control Line */}
      <div className="space-y-2">
        <Label>Tuyến điều khiển - Control line (Bit 12..10)</Label>
        <Select value={controlLine} onValueChange={setControlLine}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Control Line">
              {CONTROL_LINE_OPTIONS.find((o) => o.value === controlLine)?.label} [{controlLine}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CONTROL_LINE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 13: Sum Check */}
      <div className="space-y-2">
        <Label>Mã kiểm tra - Sum check (Bit 13)</Label>
        <Select value={sumCheck} onValueChange={setSumCheck}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Sum Check">
              {SUM_CHECK_OPTIONS.find((o) => o.value === sumCheck)?.label} [{sumCheck}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SUM_CHECK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 14: Protocol */}
      <div className="space-y-2">
        <Label>Giao thức - Protocol (Bit 14)</Label>
        <Select value={protocol} onValueChange={setProtocol}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Protocol">
              {PROTOCOL_OPTIONS.find((o) => o.value === protocol)?.label} [{protocol}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PROTOCOL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bit 15: Control procedure (CR, LF) */}
      <div className="space-y-2">
        <Label>Thủ tục điều khiển - CR/LF (Bit 15)</Label>
        <Select value={controlProcedure} onValueChange={setControlProcedure}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn thủ tục CR/LF">
              {CONTROL_PROCEDURE_OPTIONS.find((o) => o.value === controlProcedure)?.label} [{controlProcedure}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CONTROL_PROCEDURE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} [{opt.value}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
