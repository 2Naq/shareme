import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RSBitDetailTable({ bitState }) {
  const {
    dataLength,
    parity,
    stopBit,
    baud,
    header,
    terminator,
    controlLine,
    sumCheck,
    protocol,
    transmissionControl,
  } = bitState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng Tra Cứu Chi Tiết Các Bit — FX (D8120)</CardTitle>
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
            {/* B0: Data length */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">B0</TableCell>
              <TableCell className="border-r font-medium">
                Data length
              </TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  dataLength === "0"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
              >
                7 bit
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  dataLength === "1"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
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
                    className={`rounded px-1 transition-colors ${
                      parity === "00"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    (0, 0) : None
                  </div>
                  <div
                    className={`rounded px-1 transition-colors ${
                      parity === "01"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    (0, 1) : Odd (Lẻ)
                  </div>
                  <div
                    className={`rounded px-1 transition-colors ${
                      parity === "11"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    (1, 1) : Even (Chẵn)
                  </div>
                </div>
              </TableCell>
            </TableRow>

            {/* B3: Stop bit */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">B3</TableCell>
              <TableCell className="border-r font-medium">Stop bit</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  stopBit === "0" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                1 bit
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  stopBit === "1" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
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
                      className={`rounded px-1 transition-colors ${
                        baud === "0011"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;0, 0, 1, 1&#125;: 300
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "0111"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;0, 1, 1, 1&#125;: 4800
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "0100"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;0, 1, 0, 0&#125;: 600
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "1000"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;1, 0, 0, 0&#125;: 9600
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "0101"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;0, 1, 0, 1&#125;: 1200
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "1001"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;1, 0, 0, 1&#125;: 19200
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${
                        baud === "0110"
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                    >
                      &#123;0, 1, 1, 0&#125;: 2400
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            {/* B8: Header */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">B8</TableCell>
              <TableCell className="border-r font-medium">Header</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  header === "0" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                None
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  header === "1" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
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
              <TableCell className="border-r font-mono font-bold">B9</TableCell>
              <TableCell className="border-r font-medium">Terminator</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  terminator === "0"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
              >
                None
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  terminator === "1"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
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
                      className={`mb-1 font-semibold ${
                        protocol === "0"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      No protocol (b14=0) — b12 b11 b10:
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "0" && controlLine === "000"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;0, 0, 0&#125;: Không sử dụng (RS-232C)
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "0" && controlLine === "001"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;0, 0, 1&#125;: Terminal mode (RS-232C)
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "0" && controlLine === "010"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;0, 1, 0&#125;: Interlink mode (RS-232C, FX2N
                        V2.00+)
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "0" && controlLine === "011"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;0, 1, 1&#125;: Normal mode 1 (RS-232C / RS-485)
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "0" && controlLine === "101"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;1, 0, 1&#125;: Normal mode 2 (RS-232C, FX/FX2c
                        only)
                      </div>
                    </div>
                  </div>
                  {/* Computer link mode */}
                  <div className="border-t pt-2">
                    <div
                      className={`mb-1 font-semibold ${
                        protocol === "1"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Computer link (b14=1) — b12 b11 b10:
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "1" && controlLine === "000"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
                      >
                        &#123;0, 0, 0&#125;: RS-485 (RS-422) interface
                      </div>
                      <div
                        className={`rounded px-1 transition-colors ${
                          protocol === "1" && controlLine === "010"
                            ? "bg-primary/15 text-primary font-bold"
                            : ""
                        }`}
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
                B13<sup>*3</sup>
              </TableCell>
              <TableCell className="border-r font-medium">Sum check</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  sumCheck === "0" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                Không thêm mã kiểm tra
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  sumCheck === "1" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                Thêm tự động
              </TableCell>
            </TableRow>

            {/* B14: Protocol */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">
                B14<sup>*3</sup>
              </TableCell>
              <TableCell className="border-r font-medium">Protocol</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  protocol === "0" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                No protocol
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  protocol === "1" ? "bg-primary/15 text-primary font-bold" : ""
                }`}
              >
                Dedicated protocol
              </TableCell>
            </TableRow>

            {/* B15: Transmission control */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">
                B15<sup>*3</sup>
              </TableCell>
              <TableCell className="border-r font-medium">
                Transmission control
              </TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${
                  transmissionControl === "0"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
              >
                Protocol format 1
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${
                  transmissionControl === "1"
                    ? "bg-primary/15 text-primary font-bold"
                    : ""
                }`}
              >
                Protocol format 4
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-none bg-transparent">
        *3: Make sure to set as "0" when using non-protocol communication.
      </CardFooter>
    </Card>
  );
}
