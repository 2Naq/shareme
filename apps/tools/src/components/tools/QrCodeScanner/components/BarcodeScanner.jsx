import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Barcode, Camera, CameraOff, RefreshCw, AlertTriangle, Upload, X } from "lucide-react";
import { toast } from "sonner";

// Các định dạng barcode 1D được hỗ trợ (loại trừ QR để phân biệt rõ)
const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.AZTEC,
];

// ── Tab Quét bằng Camera ─────────────────────────────────────
function BarcodeCameraTab({ onScanSuccess }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader-camera";

  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Html5Qrcode.getCameras()
      .then((devices) => {
        setHasPermission(true);
        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCam = devices.find(
            (d) =>
              d.label.toLowerCase().includes("back") ||
              d.label.toLowerCase().includes("sau") ||
              d.label.toLowerCase().includes("environment"),
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          toast.error("Không tìm thấy camera nào trên thiết bị này.");
        }
      })
      .catch(() => {
        setHasPermission(false);
        toast.error("Không thể truy cập camera. Vui lòng cấp quyền truy cập.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const stopScanning = useCallback(async () => {
    if (!scannerRef.current) return;
    setIsLoading(true);
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      setIsScanning(false);
      toast.info("Đã tắt camera.");
    } catch (err) {
      console.error("Lỗi khi dừng camera:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startScanning = useCallback(
    async (cameraId = selectedCameraId) => {
      if (!cameraId) return;
      setIsLoading(true);
      try {
        if (scannerRef.current) {
          if (scannerRef.current.isScanning) await scannerRef.current.stop();
          scannerRef.current = null;
        }

        const html5QrCode = new Html5Qrcode(containerId, {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        // Barcode 1D cần vùng quét ngang (aspect ratio > 1)
        const qrboxFunction = (vw, vh) => ({
          width: Math.min(Math.floor(vw * 0.85), 500),
          height: Math.min(Math.floor(vh * 0.25), 80),
        });

        await html5QrCode.start(
          cameraId,
          { fps: 20, qrbox: qrboxFunction, aspectRatio: 1.7 },
          (decodedText) => {
            onScanSuccess(decodedText);
            stopScanning();
          },
          () => {},
        );

        setIsScanning(true);
        toast.success("Camera đã được bật — hướng vào vạch mã để quét.");
      } catch (err) {
        console.error("Không thể khởi động camera:", err);
        toast.error(`Lỗi camera: ${err.message || "Vui lòng thử lại."}`);
        setIsScanning(false);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCameraId, onScanSuccess, stopScanning],
  );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleCameraChange = (e) => {
    const id = e.target.value;
    setSelectedCameraId(id);
    if (isScanning) startScanning(id);
  };

  if (hasPermission === false) {
    return (
      <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed p-8 text-center">
        <AlertTriangle className="text-destructive h-12 w-12 animate-pulse" />
        <h3 className="text-foreground text-lg font-semibold">
          Không có quyền truy cập Camera
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Trình duyệt đã chặn quyền truy cập máy ảnh. Vui lòng cấp quyền trong
          cài đặt trang web và tải lại trang.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chọn Camera */}
      {cameras.length > 1 && (
        <div className="flex items-center gap-2">
          <label htmlFor="barcode-camera-select" className="text-foreground shrink-0 text-sm font-medium">
            Chọn Camera:
          </label>
          <select
            id="barcode-camera-select"
            value={selectedCameraId}
            onChange={handleCameraChange}
            className="border-input bg-background text-foreground w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label || `Camera ${c.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vùng quét — rộng, thấp (phù hợp barcode ngang) */}
      <div className="relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-xl border bg-black shadow-inner" style={{ aspectRatio: "16/9", maxHeight: "260px" }}>
        <div id={containerId} className="h-full w-full" />

        {/* Overlay khi camera tắt */}
        {!isScanning && (
          <div className="bg-muted/90 text-muted-foreground absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 p-4 text-center">
            <Barcode className="h-16 w-16 animate-bounce opacity-40" />
            <div>
              <p className="text-foreground font-medium">Camera đang tắt</p>
              <p className="mt-1 max-w-xs text-xs">
                Nhấn nút bên dưới, sau đó hướng camera vào mã vạch cần quét.
              </p>
            </div>
            <button
              onClick={() => startScanning()}
              disabled={isLoading || !selectedCameraId}
              className="bg-primary hover:bg-primary/95 text-primary-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              Bật Camera
            </button>
          </div>
        )}

        {/* Overlay nâng cao khi đang quét Barcode */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-10">

            {/* Vignette tối 4 góc */}
            <div className="absolute inset-0 rounded-xl"
              style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }}
            />

            {/* Khung barcode nằm ngang — căn giữa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[30%] w-[88%]">

                {/* Viền mờ */}
                <div className="absolute inset-0 rounded border border-yellow-400/30" />

                {/* Góc vàng pulse */}
                <div className="absolute -top-0.5 -left-0.5 h-5 w-5">
                  <div className="absolute inset-0 rounded-tl border-t-[3px] border-l-[3px] border-yellow-400" />
                  <div className="absolute inset-0 rounded-tl border-t-[3px] border-l-[3px] border-yellow-400/50 animate-ping" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-5 w-5">
                  <div className="absolute inset-0 rounded-tr border-t-[3px] border-r-[3px] border-yellow-400" />
                  <div className="absolute inset-0 rounded-tr border-t-[3px] border-r-[3px] border-yellow-400/50 animate-ping" />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 h-5 w-5">
                  <div className="absolute inset-0 rounded-bl border-b-[3px] border-l-[3px] border-yellow-400" />
                  <div className="absolute inset-0 rounded-bl border-b-[3px] border-l-[3px] border-yellow-400/50 animate-ping" />
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 h-5 w-5">
                  <div className="absolute inset-0 rounded-br border-b-[3px] border-r-[3px] border-yellow-400" />
                  <div className="absolute inset-0 rounded-br border-b-[3px] border-r-[3px] border-yellow-400/50 animate-ping" />
                </div>

                {/* ── Laser quét ngang trái → phải → trái ── */}
                <style>{`
                  @keyframes barcode-scan {
                    0%   { transform: translateX(0); }
                    50%  { transform: translateX(calc(100% - 3px)); }
                    100% { transform: translateX(0); }
                  }
                `}</style>
                <div
                  className="absolute top-0 bottom-0 w-[3px] overflow-visible"
                  style={{ animation: "barcode-scan 1.6s ease-in-out infinite" }}
                >
                  {/* Dải laser chính */}
                  <div className="h-full w-full bg-red-500" style={{ boxShadow: "0 0 10px 2px #ef4444, 0 0 28px 5px rgba(239,68,68,0.35)" }} />
                  {/* Phản chiếu bên phải laser */}
                  <div className="absolute top-0 left-full h-full w-6" style={{
                    background: "linear-gradient(to right, rgba(239,68,68,0.25), transparent)",
                  }} />
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Nút tắt camera */}
      {isScanning && (
        <div className="flex justify-center">
          <button
            onClick={stopScanning}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-all disabled:opacity-50"
          >
            <CameraOff className="h-4 w-4" />
            Tắt Camera
          </button>
        </div>
      )}
    </div>
  );
}

// ── Tab Quét từ ảnh ─────────────────────────────────────────
function BarcodeImageTab({ onScanSuccess }) {
  const fileInputRef = useRef(null);
  const hiddenReaderRef = useRef(null);
  const containerId = "barcode-reader-file-hidden";

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng tải lên một tệp tin hình ảnh (.png, .jpg, .jpeg, .webp).");
      return;
    }

    setSelectedFile(file);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setTimeout(() => {
      try {
        if (!hiddenReaderRef.current) {
          hiddenReaderRef.current = new Html5Qrcode(containerId, {
            formatsToSupport: BARCODE_FORMATS,
            verbose: false,
          });
        }
        hiddenReaderRef.current
          .scanFile(file, false)
          .then((decodedText) => {
            onScanSuccess(decodedText);
            setIsScanning(false);
          })
          .catch(() => {
            toast.error("Không tìm thấy mã vạch nào trong hình ảnh này. Hãy thử ảnh rõ nét hơn.");
            setIsScanning(false);
          });
      } catch {
        toast.error("Đã xảy ra lỗi khi quét ảnh. Vui lòng thử lại.");
        setIsScanning(false);
      }
    }, 500);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div id={containerId} className="hidden" style={{ display: "none" }} />

      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
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
          <Barcode className="text-muted-foreground/60 mb-4 h-12 w-12 animate-pulse" />
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Kéo thả ảnh mã vạch vào đây
          </h3>
          <p className="text-muted-foreground mb-3 max-w-xs text-sm">
            Hoặc nhấp vào đây để chọn hình ảnh chứa mã vạch từ máy tính của bạn
          </p>
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
            Hỗ trợ PNG, JPG, JPEG, WEBP
          </span>
        </div>
      ) : (
        <div className="bg-muted/30 relative flex flex-col items-center overflow-hidden rounded-xl border p-4">
          <button
            onClick={handleClear}
            disabled={isScanning}
            className="bg-background/80 text-foreground hover:bg-background absolute top-3 right-3 cursor-pointer rounded-full border p-1.5 shadow transition-all disabled:opacity-50"
            title="Chọn ảnh khác"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border bg-black/5 shadow-inner dark:bg-black/40" style={{ minHeight: "140px" }}>
            <img src={imagePreview} alt="Barcode Preview" className="max-h-52 max-w-full object-contain" />
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/60 text-white backdrop-blur-xs">
                <RefreshCw className="text-yellow-400 h-8 w-8 animate-spin" />
                <span className="text-sm font-medium">Đang quét mã vạch...</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-foreground max-w-70 truncate text-sm font-medium">{selectedFile?.name}</p>
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

// ── Export chính ────────────────────────────────────────────
export default function BarcodeScanner({ onScanSuccess, isActive }) {
  const [innerTab, setInnerTab] = useState("camera");

  // Bọc callback với toast phân biệt barcode
  const handleSuccess = useCallback(
    (decoded) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(660, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch {}
      onScanSuccess(decoded);
      toast.success("Đã quét thành công mã vạch!");
    },
    [onScanSuccess],
  );

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Mini-tabs: camera vs upload */}
      <div className="flex gap-2">
        <button
          onClick={() => setInnerTab("camera")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            innerTab === "camera"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          Camera
        </button>
        <button
          onClick={() => setInnerTab("image")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            innerTab === "image"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Tải ảnh lên
        </button>
      </div>

      {innerTab === "camera" ? (
        <BarcodeCameraTab onScanSuccess={handleSuccess} />
      ) : (
        <BarcodeImageTab onScanSuccess={handleSuccess} />
      )}

      {/* Các định dạng được hỗ trợ */}
      <div className="text-muted-foreground rounded-lg border p-3 text-xs">
        <p className="mb-1 font-semibold">Định dạng mã vạch được hỗ trợ:</p>
        <div className="flex flex-wrap gap-1">
          {["EAN-13", "EAN-8", "UPC-A", "UPC-E", "Code 128", "Code 39", "Code 93", "ITF", "Codabar", "Data Matrix", "PDF 417", "Aztec"].map((f) => (
            <span key={f} className="bg-muted rounded px-1.5 py-0.5 font-mono">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
