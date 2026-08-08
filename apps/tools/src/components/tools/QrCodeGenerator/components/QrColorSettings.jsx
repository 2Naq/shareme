import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function QrColorSettings({
  dotsColorType,
  setDotsColorType,
  dotsColor,
  setDotsColor,
  dotsGradType,
  setDotsGradType,
  dotsGradColor1,
  setDotsGradColor1,
  dotsGradColor2,
  setDotsGradColor2,
  dotsGradRot,
  setDotsGradRot,
  cornersColor,
  setCornersColor,
  customCornersColor,
  setCustomCornersColor,
  cornersDotColor,
  setCornersDotColor,
  customCornersDotColor,
  setCustomCornersDotColor,
  bgColor,
  setBgColor,
  isBgTransparent,
  setIsBgTransparent,
}) {
  return (
    <Card>
      <CardContent className="space-y-6 p-5">
        {/* Màu các chấm (Dots) */}
        <div className="space-y-3">
          <Label className="block text-sm font-bold">
            1. Màu họa tiết (Dots Color):
          </Label>
          <RadioGroup
            value={dotsColorType}
            onValueChange={setDotsColorType}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="col-single" />
              <Label htmlFor="col-single" className="cursor-pointer">
                Màu đơn
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gradient" id="col-grad" />
              <Label htmlFor="col-grad" className="cursor-pointer">
                Màu Gradient (Chuyển màu)
              </Label>
            </div>
          </RadioGroup>

          {dotsColorType === "single" ? (
            <div className="flex items-center gap-3 pt-1">
              <Input
                type="color"
                value={dotsColor}
                onChange={(e) => setDotsColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border p-0"
              />
              <Input
                type="text"
                value={dotsColor}
                onChange={(e) => setDotsColor(e.target.value)}
                className="h-10 w-32"
              />
            </div>
          ) : (
            <div className="border-muted space-y-3 border-l-2 pt-1 pl-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Màu bắt đầu:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={dotsGradColor1}
                      onChange={(e) => setDotsGradColor1(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded p-0"
                    />
                    <Input
                      type="text"
                      value={dotsGradColor1}
                      onChange={(e) => setDotsGradColor1(e.target.value)}
                      className="h-8 w-24 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Màu kết thúc:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={dotsGradColor2}
                      onChange={(e) => setDotsGradColor2(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded p-0"
                    />
                    <Input
                      type="text"
                      value={dotsGradColor2}
                      onChange={(e) => setDotsGradColor2(e.target.value)}
                      className="h-8 w-24 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Loại Gradient:</Label>
                  <Select value={dotsGradType} onValueChange={setDotsGradType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">
                        Tuyến tính (Linear)
                      </SelectItem>
                      <SelectItem value="radial">Tỏa tròn (Radial)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {dotsGradType === "linear" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Góc xoay: {dotsGradRot}°</Label>
                    <Slider
                      min={0}
                      max={360}
                      step={5}
                      value={[dotsGradRot]}
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        if (typeof val === "number" && !isNaN(val)) {
                          setDotsGradRot(val);
                        }
                      }}
                      className="py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Họa tiết Viền Mắt (Corners Square Color) */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">
              2. Màu viền mắt (Corners Square Color):
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="custom-corners"
                checked={customCornersColor}
                onCheckedChange={setCustomCornersColor}
              />
              <Label
                htmlFor="custom-corners"
                className="cursor-pointer text-xs"
              >
                Tùy biến màu riêng
              </Label>
            </div>
          </div>
          {customCornersColor && (
            <div className="border-muted flex items-center gap-3 border-l-2 pt-1 pl-3">
              <Input
                type="color"
                value={cornersColor}
                onChange={(e) => setCornersColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded p-0"
              />
              <Input
                type="text"
                value={cornersColor}
                onChange={(e) => setCornersColor(e.target.value)}
                className="h-8 w-28 text-xs"
              />
            </div>
          )}
        </div>

        {/* Nhân Mắt (Corners Dot Color) */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">
              3. Màu nhân mắt (Corners Dot Color):
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="custom-corners-dot"
                checked={customCornersDotColor}
                onCheckedChange={setCustomCornersDotColor}
              />
              <Label
                htmlFor="custom-corners-dot"
                className="cursor-pointer text-xs"
              >
                Tùy biến màu riêng
              </Label>
            </div>
          </div>
          {customCornersDotColor && (
            <div className="border-muted flex items-center gap-3 border-l-2 pt-1 pl-3">
              <Input
                type="color"
                value={cornersDotColor}
                onChange={(e) => setCornersDotColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded p-0"
              />
              <Input
                type="text"
                value={cornersDotColor}
                onChange={(e) => setCornersDotColor(e.target.value)}
                className="h-8 w-28 text-xs"
              />
            </div>
          )}
        </div>

        {/* Màu nền QR (Background Options) */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">
              4. Màu nền (Background Color):
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="transparent-bg"
                checked={isBgTransparent}
                onCheckedChange={setIsBgTransparent}
              />
              <Label
                htmlFor="transparent-bg"
                className="cursor-pointer text-xs"
              >
                Nền trong suốt
              </Label>
            </div>
          </div>
          {!isBgTransparent && (
            <div className="border-muted flex items-center gap-3 border-l-2 pt-1 pl-3">
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded p-0"
              />
              <Input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-28 text-xs"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
