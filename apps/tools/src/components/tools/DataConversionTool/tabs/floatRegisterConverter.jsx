import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toHex, floatToRegisters, registersToFloat } from "../utils";

export default function FloatRegisterConverter() {
  const [mode, setMode] = useState("float_to_reg"); // float_to_reg | reg_to_float
  const [floatInput, setFloatInput] = useState("3.14");
  const [hiReg, setHiReg] = useState("4048");
  const [loReg, setLoReg] = useState("F5C3");
  const [wordOrder, setWordOrder] = useState("hi_first"); // hi_first | lo_first

  let result = null;

  if (mode === "float_to_reg") {
    const f = parseFloat(floatInput);
    if (!isNaN(f)) {
      const { hi, lo } = floatToRegisters(f);
      result = {
        hi,
        lo,
        hiHex: toHex(hi, 4),
        loHex: toHex(lo, 4),
        float: f,
      };
    }
  } else {
    const hi = parseInt(hiReg, 16);
    const lo = parseInt(loReg, 16);
    if (!isNaN(hi) && !isNaN(lo)) {
      const f =
        wordOrder === "hi_first"
          ? registersToFloat(hi, lo)
          : registersToFloat(lo, hi);
      result = { hi, lo, hiHex: toHex(hi, 4), loHex: toHex(lo, 4), float: f };
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Float 32-bit ↔ Thanh ghi Modbus
          </CardTitle>
          <CardDescription>
            Chuyển đổi số thực IEEE 754 sang 2 thanh ghi 16-bit (Holding
            Register).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "float_to_reg" ? "default" : "outline"}
              onClick={() => setMode("float_to_reg")}
            >
              Float → Register
            </Button>
            <Button
              size="sm"
              variant={mode === "reg_to_float" ? "default" : "outline"}
              onClick={() => setMode("reg_to_float")}
            >
              Register → Float
            </Button>
          </div>

          {mode === "float_to_reg" ? (
            <div className="space-y-2">
              <Label>Giá trị số thực (Float 32)</Label>
              <Input
                className="font-mono"
                type="number"
                step="any"
                value={floatInput}
                onChange={(e) => setFloatInput(e.target.value)}
                placeholder="VD: 3.14"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Register 1 (HEX)</Label>
                  <Input
                    className="font-mono uppercase"
                    value={hiReg}
                    onChange={(e) => setHiReg(e.target.value.toUpperCase())}
                    placeholder="VD: 4048"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Register 2 (HEX)</Label>
                  <Input
                    className="font-mono uppercase"
                    value={loReg}
                    onChange={(e) => setLoReg(e.target.value.toUpperCase())}
                    placeholder="VD: F5C3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Thứ tự Word</Label>
                <Select value={wordOrder} onValueChange={setWordOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi_first">
                      High Word trước (Big-Endian)
                    </SelectItem>
                    <SelectItem value="lo_first">
                      Low Word trước (Little-Endian Word)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary text-base">
            Kết quả Float / Register
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                  Giá trị Float
                </span>
                <div className="font-mono text-3xl font-black text-primary">
                  {result.float.toPrecision(7)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="p-3 rounded-lg bg-background border text-center">
                  <div className="text-[10px] text-muted-foreground mb-1">
                    Register 1 (High Word)
                  </div>
                  <div className="font-mono font-bold text-lg">
                    0x{result.hiHex}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {result.hi}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-background border text-center">
                  <div className="text-[10px] text-muted-foreground mb-1">
                    Register 2 (Low Word)
                  </div>
                  <div className="font-mono font-bold text-lg">
                    0x{result.loHex}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {result.lo}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                <div>
                  IEEE 754 Bytes:{" "}
                  <span className="font-mono">
                    {toHex(result.hi >> 8, 2)} {toHex(result.hi & 0xff, 2)}{" "}
                    {toHex(result.lo >> 8, 2)} {toHex(result.lo & 0xff, 2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nhập giá trị hợp lệ để xem kết quả.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
