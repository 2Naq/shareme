import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QrDesignSettings({
  dotsType,
  setDotsType,
  cornersType,
  setCornersType,
  cornersDotType,
  setCornersDotType
}) {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        {/* Kiểu của các chấm (Dots Options) */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">1. Kiểu họa tiết (Dots Pattern):</Label>
          <Select value={dotsType} onValueChange={setDotsType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Hình vuông (Square)</SelectItem>
              <SelectItem value="dots">Chấm tròn nhỏ (Dots)</SelectItem>
              <SelectItem value="rounded">Bo góc vừa (Rounded)</SelectItem>
              <SelectItem value="extra-rounded">Bo góc tròn hẳn (Extra Rounded)</SelectItem>
              <SelectItem value="classy">Sang trọng chéo (Classy)</SelectItem>
              <SelectItem value="classy-rounded">Sang trọng chéo bo góc (Classy Rounded)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Giao diện khung góc (Corners Square) */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">2. Họa tiết viền mắt (Corners Square):</Label>
          <Select value={cornersType} onValueChange={setCornersType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Khung vuông (Square)</SelectItem>
              <SelectItem value="dot">Khung tròn (Dot)</SelectItem>
              <SelectItem value="extra-rounded">Khung bo góc lớn (Extra Rounded)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nhân mắt (Corners Dot) */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">3. Nhân mắt trong (Corners Dot):</Label>
          <Select value={cornersDotType} onValueChange={setCornersDotType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Nhân vuông (Square)</SelectItem>
              <SelectItem value="dot">Nhân tròn (Dot)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
