import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

export default function MathRenderer({
  formula,
  displayMode = true,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false, // Không crash ứng dụng nếu nhập ngu
      });
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={className} style={{ display: displayMode ? "block" : "inline-block" }} />;
}

export function RenderMathInText(text) {
  const html = text.replace(/\$([^$]+)\$/g, (_, formula) =>
    katex.renderToString(formula, { throwOnError: false, displayMode: false }),
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
