import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Reusable React Hook hỗ trợ tương tác Zoom In/Out (bánh xe chuột & button)
 * và Drag/Pan (kéo rê chuột) cho biểu đồ Recharts hoặc các biểu đồ khác.
 *
 * @param {Object} options
 * @param {number} [options.minDomain=0] - Giới hạn nhỏ nhất của trục X (ví dụ minTime = 0)
 * @param {number} [options.maxDomain=100] - Giới hạn lớn nhất của trục X (ví dụ maxTime = 60)
 * @param {number} [options.zoomStep=0.2] - Tỉ lệ zoom mỗi nấc nút bấm (mặc định 20%)
 * @param {number} [options.wheelZoomFactor=0.12] - Tỉ lệ zoom khi lăn bánh xe chuột
 * @returns {Object} { left, right, isZoomed, isDragging, containerRef, zoomIn, zoomOut, resetZoom, handlers }
 */
export function useChartZoomPan({
  minDomain = 0,
  maxDomain = 100,
  zoomStep = 0.2,
  wheelZoomFactor = 0.12,
} = {}) {
  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartDomainRef = useRef([0, 100]);

  // Nút Zoom In
  const zoomIn = useCallback(() => {
    const currentLeft = typeof left === "number" ? left : minDomain;
    const currentRight = typeof right === "number" ? right : maxDomain;
    const range = currentRight - currentLeft;
    const delta = range * zoomStep;

    const newLeft = Math.min(currentLeft + delta, currentRight - 1);
    const newRight = Math.max(currentRight - delta, currentLeft + 1);

    setLeft(parseFloat(newLeft.toFixed(2)));
    setRight(parseFloat(newRight.toFixed(2)));
  }, [left, right, minDomain, maxDomain, zoomStep]);

  // Nút Zoom Out
  const zoomOut = useCallback(() => {
    const currentLeft = typeof left === "number" ? left : minDomain;
    const currentRight = typeof right === "number" ? right : maxDomain;
    const range = currentRight - currentLeft;
    const delta = range * (zoomStep * 1.2);

    const newLeft = Math.max(minDomain, currentLeft - delta);
    const newRight = Math.min(maxDomain, currentRight + delta);

    setLeft(parseFloat(newLeft.toFixed(2)));
    setRight(parseFloat(newRight.toFixed(2)));
  }, [left, right, minDomain, maxDomain, zoomStep]);

  // Reset Zoom về ban đầu
  const resetZoom = useCallback(() => {
    setLeft("dataMin");
    setRight("dataMax");
  }, []);

  // Lăn bánh xe chuột (Wheel Zoom In / Out)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      setLeft((prevLeft) => {
        setRight((prevRight) => {
          const currentLeft = typeof prevLeft === "number" ? prevLeft : minDomain;
          const currentRight = typeof prevRight === "number" ? prevRight : maxDomain;
          const range = currentRight - currentLeft;

          const factor = e.deltaY < 0 ? wheelZoomFactor : -wheelZoomFactor * 1.2;
          const delta = range * factor;

          let newLeft = currentLeft + delta;
          let newRight = currentRight - delta;

          if (newLeft < minDomain) newLeft = minDomain;
          if (newRight > maxDomain) newRight = maxDomain;
          if (newRight - newLeft < 0.5) return prevRight;

          return parseFloat(newRight.toFixed(2));
        });

        const currentLeft = typeof prevLeft === "number" ? prevLeft : minDomain;
        const currentRight = typeof right === "number" ? right : maxDomain;
        const range = currentRight - currentLeft;

        const factor = e.deltaY < 0 ? wheelZoomFactor : -wheelZoomFactor * 1.2;
        const delta = range * factor;
        let newLeft = currentLeft + delta;
        if (newLeft < minDomain) newLeft = minDomain;

        return parseFloat(newLeft.toFixed(2));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [minDomain, maxDomain, right, wheelZoomFactor]);

  // Sự kiện kéo rê (Drag / Pan)
  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return; // Chỉ chuột trái
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      setIsDragging(true);

      const currentLeft = typeof left === "number" ? left : minDomain;
      const currentRight = typeof right === "number" ? right : maxDomain;
      dragStartDomainRef.current = [currentLeft, currentRight];
    },
    [left, right, minDomain, maxDomain],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;

      const deltaX = e.clientX - dragStartXRef.current;
      const [startLeft, startRight] = dragStartDomainRef.current;
      const domainRange = startRight - startLeft;

      const timePerPixel = domainRange / rect.width;
      const deltaTime = deltaX * timePerPixel;

      let newLeft = startLeft - deltaTime;
      let newRight = startRight - deltaTime;

      if (newLeft < minDomain) {
        newRight += minDomain - newLeft;
        newLeft = minDomain;
      }
      if (newRight > maxDomain) {
        newLeft -= newRight - maxDomain;
        newRight = maxDomain;
      }

      setLeft(parseFloat(Math.max(minDomain, newLeft).toFixed(2)));
      setRight(parseFloat(Math.min(maxDomain, newRight).toFixed(2)));
    },
    [minDomain, maxDomain],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const isZoomed = left !== "dataMin" || right !== "dataMax";

  return {
    left,
    right,
    isZoomed,
    isDragging,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}
