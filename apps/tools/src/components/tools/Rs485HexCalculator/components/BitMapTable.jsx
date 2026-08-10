import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BitMapTable({ binaryString }) {
  return (
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
  );
}
