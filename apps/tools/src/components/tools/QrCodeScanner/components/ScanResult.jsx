import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Mail,
  Phone,
  X,
  FileText,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ScanResult({ result, onReset }) {
  const [copiedKey, setCopiedKey] = useState(null); // 'all', 'ssid', 'pass', 'text'
  const [showPassword, setShowPassword] = useState(false);

  // Copy to clipboard helper
  const handleCopy = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedKey(key);
        toast.success("Đã sao chép vào clipboard!");
        setTimeout(() => setCopiedKey(null), 2000);
      })
      .catch(() => {
        toast.error("Không thể sao chép. Vui lòng thử thủ công.");
      });
  };

  // Xác định định dạng nội dung
  const getResultType = () => {
    if (!result) return "text";
    const lower = result.toLowerCase().trim();
    if (lower.startsWith("http://") || lower.startsWith("https://"))
      return "url";
    if (lower.startsWith("wifi:")) return "wifi";
    if (lower.startsWith("mailto:")) return "email";
    if (lower.startsWith("tel:")) return "phone";
    return "text";
  };

  const resultType = getResultType();

  // Parser Wi-Fi
  const parseWifi = (wifiStr) => {
    // Định dạng: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
    const getField = (regex) => {
      const match = wifiStr.match(regex);
      return match ? match[1] : "";
    };

    const ssid = getField(/S:([^;]+)/);
    const password = getField(/P:([^;]+)/);
    const encryption = getField(/T:([^;]+)/) || "None";
    const hidden = getField(/H:([^;]+)/) === "true";

    return { ssid, password, encryption, hidden };
  };

  // Parser Email
  const parseEmail = (emailStr) => {
    // mailto:abc@gmail.com?subject=Tieu%20de&body=Noi%20dung
    const email = emailStr.replace(/mailto:/i, "").split("?")[0];

    let subject = "";
    let body = "";

    const paramsMatch = emailStr.match(/\?(.+)/);
    if (paramsMatch) {
      const params = new URLSearchParams(paramsMatch[1]);
      subject = params.get("subject") || "";
      body = params.get("body") || "";
    }

    return { email, subject, body };
  };

  // Parser Phone
  const parsePhone = (phoneStr) => {
    return phoneStr.replace(/tel:/i, "").trim();
  };

  // Render nội dung tương ứng với kiểu kết quả
  const renderDetails = () => {
    switch (resultType) {
      case "url":
        return (
          <div className="space-y-4">
            <div className="bg-primary/5 border-primary/10 text-primary rounded-lg border p-4 text-center font-medium break-all select-all">
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:underline"
              >
                {result}
              </a>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleCopy(result, "url")}
                className="hover:bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-xs transition-all"
              >
                {copiedKey === "url" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Sao chép liên kết
              </button>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/95 text-primary-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                Mở liên kết
              </a>
            </div>
          </div>
        );

      case "wifi":
        const wifi = parseWifi(result);
        return (
          <div className="space-y-4">
            <div className="bg-muted/10 divide-y overflow-hidden rounded-lg border">
              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  Tên mạng (SSID)
                </span>
                <span className="text-foreground col-span-2 flex items-center justify-between font-semibold">
                  <span>{wifi.ssid || "(Trống)"}</span>
                  {wifi.ssid && (
                    <button
                      onClick={() => handleCopy(wifi.ssid, "ssid")}
                      className="hover:bg-muted text-muted-foreground cursor-pointer rounded p-1 transition-all"
                      title="Copy SSID"
                    >
                      {copiedKey === "ssid" ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  Mật khẩu
                </span>
                <span className="text-foreground col-span-2 flex items-center justify-between font-semibold">
                  <span className="font-mono">
                    {wifi.password
                      ? showPassword
                        ? wifi.password
                        : "••••••••"
                      : "(Không có)"}
                  </span>
                  <div className="flex gap-1.5">
                    {wifi.password && (
                      <>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="hover:bg-muted text-muted-foreground cursor-pointer rounded p-1 transition-all"
                          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(wifi.password, "pass")}
                          className="hover:bg-muted text-muted-foreground cursor-pointer rounded p-1 transition-all"
                          title="Copy Password"
                        >
                          {copiedKey === "pass" ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  Bảo mật
                </span>
                <span className="text-foreground col-span-2 font-medium uppercase">
                  {wifi.encryption}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  Mạng ẩn
                </span>
                <span className="text-foreground col-span-2 flex items-center gap-1.5 font-medium">
                  {wifi.hidden ? (
                    <>
                      <Lock className="h-4 w-4 text-amber-500" /> Có (Ẩn)
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 text-green-500" /> Không
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleCopy(result, "all")}
                className="hover:bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-xs transition-all"
              >
                {copiedKey === "all" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Sao chép chuỗi Wi-Fi gốc
              </button>
            </div>
          </div>
        );

      case "email":
        const emailData = parseEmail(result);
        return (
          <div className="space-y-4">
            <div className="bg-muted/10 divide-y overflow-hidden rounded-lg border">
              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  Gửi đến
                </span>
                <span className="text-foreground col-span-2 truncate font-semibold select-all">
                  {emailData.email}
                </span>
              </div>
              {emailData.subject && (
                <div className="grid grid-cols-3 p-3 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Tiêu đề
                  </span>
                  <span className="text-foreground col-span-2 font-medium">
                    {emailData.subject}
                  </span>
                </div>
              )}
              {emailData.body && (
                <div className="grid grid-cols-3 p-3 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Nội dung
                  </span>
                  <span className="text-foreground col-span-2 text-xs whitespace-pre-wrap">
                    {emailData.body}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleCopy(emailData.email, "email")}
                className="hover:bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-xs transition-all"
              >
                {copiedKey === "email" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy Địa chỉ Email
              </button>
              <a
                href={result}
                className="bg-primary hover:bg-primary/95 text-primary-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all"
              >
                <Mail className="h-4 w-4" />
                Soạn Email ngay
              </a>
            </div>
          </div>
        );

      case "phone":
        const phoneNum = parsePhone(result);
        return (
          <div className="space-y-4 text-center">
            <div className="bg-muted/20 text-foreground rounded-lg border p-4 font-mono text-xl font-bold tracking-wider select-all">
              {phoneNum}
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleCopy(phoneNum, "phone")}
                className="hover:bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-xs transition-all"
              >
                {copiedKey === "phone" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Sao chép số
              </button>
              <a
                href={`tel:${phoneNum}`}
                className="bg-primary hover:bg-primary/95 text-primary-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all"
              >
                <Phone className="h-4 w-4" />
                Gọi điện
              </a>
            </div>
          </div>
        );

      case "text":
      default:
        return (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                readOnly
                value={result}
                className="bg-muted/40 text-foreground focus:ring-primary/30 min-h-35 w-full resize-none rounded-lg border p-3 font-mono text-sm focus:ring-1 focus:outline-none"
              />
              <button
                onClick={() => handleCopy(result, "text")}
                className="bg-background hover:bg-muted text-foreground absolute right-3 bottom-3 flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all"
              >
                {copiedKey === "text" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Sao chép
              </button>
            </div>
          </div>
        );
    }
  };

  // Trả về Header Icon
  const getHeaderIcon = () => {
    const size = "w-6 h-6";
    switch (resultType) {
      case "url":
        return <ExternalLink className={`${size} text-blue-500`} />;
      case "wifi":
        return <Wifi className={`${size} text-green-500`} />;
      case "email":
        return <Mail className={`${size} text-cyan-500`} />;
      case "phone":
        return <Phone className={`${size} text-indigo-500`} />;
      case "text":
      default:
        return <FileText className={`${size} text-muted-foreground`} />;
    }
  };

  // Trả về nhãn kiểu kết quả
  const getResultLabel = () => {
    switch (resultType) {
      case "url":
        return "Liên kết (URL)";
      case "wifi":
        return "Cấu hình Wi-Fi";
      case "email":
        return "Thư điện tử (Email)";
      case "phone":
        return "Số điện thoại";
      case "text":
      default:
        return "Văn bản thuần túy (Text)";
    }
  };

  return (
    <Card className="bg-card border-primary/20 border shadow-lg">
      <CardHeader className="border-muted/50 border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted/50 shrink-0 rounded-lg p-2">
            {getHeaderIcon()}
          </div>
          <div>
            <CardTitle className="text-foreground text-lg font-bold">
              Kết Quả Giải Mã
            </CardTitle>
            <CardDescription className="text-xs">
              Định dạng:{" "}
              <span className="text-primary font-semibold">
                {getResultLabel()}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">{renderDetails()}</CardContent>

      <CardFooter className="border-muted/50 mt-2 flex justify-between border-t pt-4">
        <button
          onClick={onReset}
          className="hover:bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-xs transition-all"
        >
          <X className="h-4 w-4" />
          Xóa kết quả
        </button>
      </CardFooter>
    </Card>
  );
}
