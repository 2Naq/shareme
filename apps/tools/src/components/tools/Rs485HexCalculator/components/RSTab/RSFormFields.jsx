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
  PROTOCOL_OPTIONS,
  SUM_CHECK_OPTIONS,
  TRANSMISSION_CONTROL_OPTIONS,
} from "./constants";

export default function RSFormFields({
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
  protocol,
  handleProtocolChange,
  controlLine,
  setControlLine,
  controlLineOptions,
  sumCheck,
  setSumCheck,
  transmissionControl,
  setTransmissionControl,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Bit 0: Data Length */}
      <div className="space-y-2">
        <Label>Độ dài dữ liệu (Bit 0)</Label>
        <Select value={dataLength} onValueChange={setDataLength}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn độ dài">
              {DATA_LENGTH_OPTIONS.find((o) => o.value === dataLength)?.label}{" "}
              [{dataLength}]
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

      {/* Bit 2-1: Parity */}
      <div className="space-y-2">
        <Label>Parity (Bit 2-1)</Label>
        <Select value={parity} onValueChange={setParity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Parity">
              {PARITY_OPTIONS.find((o) => o.value === parity)?.label} [{parity}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PARITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 3: Stop Bit */}
      <div className="space-y-2">
        <Label>Stop Bit (Bit 3)</Label>
        <Select value={stopBit} onValueChange={setStopBit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Stop Bit">
              {STOP_BIT_OPTIONS.find((o) => o.value === stopBit)?.label} [{stopBit}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STOP_BIT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 7-4: Baud Rate */}
      <div className="space-y-2">
        <Label>Tốc độ Baud (Bit 7-4)</Label>
        <Select value={baud} onValueChange={setBaud}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tốc độ">
              {BAUD_OPTIONS.find((o) => o.value === baud)?.label} [{baud}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BAUD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
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
            {HEADER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
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
            {TERMINATOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 14: Protocol */}
      <div className="space-y-2">
        <Label>Protocol (Bit 14)</Label>
        <Select value={protocol} onValueChange={handleProtocolChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Protocol">
              {PROTOCOL_OPTIONS.find((o) => o.value === protocol)?.label} [{protocol}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PROTOCOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 12-10: Control Line */}
      <div className="space-y-2">
        <Label>Control Line (Bit 12-10)</Label>
        <Select value={controlLine} onValueChange={setControlLine}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Control Line">
              {controlLineOptions.find((o) => o.value === controlLine)?.label || "Chọn"}{" "}
              [{controlLine}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {controlLineOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 13: Sum Check */}
      <div className="space-y-2">
        <Label>Sum Check (Bit 13)</Label>
        <Select value={sumCheck} onValueChange={setSumCheck}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Sum Check">
              {SUM_CHECK_OPTIONS.find((o) => o.value === sumCheck)?.label} [{sumCheck}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SUM_CHECK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bit 15: Transmission Control */}
      <div className="space-y-2">
        <Label>Transmission Control (Bit 15)</Label>
        <Select value={transmissionControl} onValueChange={setTransmissionControl}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn Transmission">
              {TRANSMISSION_CONTROL_OPTIONS.find((o) => o.value === transmissionControl)?.label}{" "}
              [{transmissionControl}]
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TRANSMISSION_CONTROL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} [{opt.value}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
