import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BitMapTable from "./BitMapTable";
import ResultPanel from "./ResultPanel";

// ───── FX3U-specific options ─────

const BAUD_OPTIONS = [
  { label: "19200 bps", value: "1001" },
  { label: "9600 bps", value: "1000" },
  { label: "4800 bps", value: "0111" },
  { label: "2400 bps", value: "0110" },
  { label: "1200 bps", value: "0101" },
  { label: "600 bps", value: "0100" },
  { label: "300 bps", value: "0011" },
];

const STOP_BIT_OPTIONS = [
  { label: "1 bit", value: "0" },
  { label: "2 bit", value: "1" },
];

const PARITY_OPTIONS = [
  { label: "None", value: "00" },
  { label: "Odd (Lẻ)", value: "01" },
  { label: "Even (Chẵn)", value: "11" },
];

const DATA_LENGTH_OPTIONS = [
  { label: "8 bit", value: "1" },
  { label: "7 bit", value: "0" },
];

const HEADER_OPTIONS = [
  { label: "None", value: "0" },
  { label: "Có (D8124) — Mặc định STX (02H)", value: "1" },
];

const TERMINATOR_OPTIONS = [
  { label: "None", value: "0" },
  { label: "Có (D8125) — Mặc định ETX (03H)", value: "1" },
];

// b10, b11, b12: Control line — phụ thuộc vào b14 (protocol)
const CONTROL_LINE_NO_PROTOCOL = [
  { label: "Không sử dụng (RS-232C)", value: "000" },
  { label: "Terminal mode (RS-232C)", value: "001" },
  { label: "Interlink mode (RS-232C, FX2N V2.00+)", value: "010" },
  { label: "Normal mode 1 (RS-232C / RS-485)", value: "011" },
  { label: "Normal mode 2 (RS-232C, FX/FX2c only)", value: "101" },
];

const CONTROL_LINE_COMPUTER_LINK = [
  { label: "RS-485 (RS-422) interface", value: "000" },
  { label: "RS-232C interface", value: "010" },
];

const SUM_CHECK_OPTIONS = [
  { label: "Không thêm mã kiểm tra", value: "0" },
  { label: "Thêm tự động", value: "1" },
];

const PROTOCOL_OPTIONS = [
  { label: "No protocol", value: "0" },
  { label: "Dedicated protocol (Computer link)", value: "1" },
];

const TRANSMISSION_CONTROL_OPTIONS = [
  { label: "Protocol format 1", value: "0" },
  { label: "Protocol format 4", value: "1" },
];

