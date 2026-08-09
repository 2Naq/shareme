import React, { useCallback } from "react";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import CameraScanner from "./CameraScanner";
import ImageScanner from "./ImageScanner";

export default function QrScanner({ onScanSuccess, isActive, innerTab, onInnerTabChange }) {

  const handleSuccess = useCallback(
    (decoded) => {
      try {
        const audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch {}
      onScanSuccess(decoded);
      toast.success("Đã quét thành công mã QR!");
    },
    [onScanSuccess],
  );

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Mini-tabs: camera vs upload */}
      <div className="flex gap-2">
        <button
          onClick={() => onInnerTabChange("camera")}
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
          onClick={() => onInnerTabChange("image")}
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
        <CameraScanner
          onScanSuccess={handleSuccess}
          isActive={innerTab === "camera"}
        />
      ) : (
        <ImageScanner
          onScanSuccess={handleSuccess}
          isActive={innerTab === "image"}
        />
      )}
    </div>
  );
}
