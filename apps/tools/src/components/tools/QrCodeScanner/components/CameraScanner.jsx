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
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-destructive/30 rounded-xl bg-destructive/5 space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />
        <h3 className="font-semibold text-lg text-foreground">
          Không có quyền truy cập Camera
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
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
            className="text-sm font-medium shrink-0 text-foreground"
          >
            Chọn Camera:
          </label>
          <select
            id="camera-select"
            value={selectedCameraId}
            onChange={handleCameraChange}
            className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-background text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
      <div className="relative w-full aspect-square max-w-100 mx-auto overflow-hidden rounded-xl border bg-black shadow-inner flex items-center justify-center">
        {/* DOM element cho html5-qrcode */}
        <div id={containerId} className="w-full h-full object-cover"></div>

        {/* Trạng thái chưa bật Camera */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted/90 space-y-4 text-muted-foreground z-10">
            <Camera className="w-16 h-16 opacity-40 animate-bounce" />
            <div>
              <p className="font-medium text-foreground">Camera đang tắt</p>
              <p className="text-xs max-w-xs mt-1">
                Nhấp nút phía dưới để khởi động camera và bắt đầu quét mã QR.
              </p>
            </div>
            <button
              onClick={() => startScanning()}
              disabled={isLoading || !selectedCameraId}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-medium rounded-lg text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              Bật Camera
            </button>
          </div>
        )}

        {/* Khung quét Laser Beam chuyển động khi đang quét */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {/* Bo góc vùng quét */}
            <div className="w-[70%] h-[70%] border-2 border-primary/50 relative rounded-lg">
              {/* 4 Góc màu đậm hơn */}
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

              {/* Dòng laser đỏ quét dọc */}
              <div className="absolute left-0 w-full h-0.75 bg-red-500 shadow-[0_0_8px_#ef4444] animate-[scan_2s_ease-in-out_infinite]"></div>
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
            className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium rounded-lg text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CameraOff className="w-4 h-4" />
            Tắt Camera
          </button>
        </div>
      )}
    </div>
  );
}
