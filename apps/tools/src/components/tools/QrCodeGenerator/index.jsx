import React, { useState, useEffect, useRef, useMemo } from "react";
import QRCodeStyling from "qr-code-styling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Paintbrush, Image as ImageIcon, Palette } from "lucide-react";
import { toast } from "sonner";

// Import sub-components
import QrContentInput from "./components/QrContentInput";
import QrDesignSettings from "./components/QrDesignSettings";
import QrColorSettings from "./components/QrColorSettings";
import QrLogoSettings from "./components/QrLogoSettings";
import QrPreviewCard from "./components/QrPreviewCard";

export default function QrCodeGenerator() {
  const qrRef = useRef(null);

  // 1. Dữ liệu đầu vào
  const [contentType, setContentType] = useState("text");
  const [textVal, setTextVal] = useState("https://github.com/2naq/shareme");

  // Wi-Fi State
  const [wifiSsid, setWifiSsid] = useState("ShareMe_WiFi");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email State
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Phone State
  const [phoneNumber, setPhoneNumber] = useState("");

  // 2. Tùy chỉnh Style (Dots)
  const [dotsType, setDotsType] = useState("rounded");
  const [dotsColorType, setDotsColorType] = useState("single");
  const [dotsColor, setDotsColor] = useState("#2563eb");
  const [dotsGradType, setDotsGradType] = useState("linear");
  const [dotsGradColor1, setDotsGradColor1] = useState("#2563eb");
  const [dotsGradColor2, setDotsGradColor2] = useState("#21c0bd");
  const [dotsGradRot, setDotsGradRot] = useState(0);

  // Góc mắt ngoài (Corners Square)
  const [cornersType, setCornersType] = useState("extra-rounded");
  const [cornersColor, setCornersColor] = useState("#1e40af");
  const [customCornersColor, setCustomCornersColor] = useState(false);

  // Nhân mắt trong (Corners Dot)
  const [cornersDotType, setCornersDotType] = useState("dot");
  const [cornersDotColor, setCornersDotColor] = useState("#1d4ed8");
  const [customCornersDotColor, setCustomCornersDotColor] = useState(false);

  // Background
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isBgTransparent, setIsBgTransparent] = useState(false);

  // 3. Logo/Image
  const [logoFile, setLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(0.3); // Kích thước tương đối (0.15 - 0.40)
  const [logoMargin, setLogoMargin] = useState(4);
  const [excavateLogo, setExcavateLogo] = useState(true);

  // 4. Download Config
  const [downloadSize, setDownloadSize] = useState(512);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [fileName, setFileName] = useState("shareme-qrcode");

  const [qrCodeInstance, setQrCodeInstance] = useState(null);

  // Tính toán dữ liệu QR thực tế sẽ encode
  const finalQrData = useMemo(() => {
    switch (contentType) {
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPass};H:${wifiHidden ? "true" : "false"};;`;
      case "email":
        const params = [];
        if (emailSubject)
          params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return `mailto:${emailAddr}${params.length > 0 ? "?" + params.join("&") : ""}`;
      case "phone":
        return `tel:${phoneNumber}`;
      case "text":
      default:
        return textVal;
    }
  }, [
    contentType,
    textVal,
    wifiSsid,
    wifiPass,
    wifiEncryption,
    wifiHidden,
    emailAddr,
    emailSubject,
    emailBody,
    phoneNumber,
  ]);

  // Cấu hình options cho qr-code-styling
  const qrOptions = useMemo(() => {
    const backgroundOptions = {
      color: isBgTransparent ? "transparent" : bgColor,
    };

    const dotsOptions = {
      type: dotsType,
      color: dotsColorType === "single" ? dotsColor : undefined,
      gradient:
        dotsColorType === "gradient"
          ? {
              type: dotsGradType,
              rotation: (dotsGradRot * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: dotsGradColor1 },
                { offset: 1, color: dotsGradColor2 },
              ],
            }
          : undefined,
    };

    const cornersSquareOptions = {
      type: cornersType,
      color: customCornersColor
        ? cornersColor
        : dotsColorType === "single"
          ? dotsColor
          : dotsGradColor1,
    };

    const cornersDotOptions = {
      type: cornersDotType,
      color: customCornersDotColor
        ? cornersDotColor
        : dotsColorType === "single"
          ? dotsColor
          : dotsGradColor1,
    };

    return {
      width: 280,
      height: 280,
      type: "svg", // Render dạng SVG để sắc nét khi preview
      data: finalQrData || " ",
      margin: 12,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H", // Level H để chèn logo an toàn
      },
      image: logoFile || undefined,
      imageOptions: {
        hideBackgroundDots: excavateLogo,
        imageSize: logoSize,
        margin: logoMargin,
        crossOrigin: "anonymous",
      },
      dotsOptions,
      backgroundOptions,
      cornersSquareOptions,
      cornersDotOptions,
    };
  }, [
    finalQrData,
    dotsType,
    dotsColorType,
    dotsColor,
    dotsGradType,
    dotsGradColor1,
    dotsGradColor2,
    dotsGradRot,
    cornersType,
    cornersColor,
    customCornersColor,
    cornersDotType,
    cornersDotColor,
    customCornersDotColor,
    bgColor,
    isBgTransparent,
    logoFile,
    logoSize,
    logoMargin,
    excavateLogo,
  ]);

  // Khởi tạo hoặc cập nhật QR Code preview
  useEffect(() => {
    if (!qrRef.current) return;

    // Reset container
    qrRef.current.innerHTML = "";

    try {
      const qrCode = new QRCodeStyling(qrOptions);
      qrCode.append(qrRef.current);
      setQrCodeInstance(qrCode);
    } catch (err) {
      console.error("Lỗi vẽ QR Code: ", err);
    }
  }, [qrOptions]);

  // Xử lý upload logo
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Vui lòng tải ảnh nhỏ hơn 2MB để tránh lỗi bộ nhớ.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoFile(event.target.result);
        toast.success("Đã tải logo lên thành công!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Logo
  const handleResetLogo = () => {
    setLogoFile(null);
    toast.info("Đã xóa logo.");
  };

  // Xử lý Download QR Code
  const handleDownload = () => {
    if (!qrCodeInstance) {
      toast.error("Mã QR chưa sẵn sàng để tải xuống.");
      return;
    }

    try {
      const downloadQr = new QRCodeStyling({
        ...qrOptions,
        width: downloadSize,
        height: downloadSize,
        type: downloadFormat === "svg" ? "svg" : "canvas",
      });

      downloadQr.download({
        name: fileName || "shareme-qrcode",
        extension: downloadFormat,
      });

      toast.success(
        `Đã tải xuống mã QR (${downloadSize}x${downloadSize} px) dưới định dạng ${downloadFormat.toUpperCase()}!`,
      );
    } catch (err) {
      toast.error(
        "Không thể tải mã QR về máy. Vui lòng kiểm tra lại cấu hình ảnh.",
      );
      console.error(err);
    }
  };

  // Reset tất cả cấu hình về mặc định
  const handleResetAll = () => {
    setTextVal("https://github.com/2naq/shareme");
    setContentType("text");
    setWifiSsid("ShareMe_WiFi");
    setWifiPass("");
    setWifiEncryption("WPA");
    setWifiHidden(false);
    setEmailAddr("");
    setEmailSubject("");
    setEmailBody("");
    setPhoneNumber("");
    setDotsType("rounded");
    setDotsColorType("single");
    setDotsColor("#2563eb");
    setDotsGradColor1("#2563eb");
    setDotsGradColor2("#21c0bd");
    setDotsGradRot(0);
    setCornersType("extra-rounded");
    setCornersColor("#1e40af");
    setCustomCornersColor(false);
    setCornersDotType("dot");
    setCornersDotColor("#1d4ed8");
    setCustomCornersDotColor(false);
    setBgColor("#ffffff");
    setIsBgTransparent(false);
    setLogoFile(null);
    setLogoSize(0.3);
    setLogoMargin(4);
    setExcavateLogo(true);
    toast.success("Đã hoàn tác tất cả thay đổi về mặc định!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <QrCode className="w-8 h-8 text-primary" />
          Tạo Mã QR Code
        </h1>
        <p className="text-muted-foreground">
          Công cụ tạo mã QR Code hỗ trợ chèn logo, phối màu gradient, định dạng
          góc mắt và tải về file chất lượng cao.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Trái: Bảng Điều Khiển Cấu HÌnh */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Nhập nội dung */}
          <QrContentInput
            contentType={contentType}
            setContentType={setContentType}
            textVal={textVal}
            setTextVal={setTextVal}
            wifiSsid={wifiSsid}
            setWifiSsid={setWifiSsid}
            wifiPass={wifiPass}
            setWifiPass={setWifiPass}
            wifiEncryption={wifiEncryption}
            setWifiEncryption={setWifiEncryption}
            wifiHidden={wifiHidden}
            setWifiHidden={setWifiHidden}
            emailAddr={emailAddr}
            setEmailAddr={setEmailAddr}
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            emailBody={emailBody}
            setEmailBody={setEmailBody}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handleResetAll={handleResetAll}
          />

          {/* Section 2: Tùy chỉnh Style, Màu, Logo */}
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="style" className="gap-1.5 text-xs sm:text-sm">
                <Paintbrush className="w-4 h-4" />
                Kiểu Dáng
              </TabsTrigger>
              <TabsTrigger value="color" className="gap-1.5 text-xs sm:text-sm">
                <Palette className="w-4 h-4" />
                Màu Sắc
              </TabsTrigger>
              <TabsTrigger value="logo" className="gap-1.5 text-xs sm:text-sm">
                <ImageIcon className="w-4 h-4" />
                Logo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="style">
              <QrDesignSettings
                dotsType={dotsType}
                setDotsType={setDotsType}
                cornersType={cornersType}
                setCornersType={setCornersType}
                cornersDotType={cornersDotType}
                setCornersDotType={setCornersDotType}
              />
            </TabsContent>

            <TabsContent value="color">
              <QrColorSettings
                dotsColorType={dotsColorType}
                setDotsColorType={setDotsColorType}
                dotsColor={dotsColor}
                setDotsColor={setDotsColor}
                dotsGradType={dotsGradType}
                setDotsGradType={setDotsGradType}
                dotsGradColor1={dotsGradColor1}
                setDotsGradColor1={setDotsGradColor1}
                dotsGradColor2={dotsGradColor2}
                setDotsGradColor2={setDotsGradColor2}
                dotsGradRot={dotsGradRot}
                setDotsGradRot={setDotsGradRot}
                cornersColor={cornersColor}
                setCornersColor={setCornersColor}
                customCornersColor={customCornersColor}
                setCustomCornersColor={setCustomCornersColor}
                cornersDotColor={cornersDotColor}
                setCornersDotColor={setCornersDotColor}
                customCornersDotColor={customCornersDotColor}
                setCustomCornersDotColor={setCustomCornersDotColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                isBgTransparent={isBgTransparent}
                setIsBgTransparent={setIsBgTransparent}
              />
            </TabsContent>

            <TabsContent value="logo">
              <QrLogoSettings
                logoFile={logoFile}
                handleLogoUpload={handleLogoUpload}
                handleResetLogo={handleResetLogo}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
                logoMargin={logoMargin}
                setLogoMargin={setLogoMargin}
                excavateLogo={excavateLogo}
                setExcavateLogo={setExcavateLogo}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cột Phải: Xem Trước & Tải Về */}
        <QrPreviewCard
          qrRef={qrRef}
          fileName={fileName}
          setFileName={setFileName}
          downloadSize={downloadSize}
          setDownloadSize={setDownloadSize}
          downloadFormat={downloadFormat}
          setDownloadFormat={setDownloadFormat}
          handleDownload={handleDownload}
        />
      </div>
    </div>
  );
}
