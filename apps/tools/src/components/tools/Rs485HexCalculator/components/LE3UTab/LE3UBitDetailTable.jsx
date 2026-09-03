import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LE3UBitDetailTable({ bitState }) {
  const { dataLength, parity, stopBit, baud, protocol } = bitState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng Tra Cứu Chi Tiết Các Bit — LE3U (D8120)</CardTitle>
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
              className={`transition-colors ${
                dataLength === "0" || dataLength === "1" ? "bg-primary/5" : ""
              }`}
            >
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
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border-r font-mono font-bold">B8</TableCell>
              <TableCell className="border-r font-medium">Header</TableCell>
              <TableCell className="border-r text-center">None</TableCell>
              <TableCell className="text-center">Yes (D8124)</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border-r font-mono font-bold">B9</TableCell>
              <TableCell className="border-r font-medium">Terminator</TableCell>
              <TableCell className="border-r text-center">None</TableCell>
              <TableCell className="text-center">Yes (D8125)</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border-r font-mono font-bold">
                B10
                <br />
                B11
              </TableCell>
              <TableCell className="border-r font-medium">Do not use</TableCell>
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
                    className={`rounded px-1 transition-colors ${
                      protocol === "0000"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    &#123;0, 0, 0, 0&#125;: MITSUBISHI FX2N protocol (from
                    machine)
                  </div>
                  <div
                    className={`rounded px-1 transition-colors ${
                      protocol === "0100"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    &#123;0, 1, 0, 0&#125;: MODBUS Slave (from machine)
                  </div>
                  <div
                    className={`rounded px-1 transition-colors ${
                      protocol === "1000"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    &#123;1, 0, 0, 0&#125;: MODBUS RTU (Master, IVRD, IVWR
                    instruction)
                  </div>
                  <div
                    className={`rounded px-1 transition-colors ${
                      protocol === "1100"
                        ? "bg-primary/15 text-primary font-bold"
                        : ""
                    }`}
                  >
                    &#123;1, 1, 0, 0&#125;: Free communication (RS instruction,
                    with CCD check)
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
