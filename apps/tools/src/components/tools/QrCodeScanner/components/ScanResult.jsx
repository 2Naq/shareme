import React, { useState } from "react";
import { 
  Copy, Check, ExternalLink, Wifi, Mail, Phone, 
  ArrowLeft, FileText, Lock, Unlock, Eye, EyeOff 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ScanResult({ result, onReset }) {
  const [copiedKey, setCopiedKey] = useState(null); // 'all', 'ssid', 'pass', 'text'
  const [showPassword, setShowPassword] = useState(false);

  // Copy to clipboard helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
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
    if (lower.startsWith("http://") || lower.startsWith("https://")) return "url";
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
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 select-all font-medium text-primary text-center break-all">
              <a 
                href={result} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline flex items-center justify-center gap-1.5 inline-flex"
              >
                {result}
                <ExternalLink className="w-4 h-4 inline shrink-0" />
              </a>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleCopy(result, "url")}
                className="px-4 py-2 border hover:bg-muted text-foreground text-sm font-medium rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === "url" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Sao chép liên kết
              </button>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Mở liên kết
              </a>
            </div>
          </div>
        );

      case "wifi":
        const wifi = parseWifi(result);
        return (
          <div className="space-y-4">
            <div className="rounded-lg border divide-y overflow-hidden bg-muted/10">
              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">Tên mạng (SSID)</span>
                <span className="col-span-2 text-foreground font-semibold flex items-center justify-between">
                  <span>{wifi.ssid || "(Trống)"}</span>
                  {wifi.ssid && (
                    <button 
                      onClick={() => handleCopy(wifi.ssid, "ssid")}
                      className="p-1 hover:bg-muted rounded text-muted-foreground transition-all cursor-pointer"
                      title="Copy SSID"
                    >
                      {copiedKey === "ssid" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </span>
              </div>
              
              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">Mật khẩu</span>
                <span className="col-span-2 text-foreground font-semibold flex items-center justify-between">
                  <span className="font-mono">
                    {wifi.password ? (showPassword ? wifi.password : "••••••••") : "(Không có)"}
                  </span>
                  <div className="flex gap-1.5">
                    {wifi.password && (
                      <>
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 hover:bg-muted rounded text-muted-foreground transition-all cursor-pointer"
                          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={() => handleCopy(wifi.password, "pass")}
                          className="p-1 hover:bg-muted rounded text-muted-foreground transition-all cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedKey === "pass" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">Bảo mật</span>
                <span className="col-span-2 text-foreground font-medium uppercase">
                  {wifi.encryption}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">Mạng ẩn</span>
                <span className="col-span-2 text-foreground font-medium flex items-center gap-1.5">
                  {wifi.hidden ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-500" /> Có (Ẩn)
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-green-500" /> Không
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => handleCopy(result, "all")}
                className="px-4 py-2 border hover:bg-muted text-foreground text-sm font-medium rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === "all" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Sao chép chuỗi Wi-Fi gốc
              </button>
            </div>
          </div>
        );

      case "email":
        const emailData = parseEmail(result);
        return (
          <div className="space-y-4">
            <div className="rounded-lg border divide-y overflow-hidden bg-muted/10">
              <div className="grid grid-cols-3 p-3 text-sm">
                <span className="text-muted-foreground font-medium">Gửi đến</span>
                <span className="col-span-2 text-foreground font-semibold truncate select-all">
                  {emailData.email}
                </span>
              </div>
              {emailData.subject && (
                <div className="grid grid-cols-3 p-3 text-sm">
                  <span className="text-muted-foreground font-medium">Tiêu đề</span>
                  <span className="col-span-2 text-foreground font-medium">
                    {emailData.subject}
                  </span>
                </div>
              )}
              {emailData.body && (
                <div className="grid grid-cols-3 p-3 text-sm">
                  <span className="text-muted-foreground font-medium">Nội dung</span>
                  <span className="col-span-2 text-foreground text-xs whitespace-pre-wrap">
                    {emailData.body}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleCopy(emailData.email, "email")}
                className="px-4 py-2 border hover:bg-muted text-foreground text-sm font-medium rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === "email" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Copy Địa chỉ Email
              </button>
              <a
                href={result}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Soạn Email ngay
              </a>
            </div>
          </div>
        );

      case "phone":
        const phoneNum = parsePhone(result);
        return (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-muted/20 rounded-lg border font-mono text-xl text-foreground font-bold select-all tracking-wider">
              {phoneNum}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleCopy(phoneNum, "phone")}
                className="px-4 py-2 border hover:bg-muted text-foreground text-sm font-medium rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === "phone" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Sao chép số
              </button>
              <a
                href={`tel:${phoneNum}`}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
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
                className="w-full min-h-[140px] p-3 text-sm font-mono border rounded-lg bg-muted/40 text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <button
                onClick={() => handleCopy(result, "text")}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-background border hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === "text" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
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
      case "url": return <ExternalLink className={`${size} text-blue-500`} />;
      case "wifi": return <Wifi className={`${size} text-green-500`} />;
      case "email": return <Mail className={`${size} text-cyan-500`} />;
      case "phone": return <Phone className={`${size} text-indigo-500`} />;
      case "text":
      default:
        return <FileText className={`${size} text-muted-foreground`} />;
    }
  };

  // Trả về nhãn kiểu kết quả
  const getResultLabel = () => {
    switch (resultType) {
      case "url": return "Liên kết (URL)";
      case "wifi": return "Cấu hình Wi-Fi";
      case "email": return "Thư điện tử (Email)";
      case "phone": return "Số điện thoại";
      case "text":
      default:
        return "Văn bản thuần túy (Text)";
    }
  };

  return (
    <Card className="border shadow-lg bg-card border-primary/20">
      <CardHeader className="pb-3 border-b border-muted/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted/50 rounded-lg shrink-0">
            {getHeaderIcon()}
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Kết Quả Giải Mã</CardTitle>
            <CardDescription className="text-xs">
              Định dạng: <span className="font-semibold text-primary">{getResultLabel()}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {renderDetails()}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-muted/50 pt-4 mt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 border hover:bg-muted text-foreground text-sm font-semibold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Quét mã khác
        </button>
      </CardFooter>
    </Card>
  );
}
