import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

export default function MathRenderer({ formula, displayMode = true, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false, // Không crash ứng dụng nếu nhập ngu
      });
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={className} />;
}
