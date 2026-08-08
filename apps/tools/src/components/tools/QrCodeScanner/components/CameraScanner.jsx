import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function CameraScanner({ onScanSuccess, isActive }) {
  const scannerRef = useRef(null);
  const containerId = "qr-reader-camera";

  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null); // null, true, false
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách camera khi component mount hoặc khi được active
  useEffect(() => {
    if (!isActive) return;

    setIsLoading(true);
    Html5Qrcode.getCameras()
      .then((devices) => {
        setHasPermission(true);
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Chọn camera sau (back camera) làm mặc định nếu có
          const backCam = devices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("sau") ||
              device.label.toLowerCase().includes("environment"),
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          toast.error("Không tìm thấy camera nào trên thiết bị này.");
        }
      })
      .catch((err) => {
        console.error("Lỗi yêu cầu quyền camera:", err);
        setHasPermission(false);
        toast.error(
          "Không thể truy cập camera. Vui lòng cấp quyền truy cập camera cho trang web.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isActive]);

  // Hàm dừng quét
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

  // Hàm bắt đầu quét
  const startScanning = useCallback(
    async (cameraId = selectedCameraId) => {
      if (!cameraId) return;
      setIsLoading(true);

      try {
        // Nếu đã có scanner cũ đang chạy, dừng trước khi tạo mới
        if (scannerRef.current) {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          scannerRef.current = null;
        }

        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        // Cấu hình vùng quét responsive
        const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdge * 0.7); // 70% của chiều nhỏ nhất
          return {
            width: Math.max(qrboxSize, 200), // Tối thiểu 200px
            height: Math.max(qrboxSize, 200),
          };
        };

        await html5QrCode.start(
          cameraId,
          {
            fps: 15,
            qrbox: qrboxFunction,
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Quét thành công
            onScanSuccess(decodedText);
            // Tự động dừng camera
            stopScanning();
          },
          () => {
            // Quét thất bại (bỏ qua log lỗi liên tục khi không tìm thấy QR trong khung hình)
          },
        );

        setIsScanning(true);
        toast.success("Camera đã được bật.");
      } catch (err) {
        console.error("Không thể khởi động camera:", err);
        toast.error(
          `Lỗi camera: ${err.message || "Vui lòng thử lại hoặc chọn camera khác."}`,
        );
        setIsScanning(false);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCameraId, onScanSuccess, stopScanning],
  );

  // Quản lý việc bật/tắt camera
  useEffect(() => {
    // Nếu tab không active hoặc đã có kết quả quét (isActive = false), dừng camera
    if (!isActive && isScanning) {
      stopScanning();
    }

    return () => {
      // Cleanup khi unmount
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current = null;
          })
          .catch((err) => console.error("Lỗi dừng camera khi unmount:", err));
      }
    };
  }, [isActive, isScanning, stopScanning]);

  // Xử lý đổi camera
  const handleCameraChange = (e) => {
    const newCameraId = e.target.value;
    setSelectedCameraId(newCameraId);
    if (isScanning) {
      startScanning(newCameraId);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed p-8 text-center">
        <AlertTriangle className="text-destructive h-12 w-12 animate-pulse" />
        <h3 className="text-foreground text-lg font-semibold">
          Không có quyền truy cập Camera
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Trình duyệt đã chặn quyền truy cập máy ảnh. Vui lòng cấp quyền truy
          cập camera trong cài đặt trang web của trình duyệt và tải lại trang.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chọn Camera */}
      {cameras.length > 1 && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="camera-select"
            className="text-foreground shrink-0 text-sm font-medium"
          >
            Chọn Camera:
          </label>
          <select
            id="camera-select"
            value={selectedCameraId}
            onChange={handleCameraChange}
            className="border-input bg-background text-foreground ring-offset-background focus:ring-primary w-full rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vùng quét */}
      <div className="relative mx-auto flex aspect-square w-full max-w-100 items-center justify-center overflow-hidden rounded-xl border bg-black shadow-inner">
        {/* DOM element cho html5-qrcode */}
        <div id={containerId} className="h-full w-full object-cover"></div>

        {/* Trạng thái chưa bật Camera */}
        {!isScanning && (
          <div className="bg-muted/90 text-muted-foreground absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 p-4 text-center">
            <Camera className="h-16 w-16 animate-bounce opacity-40" />
            <div>
              <p className="text-foreground font-medium">Camera đang tắt</p>
              <p className="mt-1 max-w-xs text-xs">
                Nhấp nút phía dưới để khởi động camera và bắt đầu quét mã QR.
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

        {/* Khung quét nâng cao khi đang quét */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-10">

            {/* Vignette tối 4 góc */}
            <div className="absolute inset-0 rounded-xl"
              style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
            />

            {/* Khung và laser căn giữa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[68%] w-[68%]">

                {/* ── Góc bo có pulse glow ─────────────────── */}
                {/* Top-left */}
                <div className="absolute -top-0.5 -left-0.5 h-7 w-7">
                  <div className="absolute inset-0 rounded-tl-lg border-t-[3px] border-l-[3px] border-primary" />
                  <div className="absolute inset-0 rounded-tl-lg border-t-[3px] border-l-[3px] border-primary/40 animate-ping" />
                </div>
                {/* Top-right */}
                <div className="absolute -top-0.5 -right-0.5 h-7 w-7">
                  <div className="absolute inset-0 rounded-tr-lg border-t-[3px] border-r-[3px] border-primary" />
                  <div className="absolute inset-0 rounded-tr-lg border-t-[3px] border-r-[3px] border-primary/40 animate-ping" />
                </div>
                {/* Bottom-left */}
                <div className="absolute -bottom-0.5 -left-0.5 h-7 w-7">
                  <div className="absolute inset-0 rounded-bl-lg border-b-[3px] border-l-[3px] border-primary" />
                  <div className="absolute inset-0 rounded-bl-lg border-b-[3px] border-l-[3px] border-primary/40 animate-ping" />
                </div>
                {/* Bottom-right */}
                <div className="absolute -right-0.5 -bottom-0.5 h-7 w-7">
                  <div className="absolute inset-0 rounded-br-lg border-b-[3px] border-r-[3px] border-primary" />
                  <div className="absolute inset-0 rounded-br-lg border-b-[3px] border-r-[3px] border-primary/40 animate-ping" />
                </div>

                {/* Viền mờ */}
                <div className="absolute inset-0 rounded-lg border border-primary/25" />

                {/* ── Laser scan lên xuống ─────────────────── */}
                <style>{`
                  @keyframes qr-scan {
                    0%   { transform: translateY(0); }
                    50%  { transform: translateY(calc(100% - 3px)); }
                    100% { transform: translateY(0); }
                  }
                `}</style>
                <div
                  className="absolute left-0 right-0 h-[3px] overflow-visible"
                  style={{ animation: "qr-scan 2s ease-in-out infinite" }}
                >
                  {/* Dải laser chính */}
                  <div className="h-full w-full bg-red-500" style={{ boxShadow: "0 0 10px 2px #ef4444, 0 0 30px 6px rgba(239,68,68,0.35)" }} />
                  {/* Phản chiếu phía dưới laser */}
                  <div className="h-6 w-full" style={{
                    background: "linear-gradient(to bottom, rgba(239,68,68,0.25), transparent)",
                  }} />
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Button điều khiển */}
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
