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

export default function RS2BitDetailTable({ activeRegister, bitState }) {
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
    controlProcedure,
  } = bitState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bảng Tra Cứu Chi Tiết Các Bit — RS2 ({activeRegister})
        </CardTitle>
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
                Contents
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
                className={`border-r text-center transition-colors ${dataLength === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                7-bit
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${dataLength === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                8-bit
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
                    (0, 0) : Not provided (None)
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
              <TableCell className="border-r font-mono font-bold">B3</TableCell>
              <TableCell className="border-r font-medium">Stop bit</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${stopBit === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                1-bit
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${stopBit === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                2-bit
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
                    <div
                      className={`rounded px-1 transition-colors ${baud === "1010" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;1, 0, 1, 0&#125;: 38400
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
                className={`border-r text-center transition-colors ${header === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Not provided
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${header === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Provided<sup>*1</sup>
              </TableCell>
            </TableRow>

            {/* B9: Terminator */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">B9</TableCell>
              <TableCell className="border-r font-medium">Terminator</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${terminator === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Not provided
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${terminator === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Provided<sup>*1</sup>
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
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-muted-foreground mb-1 font-semibold">
                    Non-protocol communication<sup>*2</sup> — b12 b11 b10:
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`rounded px-1 transition-colors ${controlLine === "000" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 0, 0&#125;: Not provided &lt;RS-232C
                      interface&gt;
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${controlLine === "001" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 0, 1&#125;: Standard mode &lt;RS-232C
                      interface&gt;
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${controlLine === "010" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 1, 0&#125;: Interlink mode &lt;RS-232C
                      interface&gt;
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${controlLine === "011" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;0, 1, 1&#125;: Modem mode &lt;RS-232C interface&gt;
                    </div>
                    <div
                      className={`rounded px-1 transition-colors ${controlLine === "111" ? "bg-primary/15 text-primary font-bold" : ""}`}
                    >
                      &#123;1, 1, 1&#125;: Communication in accordance with
                      RS-485 &lt;RS-485/RS-422 interface&gt;
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
              <TableCell className="border-r font-medium">Sum check</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${sumCheck === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Not added
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${sumCheck === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Added<sup>*4</sup>
              </TableCell>
            </TableRow>

            {/* B14: Protocol */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">
                B14<sup>*3</sup>
              </TableCell>
              <TableCell className="border-r font-medium">Protocol</TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${protocol === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Not used
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${protocol === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                Used
              </TableCell>
            </TableRow>

            {/* B15: Control procedure */}
            <TableRow className="bg-primary/5 transition-colors">
              <TableCell className="border-r font-mono font-bold">
                B15
              </TableCell>
              <TableCell className="border-r font-medium">
                Control procedure (CR, LF)
              </TableCell>
              <TableCell
                className={`border-r text-center transition-colors ${controlProcedure === "0" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                CR, LF: Not used (Format 1)
              </TableCell>
              <TableCell
                className={`text-center transition-colors ${controlProcedure === "1" ? "bg-primary/15 text-primary font-bold" : ""}`}
              >
                CR, LF: Used (Format 4)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