export default function FX3UTab() {
  const [dataLength, setDataLength] = useState("1");
  const [parity, setParity] = useState("00");
  const [stopBit, setStopBit] = useState("0");
  const [baud, setBaud] = useState("1000");
  const [header, setHeader] = useState("0");
  const [terminator, setTerminator] = useState("0");
  const [controlLine, setControlLine] = useState("011");
  const [sumCheck, setSumCheck] = useState("0");
  const [protocol, setProtocol] = useState("0");
  const [transmissionControl, setTransmissionControl] = useState("0");
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState("");

  // Khi đổi protocol, reset controlLine về giá trị hợp lệ đầu tiên
  const handleProtocolChange = useCallback(
    (val) => {
      setProtocol(val);
      if (val === "1") {
        // Computer link: chỉ cho phép 000, 010
        if (controlLine !== "000" && controlLine !== "010") {
          setControlLine("000");
        }
      }
    },
    [controlLine],
  );

  const controlLineOptions =
    protocol === "1" ? CONTROL_LINE_COMPUTER_LINK : CONTROL_LINE_NO_PROTOCOL;

  const { binaryString, binaryFormatted, hexCode, ladderCommand } =
    useMemo(() => {
      // Bit layout FX3U (MSB → LSB):
      // b15: transmissionControl | b14: protocol | b13: sumCheck
      // b12 b11 b10: controlLine (3 bits)
      // b9: terminator | b8: header
      // b7 b6 b5 b4: baud (4 bits)
      // b3: stopBit | b2 b1: parity | b0: dataLength
      const bin =
        transmissionControl +
        protocol +
        sumCheck +
        controlLine +
        terminator +
        header +
        baud +
        stopBit +
        parity +
        dataLength;

      const formatted = bin.replace(/(.{4})/g, "$1 ").trim();
      const decimal = parseInt(bin, 2);
      const hex = decimal.toString(16).toUpperCase().padStart(4, "0");
      return {
        binaryString: bin,
        binaryFormatted: formatted,
        hexCode: `H${hex}`,
        ladderCommand: `MOV H${hex} D8120`,
      };
    }, [
      transmissionControl,
      protocol,
      sumCheck,
      controlLine,
      terminator,
      header,
      baud,
      stopBit,
      parity,
      dataLength,
    ]);

  // Reverse-map hex → bit fields
  const handleHexInput = useCallback((rawValue) => {
    const cleaned = rawValue.replace(/^(0x|H)/i, "").trim();
    setHexInput(rawValue);

    if (cleaned === "") {
      setHexError("");
      return;
    }

    if (!/^[0-9A-Fa-f]{1,4}$/.test(cleaned)) {
      setHexError("Nhập tối đa 4 ký tự Hex (0-9, A-F)");
      return;
    }

    const decimal = parseInt(cleaned, 16);
    const bin = decimal.toString(2).padStart(16, "0");

    // Parse bit fields
    const newTransmission = bin.substring(0, 1); // b15
    const newProtocol = bin.substring(1, 2); // b14
    const newSumCheck = bin.substring(2, 3); // b13
    const newControlLine = bin.substring(3, 6); // b12-b10
    const newTerminator = bin.substring(6, 7); // b9
    const newHeader = bin.substring(7, 8); // b8
    const newBaud = bin.substring(8, 12); // b7-b4
    const newStopBit = bin.substring(12, 13); // b3
    const newParity = bin.substring(13, 15); // b2-b1
    const newDataLength = bin.substring(15, 16); // b0

    // Validate
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);

    if (!isValidBaud || !isValidStopBit || !isValidParity) {
      setHexError("Mã Hex không hợp lệ (một số bit không khớp cấu hình)");
      return;
    }

    setHexError("");
    setTransmissionControl(newTransmission);
    setProtocol(newProtocol);
    setSumCheck(newSumCheck);
    setControlLine(newControlLine);
    setTerminator(newTerminator);
    setHeader(newHeader);
    setBaud(newBaud);
    setStopBit(newStopBit);
    setParity(newParity);
    setDataLength(newDataLength);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Thông số truyền thông — FX3U</CardTitle>
            <CardDescription>
              Lựa chọn các thông số để cấu hình kết nối RS485/RS-232C. Thanh ghi{" "}
              <strong>D8120</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Bit 0: Data Length */}
              <div className="space-y-2">
                <Label>Độ dài dữ liệu (Bit 0)</Label>
                <Select value={dataLength} onValueChange={setDataLength}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn độ dài">
                      {
                        DATA_LENGTH_OPTIONS.find((o) => o.value === dataLength)
                          ?.label
                      }{" "}
                      ({dataLength})
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

              {/* Bit 2-1: Parity */}
              <div className="space-y-2">
                <Label>Parity (Bit 2-1)</Label>
                <Select value={parity} onValueChange={setParity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Parity">
                      {PARITY_OPTIONS.find((o) => o.value === parity)?.label} (
                      {parity})
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

              {/* Bit 3: Stop Bit */}
              <div className="space-y-2">
                <Label>Stop Bit (Bit 3)</Label>
                <Select value={stopBit} onValueChange={setStopBit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Stop Bit">
                      {STOP_BIT_OPTIONS.find((o) => o.value === stopBit)?.label}{" "}
                      ({stopBit})
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

              {/* Bit 7-4: Baud Rate */}
              <div className="space-y-2">
                <Label>Tốc độ Baud (Bit 7-4)</Label>
                <Select value={baud} onValueChange={setBaud}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tốc độ">
                      {BAUD_OPTIONS.find((o) => o.value === baud)?.label} (
                      {baud})
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

              {/* Bit 8: Header */}
              <div className="space-y-2">
                <Label>Header (Bit 8)</Label>
                <Select value={header} onValueChange={setHeader}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Header">
                      {HEADER_OPTIONS.find((o) => o.value === header)?.label} (
                      {header})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {HEADER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
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
                      {
                        TERMINATOR_OPTIONS.find((o) => o.value === terminator)
                          ?.label
                      }{" "}
                      ({terminator})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TERMINATOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bit 14: Protocol — cần chọn trước Control Line */}
              <div className="space-y-2">
                <Label>Protocol (Bit 14)</Label>
                <Select value={protocol} onValueChange={handleProtocolChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Protocol">
                      {
                        PROTOCOL_OPTIONS.find((o) => o.value === protocol)
                          ?.label
                      }{" "}
                      ({protocol})
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

              {/* Bit 12-10: Control Line */}
              <div className="space-y-2">
                <Label>Control Line (Bit 12-10)</Label>
                <Select value={controlLine} onValueChange={setControlLine}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Control Line">
                      {controlLineOptions.find((o) => o.value === controlLine)
                        ?.label || "Chọn"}{" "}
                      ({controlLine})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {controlLineOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
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
                      {
                        SUM_CHECK_OPTIONS.find((o) => o.value === sumCheck)
                          ?.label
                      }{" "}
                      ({sumCheck})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SUM_CHECK_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bit 15: Transmission Control */}
              <div className="space-y-2">
                <Label>Transmission Control (Bit 15)</Label>
                <Select
                  value={transmissionControl}
                  onValueChange={setTransmissionControl}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Transmission">
                      {
                        TRANSMISSION_CONTROL_OPTIONS.find(
                          (o) => o.value === transmissionControl,
                        )?.label
                      }{" "}
                      ({transmissionControl})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSION_CONTROL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <ResultPanel
          binaryFormatted={binaryFormatted}
          hexCode={hexCode}
          ladderCommand={ladderCommand}
          hexInput={hexInput}
          hexError={hexError}
          onHexInput={handleHexInput}
          onHexFocus={() => {
            if (!hexInput) setHexInput(hexCode);
          }}
          onHexBlur={() => {
            if (hexInput === hexCode) setHexInput("");
          }}
        />
      </div>

      <BitMapTable binaryString={binaryString} />

      {/* Bảng tra cứu chi tiết FX3U */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng Tra Cứu Chi Tiết Các Bit — FX3U (D8120)</CardTitle>
          <CardDescription>
            Mô tả định nghĩa trạng thái 0 (OFF) và 1 (ON) cho từng nhóm Bit cấu
            hình.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="border">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className="text-foreground w-[100px] border-r font-bold"
                >
                  Bit No.
                </TableHead>
                <TableHead
                  rowSpan={2}
                  className="text-foreground w-[180px] border-r font-bold"
                >
                  Name
                </TableHead>
                <TableHead
                  colSpan={2}
                  className="text-foreground border-b text-center font-bold"
                >
                  Description
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[220px] border-r text-center font-semibold">
                  0 (Bit = OFF)
                </TableHead>
                <TableHead className="w-[220px] text-center font-semibold">
                  1 (Bit = ON)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* B0: Data length */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B0
                </TableCell>
                <TableCell className="border-r font-medium">
                  Data length
                </TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${dataLength === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  7 bit
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${dataLength === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  8 bit
                </TableCell>
              </TableRow>

              {/* B1-B2: Parity */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B1
                  <br />
                  B2
                </TableCell>
                <TableCell className="border-r font-medium">Parity</TableCell>
                <TableCell colSpan={2}>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-muted-foreground font-semibold">
                      b2 b1
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${parity === "00" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      (0, 0) : None
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${parity === "01" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      (0, 1) : Odd (Lẻ)
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${parity === "11" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      (1, 1) : Even (Chẵn)
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* B3: Stop bit */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B3
                </TableCell>
                <TableCell className="border-r font-medium">Stop bit</TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${stopBit === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  1 bit
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${stopBit === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  2 bit
                </TableCell>
              </TableRow>

              {/* B4-B7: Baud rate */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B4
                  <br />
                  B5
                  <br />
                  B6
                  <br />
                  B7
                </TableCell>
                <TableCell className="border-r font-medium">
                  Baud rate (bps)
                </TableCell>
                <TableCell colSpan={2}>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-muted-foreground mb-1 font-semibold">
                      b7 b6 b5 b4
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                      <div
                        className={`rounded px-1 transition-colors ${baud === "0011" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;0, 0, 1, 1&#125;: 300
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "0111" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;0, 1, 1, 1&#125;: 4800
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "0100" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;0, 1, 0, 0&#125;: 600
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "1000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;1, 0, 0, 0&#125;: 9600
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "0101" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;0, 1, 0, 1&#125;: 1200
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "1001" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;1, 0, 0, 1&#125;: 19200
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${baud === "0110" ? "bg-primary/15 text-primary font-bold" : ""}`}
                      >
                        &#123;0, 1, 1, 0&#125;: 2400
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* B8: Header */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B8
                </TableCell>
                <TableCell className="border-r font-medium">Header</TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${header === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  None
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${header === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Effective (D8124)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Default: STX (02H)
                  </span>
                </TableCell>
              </TableRow>

              {/* B9: Terminator */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B9
                </TableCell>
                <TableCell className="border-r font-medium">
                  Terminator
                </TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${terminator === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  None
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${terminator === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Effective (D8125)
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Default: ETX (03H)
                  </span>
                </TableCell>
              </TableRow>

              {/* B10-B12: Control line */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B10
                  <br />
                  B11
                  <br />
                  B12
                </TableCell>
                <TableCell className="border-r font-medium">
                  Control line
                </TableCell>
                <TableCell colSpan={2}>
                  <div className="space-y-2 font-mono text-xs">
                    {/* No protocol mode */}
                    <div>
                      <div
                        className={`mb-1 font-semibold ${protocol === "0" ? "text-primary" : "text-muted-foreground"}`}
                      >
                        No protocol (b14=0) — b12 b11 b10:
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "0" && controlLine === "000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 0, 0&#125;: Không sử dụng (RS-232C)
                        </div>
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "0" && controlLine === "001" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 0, 1&#125;: Terminal mode (RS-232C)
                        </div>
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "0" && controlLine === "010" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 1, 0&#125;: Interlink mode (RS-232C, FX2N
                          V2.00+)
                        </div>
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "0" && controlLine === "011" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 1, 1&#125;: Normal mode 1 (RS-232C / RS-485)
                        </div>
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "0" && controlLine === "101" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;1, 0, 1&#125;: Normal mode 2 (RS-232C, FX/FX2c
                          only)
                        </div>
                      </div>
                    </div>
                    {/* Computer link mode */}
                    <div className="border-t pt-2">
                      <div
                        className={`mb-1 font-semibold ${protocol === "1" ? "text-primary" : "text-muted-foreground"}`}
                      >
                        Computer link (b14=1) — b12 b11 b10:
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "1" && controlLine === "000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 0, 0&#125;: RS-485 (RS-422) interface
                        </div>
                        <div
                          className={`rounded px-1 transition-colors ${protocol === "1" && controlLine === "010" ? "bg-primary/15 text-primary font-bold" : ""}`}
                        >
                          &#123;0, 1, 0&#125;: RS-232C interface
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* B13: Sum check */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B13
                </TableCell>
                <TableCell className="border-r font-medium">
                  Sum check
                </TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${sumCheck === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Không thêm mã kiểm tra
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${sumCheck === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Thêm tự động
                </TableCell>
              </TableRow>

              {/* B14: Protocol */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B14
                </TableCell>
                <TableCell className="border-r font-medium">Protocol</TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${protocol === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  No protocol
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${protocol === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Dedicated protocol
                </TableCell>
              </TableRow>

              {/* B15: Transmission control */}
              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B15
                </TableCell>
                <TableCell className="border-r font-medium">
                  Transmission control
                </TableCell>
                <TableCell
                  className={`border-r text-center transition-colors ${transmissionControl === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Protocol format 1
                </TableCell>
                <TableCell
                  className={`text-center transition-colors ${transmissionControl === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
                >
                  Protocol format 4
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
