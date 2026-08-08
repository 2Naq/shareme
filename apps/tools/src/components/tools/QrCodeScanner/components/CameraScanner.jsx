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

        {/* Khung quét Laser Beam chuyển động khi đang quét */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            {/* Bo góc vùng quét */}
            <div className="border-primary/50 relative h-[70%] w-[70%] rounded-lg border-2">
              {/* 4 Góc màu đậm hơn */}
              <div className="border-primary absolute -top-0.5 -left-0.5 h-6 w-6 rounded-tl-lg border-t-4 border-l-4"></div>
              <div className="border-primary absolute -top-0.5 -right-0.5 h-6 w-6 rounded-tr-lg border-t-4 border-r-4"></div>
              <div className="border-primary absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-lg border-b-4 border-l-4"></div>
              <div className="border-primary absolute -right-0.5 -bottom-0.5 h-6 w-6 rounded-br-lg border-r-4 border-b-4"></div>

              {/* Dòng laser đỏ quét dọc */}
              <div className="absolute left-0 h-0.75 w-full animate-[scan_2s_ease-in-out_infinite] bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
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
