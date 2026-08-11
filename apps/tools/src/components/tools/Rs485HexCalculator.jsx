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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

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

export default function Rs485HexCalculator() {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  // State quản lý giá trị được chọn (mặc định cho MODBUS RTU Master / 9600 bps / 8 data bits / 1 stop bit / None parity)
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
    // Loại bỏ prefix H/0x nếu có, chỉ giữ hex digits
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

    // Parse từng nhóm bit từ chuỗi binary 16-bit
    // Bit layout: [15-12: protocol] [11-8: reserved] [7-4: baud] [3: stopBit] [2-1: parity] [0: dataLength]
    const newProtocol = bin.substring(0, 4); // bit 15-12
    const newBaud = bin.substring(8, 12); // bit 7-4
    const newStopBit = bin.substring(12, 13); // bit 3
    const newParity = bin.substring(13, 15); // bit 2-1
    const newDataLength = bin.substring(15, 16); // bit 0

    // Validate các giá trị có nằm trong option hợp lệ không
    const isValidProtocol = PROTOCOL_OPTIONS.some(
      (o) => o.value === newProtocol,
    );
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);
    const isValidDataLength = DATA_LENGTH_OPTIONS.some(
      (o) => o.value === newDataLength,
    );

    if (
      !isValidProtocol ||
      !isValidBaud ||
      !isValidStopBit ||
      !isValidParity ||
      !isValidDataLength
    ) {
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
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Tính Mã Hex Cấu Hình RS485
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán mã Hex cho thanh ghi <Badge>D8120</Badge>{" "}
          <Badge>D8400</Badge> <Badge>D8420</Badge> — PLC Mitsubishi dòng FX.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Thông số truyền thông</CardTitle>
            <CardDescription>
              Lựa chọn các thông số để cấu hình kết nối RS485.
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
              {/* Bit 12-15 */}
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

        <Card className="bg-primary/5 border-primary/20 max-w-sm">
          <CardHeader>
            <CardTitle className="text-primary">Kết quả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-primary text-xs tracking-wider uppercase">
                Chuỗi nhị phân 16-bit
              </Label>
              <div className="text-foreground mt-1 font-mono text-lg font-bold tracking-widest">
                {binaryFormatted}
              </div>
            </div>

            <div>
              <Label className="text-primary text-xs tracking-wider uppercase">
                Mã Hex (nhập để tra ngược)
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  value={hexInput || hexCode}
                  onChange={(e) => handleHexInput(e.target.value)}
                  onFocus={() => {
                    if (!hexInput) setHexInput(hexCode);
                  }}
                  onBlur={() => {
                    if (hexInput === hexCode) setHexInput("");
                  }}
                  placeholder="VD: H8081 hoặc 8081"
                  className={`h-12 font-mono text-2xl font-black tracking-wider ${
                    hexError
                      ? "border-destructive text-destructive"
                      : "text-primary border-primary/30 focus-visible:ring-primary/30"
                  }`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-12 w-12 shrink-0"
                  onClick={() => copyToClipboard(hexCode)}
                  title="Sao chép mã Hex"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {hexError && (
                <p className="text-destructive mt-1 text-xs">{hexError}</p>
              )}
            </div>

            <div>
              <Label className="text-primary text-xs tracking-wider uppercase">
                Ví dụ
              </Label>
              <div className="bg-secondary mt-1 flex w-full items-center justify-between gap-2 rounded-lg border p-3">
                <span className="text-secondary-foreground truncate font-mono text-base">
                  {ladderCommand}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(ladderCommand)}
                  title="Sao chép lệnh"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bit Map (16-bit)</CardTitle>
          <CardDescription>Cấu trúc chi tiết của thanh ghi.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 16 }, (_, i) => (
                  <TableHead
                    key={i}
                    className="text-muted-foreground px-1 text-center font-semibold"
                  >
                    {15 - i}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {binaryString.split("").map((bit, i) => (
                  <TableCell
                    key={i}
                    className="border-r px-1 py-3 text-center last:border-r-0"
                  >
                    <Badge
                      variant={bit === "1" ? "default" : "outline"}
                      className="w-6 justify-center font-mono text-sm"
                    >
                      {bit}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bảng Tra Cứu Chi Tiết Các Bit (D8120)</CardTitle>
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
                  className="text-foreground w-25 border-r font-bold"
                >
                  Bit No.
                </TableHead>
                <TableHead
                  rowSpan={2}
                  className="text-foreground w-45 border-r font-bold"
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
                <TableHead className="w-55 border-r text-center font-semibold">
                  0 (Bit = OFF)
                </TableHead>
                <TableHead className="w-55 text-center font-semibold">
                  1 (Bit = ON)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                className={`transition-colors ${dataLength === "0" || dataLength === "1" ? "bg-primary/5" : ""}`}
              >
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
                  Baud Rate (bps)
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
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="border-r font-mono font-bold">
                  B8
                </TableCell>
                <TableCell className="border-r font-medium">Header</TableCell>
                <TableCell className="border-r text-center">None</TableCell>
                <TableCell className="text-center">Yes (D8124)</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="border-r font-mono font-bold">
                  B9
                </TableCell>
                <TableCell className="border-r font-medium">
                  Terminator
                </TableCell>
                <TableCell className="border-r text-center">None</TableCell>
                <TableCell className="text-center">Yes (D8125)</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="border-r font-mono font-bold">
                  B10
                  <br />
                  B11
                </TableCell>
                <TableCell className="border-r font-medium">
                  Do not use
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="text-muted-foreground text-center italic"
                >
                  Reserved (Không sử dụng)
                </TableCell>
              </TableRow>

              <TableRow className="bg-primary/5 transition-colors">
                <TableCell className="border-r font-mono font-bold">
                  B12
                  <br />
                  B13
                  <br />
                  B14
                  <br />
                  B15
                </TableCell>
                <TableCell className="border-r font-medium">
                  Communication protocol
                </TableCell>
                <TableCell colSpan={2}>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-muted-foreground mb-1 font-semibold">
                      b15 b14 b13 b12
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${protocol === "0000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 0, 0, 0&#125;: MITSUBISHI FX2N protocol (from
                      machine)
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${protocol === "0100" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 1, 0, 0&#125;: MODBUS Slave (from machine)
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${protocol === "1000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;1, 0, 0, 0&#125;: MODBUS RTU (Master, IVRD, IVWR
                      instruction)
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${protocol === "1100" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;1, 1, 0, 0&#125;: Free communication (RS
                      instruction, with CCD check)
                    </div>
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
