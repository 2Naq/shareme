import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  RotateCcw,
  Link as LinkIcon,
  Wifi,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QR_TYPES = [
  { id: "text", label: "Văn bản / URL", icon: LinkIcon },
  { id: "wifi", label: "Mạng Wi-Fi", icon: Wifi },
  { id: "email", label: "Thư Điện Tử", icon: Mail },
  { id: "phone", label: "Số Điện Thoại", icon: Phone },
];

export default function QrContentInput({
  contentType,
  setContentType,
  textVal,
  setTextVal,
  wifiSsid,
  setWifiSsid,
  wifiPass,
  setWifiPass,
  wifiEncryption,
  setWifiEncryption,
  wifiHidden,
  setWifiHidden,
  emailAddr,
  setEmailAddr,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  phoneNumber,
  setPhoneNumber,
  handleResetAll,
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 mb-2">
          <span className="font-bold text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            1. Nhập Nội Dung Mã QR
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="h-8 gap-1.5 text-xs text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Tất Cả
          </Button>
        </div>

        {/* Loại nội dung */}
        <div className="grid grid-cols-4 gap-2">
          {QR_TYPES.map((type) => {
            const Icon = type.icon;
            const active = contentType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setContentType(type.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all gap-1.5",
                  active
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:bg-muted text-muted-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] sm:text-xs">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form nhập liệu tương ứng */}
        <div className="pt-2">
          {contentType === "text" && (
            <div className="space-y-2">
              <Label htmlFor="qr-text">Đường dẫn liên kết hoặc Văn bản:</Label>
              <Textarea
                id="qr-text"
                placeholder="Nhập link (ví dụ: https://...) hoặc thông tin cần mã hóa..."
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                className="min-h-20"
              />
            </div>
          )}

          {contentType === "wifi" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wifi-ssid">Tên WiFi (SSID):</Label>
                  <Input
                    id="wifi-ssid"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Nhập tên mạng WiFi"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wifi-pass">Mật khẩu:</Label>
                  <Input
                    id="wifi-pass"
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Mật khẩu WiFi"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <Label>Bảo mật:</Label>
                  <Select
                    value={wifiEncryption}
                    onValueChange={setWifiEncryption}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">
                        Không mật khẩu (Open)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <Switch
                    id="wifi-hidden"
                    checked={wifiHidden}
                    onCheckedChange={setWifiHidden}
                  />
                  <Label htmlFor="wifi-hidden" className="cursor-pointer">
                    WiFi ẩn SSID
                  </Label>
                </div>
              </div>
            </div>
          )}

          {contentType === "email" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email-addr">Địa chỉ Email:</Label>
                <Input
                  id="email-addr"
                  type="email"
                  value={emailAddr}
                  onChange={(e) => setEmailAddr(e.target.value)}
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-subject">Tiêu đề (Subject):</Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Nhập tiêu đề mail"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-body">Nội dung thư (Body):</Label>
                <Textarea
                  id="email-body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Nội dung soạn sẵn..."
                  className="min-h-20"
                />
              </div>
            </div>
          )}

          {contentType === "phone" && (
            <div className="space-y-2">
              <Label htmlFor="phone-num">Số điện thoại:</Label>
              <Input
                id="phone-num"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại (ví dụ: +84...)"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
