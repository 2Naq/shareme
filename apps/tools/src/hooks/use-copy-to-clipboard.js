import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard({ timeout = 2000 } = {}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (
    value,
    successMessage = "Đã sao chép vào clipboard!",
  ) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      toast.error("Trình duyệt không hỗ trợ sao chép.");
      return;
    }

    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast.success(successMessage);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    } catch (error) {
      console.error("Copy failed", error);
      toast.error("Sao chép thất bại!");
    }
  };

  return { isCopied, copyToClipboard };
}
