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

const PROTOCOL_OPTIONS = [
  { label: "MITSUBISHI FX2N Protocol", value: "0000" },
  { label: "MODBUS Slave", value: "0100" },
  { label: "MODBUS RTU Master", value: "1000" },
  { label: "Free Communication", value: "1100" },
];

const BAUD_OPTIONS = [
  { label: "115200 bps", value: "1101" },
  { label: "57600 bps", value: "1011" },
  { label: "38400 bps", value: "1010" },
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

export default function LE3UTab() {
  const [protocol, setProtocol] = useState("1000");
  const [baud, setBaud] = useState("1000");
  const [stopBit, setStopBit] = useState("0");
  const [parity, setParity] = useState("00");
  const [dataLength, setDataLength] = useState("1");
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState("");

  const { binaryString, binaryFormatted, hexCode, ladderCommand } =
    useMemo(() => {
      const reserved = "0000";
      const bin = protocol + reserved + baud + stopBit + parity + dataLength;
      const formatted = bin.replace(/(.{4})/g, "$1 ").trim();
      const decimal = parseInt(bin, 2);
      const hex = decimal.toString(16).toUpperCase().padStart(4, "0");
      return {
        binaryString: bin,
        binaryFormatted: formatted,
        hexCode: `H${hex}`,
        ladderCommand: `MOV H${hex} D8120`,
      };
    }, [protocol, baud, stopBit, parity, dataLength]);

  // Reverse-map: nhập mã Hex → parse binary → set lại tất cả Select
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

    // Bit layout: [15-12: protocol] [11-8: reserved] [7-4: baud] [3: stopBit] [2-1: parity] [0: dataLength]
    const newProtocol = bin.substring(0, 4);
    const newBaud = bin.substring(8, 12);
    const newStopBit = bin.substring(12, 13);
    const newParity = bin.substring(13, 15);
    const newDataLength = bin.substring(15, 16);

    const isValidProtocol = PROTOCOL_OPTIONS.some((o) => o.value === newProtocol);
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);
    const isValidDataLength = DATA_LENGTH_OPTIONS.some((o) => o.value === newDataLength);

    if (!isValidProtocol || !isValidBaud || !isValidStopBit || !isValidParity || !isValidDataLength) {
      setHexError("Mã Hex không hợp lệ (một số bit không khớp cấu hình)");
      return;
    }

    setHexError("");
    setProtocol(newProtocol);
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
            <CardTitle>Thông số truyền thông — FX3U / LE3U</CardTitle>
            <CardDescription>
              Lựa chọn các thông số để cấu hình kết nối RS485. Thanh ghi{" "}
              <strong>D8120</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <ResultPanel
          binaryFormatted={binaryFormatted}
          hexCode={hexCode}
          ladderCommand={ladderCommand}
          hexInput={hexInput}
          hexError={hexError}
          onHexInput={handleHexInput}
          onHexFocus={() => { if (!hexInput) setHexInput(hexCode); }}
          onHexBlur={() => { if (hexInput === hexCode) setHexInput(""); }}
        />
      </div>

      <BitMapTable binaryString={binaryString} />

      {/* Bảng tra cứu chi tiết */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng Tra Cứu Chi Tiết Các Bit — LE3U (D8120)</CardTitle>
          <CardDescription>
            Mô tả định nghĩa trạng thái 0 (OFF) và 1 (ON) cho từng nhóm Bit cấu hình.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="border">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead rowSpan={2} className="w-[100px] border-r font-bold text-foreground">
                  Bit No.
                </TableHead>
                <TableHead rowSpan={2} className="w-[180px] border-r font-bold text-foreground">
                  Name
                </TableHead>
                <TableHead colSpan={2} className="text-center font-bold text-foreground border-b">
                  Description
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center w-[220px] border-r font-semibold">
                  0 (Bit = OFF)
                </TableHead>
                <TableHead className="text-center w-[220px] font-semibold">
                  1 (Bit = ON)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className={`transition-colors ${dataLength === "0" || dataLength === "1" ? "bg-primary/5" : ""}`}>
                <TableCell className="font-mono font-bold border-r">B0</TableCell>
                <TableCell className="font-medium border-r">Data length</TableCell>
                <TableCell className={`text-center border-r transition-colors ${dataLength === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}>7 bit</TableCell>
                <TableCell className={`text-center transition-colors ${dataLength === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}>8 bit</TableCell>
              </TableRow>

              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="font-mono font-bold border-r">
                  B1<br />B2
                </TableCell>
                <TableCell className="font-medium border-r">Parity</TableCell>
                <TableCell colSpan={2}>
                  <div className="font-mono text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground">b2 b1</div>
                    <div className={`rounded px-1 transition-colors ${parity === "00" ? "bg-primary/15 text-primary font-bold" : ""}`}>(0, 0) : None</div>
                    <div className={`rounded px-1 transition-colors ${parity === "01" ? "bg-primary/15 text-primary font-bold" : ""}`}>(0, 1) : Odd (Lẻ)</div>
                    <div className={`rounded px-1 transition-colors ${parity === "11" ? "bg-primary/15 text-primary font-bold" : ""}`}>(1, 1) : Even (Chẵn)</div>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="font-mono font-bold border-r">B3</TableCell>
                <TableCell className="font-medium border-r">Stop bit</TableCell>
                <TableCell className={`text-center border-r transition-colors ${stopBit === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}>1 bit</TableCell>
                <TableCell className={`text-center transition-colors ${stopBit === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}>2 bit</TableCell>
              </TableRow>

              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="font-mono font-bold border-r">
                  B4<br />B5<br />B6<br />B7
                </TableCell>
                <TableCell className="font-medium border-r">Baud Rate (bps)</TableCell>
                <TableCell colSpan={2}>
                  <div className="font-mono text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground mb-1">b7 b6 b5 b4</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      <div className={`rounded px-1 transition-colors ${baud === "0011" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 0, 1, 1&#125;: 300</div>
                      <div className={`rounded px-1 transition-colors ${baud === "0111" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 1, 1, 1&#125;: 4800</div>
                      <div className={`rounded px-1 transition-colors ${baud === "0100" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 1, 0, 0&#125;: 600</div>
                      <div className={`rounded px-1 transition-colors ${baud === "1000" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;1, 0, 0, 0&#125;: 9600</div>
                      <div className={`rounded px-1 transition-colors ${baud === "0101" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 1, 0, 1&#125;: 1200</div>
                      <div className={`rounded px-1 transition-colors ${baud === "1001" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;1, 0, 0, 1&#125;: 19200</div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-mono font-bold border-r">B8</TableCell>
                <TableCell className="font-medium border-r">Header</TableCell>
                <TableCell className="text-center border-r">None</TableCell>
                <TableCell className="text-center">Yes (D8124)</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-mono font-bold border-r">B9</TableCell>
                <TableCell className="font-medium border-r">Terminator</TableCell>
                <TableCell className="text-center border-r">None</TableCell>
                <TableCell className="text-center">Yes (D8125)</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-mono font-bold border-r">
                  B10<br />B11
                </TableCell>
                <TableCell className="font-medium border-r">Do not use</TableCell>
                <TableCell colSpan={2} className="text-center text-muted-foreground italic">
                  Reserved (Không sử dụng)
                </TableCell>
              </TableRow>

              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="font-mono font-bold border-r">
                  B12<br />B13<br />B14<br />B15
                </TableCell>
                <TableCell className="font-medium border-r">Communication protocol</TableCell>
                <TableCell colSpan={2}>
                  <div className="font-mono text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground mb-1">b15 b14 b13 b12</div>
                    <div className={`rounded px-1 transition-colors ${protocol === "0000" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 0, 0, 0&#125;: MITSUBISHI FX2N protocol (from machine)</div>
                    <div className={`rounded px-1 transition-colors ${protocol === "0100" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;0, 1, 0, 0&#125;: MODBUS Slave (from machine)</div>
                    <div className={`rounded px-1 transition-colors ${protocol === "1000" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;1, 0, 0, 0&#125;: MODBUS RTU (Master, IVRD, IVWR instruction)</div>
                    <div className={`rounded px-1 transition-colors ${protocol === "1100" ? "bg-primary/15 text-primary font-bold" : ""}`}>&#123;1, 1, 0, 0&#125;: Free communication (RS instruction, with CCD check)</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
