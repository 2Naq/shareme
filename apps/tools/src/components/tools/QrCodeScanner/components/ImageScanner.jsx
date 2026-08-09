import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Upload, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ImageScanner({ onScanSuccess, isActive }) {
  const fileInputRef = useRef(null);
  const hiddenReaderRef = useRef(null);
  const containerId = "qr-reader-file-hidden";

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Khi component mất active, dọn dẹp các state
  useEffect(() => {
    if (!isActive) {
      handleClear();
    }
  }, [isActive]);

  // Xử lý sự kiện kéo thả file
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Xử lý khi nhấn nút chọn file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Quét ảnh và giải mã
  const processFile = (file) => {
    // Validation định dạng file
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Vui lòng tải lên một tệp tin hình ảnh (.png, .jpg, .jpeg, .webp).",
      );
      return;
    }

    setSelectedFile(file);
    setIsScanning(true);

    // Tạo preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Tiến hành giải mã QR bằng html5-qrcode
    setTimeout(() => {
      try {
        let html5QrCode = hiddenReaderRef.current;
        if (!html5QrCode) {
          html5QrCode = new Html5Qrcode(containerId);
          hiddenReaderRef.current = html5QrCode;
        }

        html5QrCode
          .scanFile(file, false) // false = không hiển thị console log debug
          .then((decodedText) => {
            onScanSuccess(decodedText);
            setIsScanning(false);
          })
          .catch((err) => {
            console.warn("Lỗi quét file QR:", err);
            toast.error(
              "Không tìm thấy mã QR nào trong hình ảnh này. Vui lòng chọn ảnh khác rõ nét hơn.",
            );
            setIsScanning(false);
          });
      } catch (err) {
        console.error("Lỗi khởi tạo module đọc file:", err);
        toast.error("Đã xảy ra lỗi khi quét ảnh. Vui lòng thử lại.");
        setIsScanning(false);
      }
    }, 500); // Trì hoãn 1 chút để tạo cảm giác xử lý mượt mà
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Không cần hủy hidden reader instance để tái sử dụng
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Thẻ div ẩn làm container cho html5-qrcode file scanner */}
      <div
        id={containerId}
        className="hidden"
        style={{ display: "none" }}
      ></div>

      {/* Vùng kéo thả / chọn file */}
      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex min-h-65 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="text-muted-foreground/60 mb-4 h-12 w-12 animate-pulse" />
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Kéo thả ảnh vào đây
          </h3>
          <p className="text-muted-foreground mb-3 max-w-xs text-sm">
            Hoặc nhấp vào đây để chọn tệp tin hình ảnh mã QR từ máy của bạn
          </p>
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
            Hỗ trợ PNG, JPG, JPEG, WEBP
          </span>
        </div>
      ) : (
        /* Giao diện Xem trước & Quét ảnh */
        <div className="bg-muted/30 relative flex flex-col items-center overflow-hidden rounded-xl border p-4">
          <button
            onClick={handleClear}
            disabled={isScanning}
            className="bg-background/80 text-foreground hover:bg-background absolute top-3 right-3 cursor-pointer rounded-full border p-1.5 shadow transition-all disabled:opacity-50"
            title="Chọn ảnh khác"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border bg-black/5 shadow-inner dark:bg-black/40">
            <img
              src={imagePreview}
              alt="QR Code Preview"
              className="max-h-full max-w-full object-contain"
            />
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/60 text-white backdrop-blur-xs">
                <RefreshCw className="text-primary h-8 w-8 animate-spin" />
                <span className="text-sm font-medium">Đang quét mã QR...</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-foreground max-w-70 truncate text-sm font-medium">
              {selectedFile?.name}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {(selectedFile?.size / 1024).toFixed(1)} KB
            </p>
          </div>

          {!isScanning && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleClear}
                className="hover:bg-background text-foreground cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium shadow-xs transition-all"
              >
                Chọn ảnh khác
              </button>
              <button
                onClick={() => processFile(selectedFile)}
                className="bg-primary hover:bg-primary/95 text-primary-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Quét lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
