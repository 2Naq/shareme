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
          className={`flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl cursor-pointer transition-all min-h-65 ${
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
          <Upload className="w-12 h-12 text-muted-foreground/60 mb-4 animate-pulse" />
          <h3 className="font-semibold text-base text-foreground mb-1">
            Kéo thả ảnh vào đây
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-3">
            Hoặc nhấp vào đây để chọn tệp tin hình ảnh mã QR từ máy tính của bạn
          </p>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
            Hỗ trợ PNG, JPG, JPEG, WEBP
          </span>
        </div>
      ) : (
        /* Giao diện Xem trước & Quét ảnh */
        <div className="relative border rounded-xl overflow-hidden bg-muted/30 flex flex-col items-center p-4">
          <button
            onClick={handleClear}
            disabled={isScanning}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-background border shadow transition-all cursor-pointer disabled:opacity-50"
            title="Chọn ảnh khác"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative max-w-xs w-full aspect-square bg-black/5 dark:bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border shadow-inner">
            <img
              src={imagePreview}
              alt="QR Code Preview"
              className="max-w-full max-h-full object-contain"
            />
            {isScanning && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Đang quét mã QR...</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-foreground truncate max-w-70">
              {selectedFile?.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(selectedFile?.size / 1024).toFixed(1)} KB
            </p>
          </div>

          {!isScanning && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 border hover:bg-background text-foreground text-sm font-medium rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Chọn ảnh khác
              </button>
              <button
                onClick={() => processFile(selectedFile)}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Quét lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
