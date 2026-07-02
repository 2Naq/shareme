import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PROTOCOL_OPTIONS = [
  { label: 'MODBUS RTU Master', value: '1000' },
  { label: 'MODBUS Slave', value: '0100' },
  { label: 'MITSUBISHI FX2N Protocol', value: '0000' },
  { label: 'Free Communication', value: '1100' },
];

const BAUD_OPTIONS = [
  { label: '9600 bps', value: '1000' },
  { label: '19200 bps', value: '1001' },
  { label: '4800 bps', value: '0111' },
  { label: '1200 bps', value: '0101' },
  { label: '600 bps', value: '0100' },
  { label: '300 bps', value: '0011' },
];

const STOP_BIT_OPTIONS = [
  { label: '1 bit', value: '0' },
  { label: '2 bit', value: '1' },
];

const PARITY_OPTIONS = [
  { label: 'None', value: '00' },
  { label: 'Odd (Lẻ)', value: '01' },
  { label: 'Even (Chẵn)', value: '11' },
];

const DATA_LENGTH_OPTIONS = [
  { label: '8 bit', value: '1' },
  { label: '7 bit', value: '0' },
];

export default function Rs485HexCalculator() {
  const [protocol, setProtocol] = useState('1000');
  const [baud, setBaud] = useState('1000');
  const [stopBit, setStopBit] = useState('0');
  const [parity, setParity] = useState('00');
  const [dataLength, setDataLength] = useState('1');

  const { binaryString, binaryFormatted, hexCode, ladderCommand } = useMemo(() => {
    const reserved = '0000';
    const bin = protocol + reserved + baud + stopBit + parity + dataLength;
    const formatted = bin.replace(/(.{4})/g, '$1 ').trim();
    const decimal = parseInt(bin, 2);
    const hex = decimal.toString(16).toUpperCase().padStart(4, '0');
    return {
      binaryString: bin,
      binaryFormatted: formatted,
      hexCode: `H${hex}`,
      ladderCommand: `MOV H${hex} D8120`,
    };
  }, [protocol, baud, stopBit, parity, dataLength]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tính Mã Hex Cấu Hình RS485 (D8120)
        </h1>
        <p className="text-muted-foreground">
          Công cụ tính toán mã Hex cho thanh ghi D8120/D8420 — PLC Mitsubishi dòng FX.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông số truyền thông</CardTitle>
          <CardDescription>Lựa chọn các thông số để cấu hình kết nối RS485.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Giao thức (Bit 15-12)</Label>
              <Select value={protocol} onValueChange={setProtocol}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Chọn giao thức" />
                </SelectTrigger>
                <SelectContent>
                  {PROTOCOL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tốc độ Baud (Bit 7-4)</Label>
              <Select value={baud} onValueChange={setBaud}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Chọn tốc độ" />
                </SelectTrigger>
                <SelectContent>
                  {BAUD_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stop Bit (Bit 3)</Label>
              <Select value={stopBit} onValueChange={setStopBit}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Chọn Stop Bit" />
                </SelectTrigger>
                <SelectContent>
                  {STOP_BIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Parity (Bit 2-1)</Label>
              <Select value={parity} onValueChange={setParity}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Chọn Parity" />
                </SelectTrigger>
                <SelectContent>
                  {PARITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Độ dài dữ liệu (Bit 0)</Label>
              <Select value={dataLength} onValueChange={setDataLength}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Chọn độ dài" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_LENGTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Kết quả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-xs text-primary uppercase tracking-wider">Chuỗi nhị phân 16-bit</Label>
            <div className="mt-1 font-mono text-lg font-bold tracking-widest text-foreground">
              {binaryFormatted}
            </div>
          </div>

          <div>
            <Label className="text-xs text-primary uppercase tracking-wider">Mã Hex</Label>
            <div className="mt-1 font-mono text-3xl font-black text-primary">
              {hexCode}
            </div>
          </div>

          <div>
            <Label className="text-xs text-primary uppercase tracking-wider">Lệnh Ladder (D8120)</Label>
            <div className="mt-1 p-3 bg-secondary rounded-lg font-mono text-base text-secondary-foreground inline-block">
              {ladderCommand}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bit Map (16-bit)</CardTitle>
          <CardDescription>Cấu trúc chi tiết của thanh ghi D8120.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 16 }, (_, i) => (
                  <TableHead key={i} className="text-center px-1 font-semibold text-muted-foreground">{15 - i}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {binaryString.split('').map((bit, i) => (
                  <TableCell key={i} className="text-center px-1 py-3 border-r last:border-r-0">
                    <Badge variant={bit === '1' ? 'default' : 'outline'} className="font-mono text-sm w-6 justify-center">
                      {bit}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
