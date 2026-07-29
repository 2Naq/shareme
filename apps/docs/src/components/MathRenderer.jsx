import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

function MathRendererBlock({ formula, displayMode = true, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false, // Không crash ứng dụng nếu nhập ngu
      });
    }
  }, [formula, displayMode]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        display: displayMode ? "block" : "inline-block",
        overflowX: displayMode ? "auto" : "visible",
        overflowY: "hidden",
        maxWidth: "100%",
        verticalAlign: displayMode ? "middle" : "baseline",
      }}
    />
  );
}

function MathRendererInline(propsOrText) {
  let content = "";
  let className = "";
  if (typeof propsOrText === "string") {
    content = propsOrText;
  } else if (propsOrText && typeof propsOrText === "object") {
    content = propsOrText.text || propsOrText.children || "";
    className = propsOrText.className || "";
  }

  if (typeof content !== "string") {
    return <span className={className}>{content}</span>;
  }

  const html = content.replace(/\$([^$]+)\$/g, (_, formula) =>
    katex.renderToString(formula, { throwOnError: false, displayMode: false }),
  );
  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default MathRendererBlock;
export { MathRendererBlock, MathRendererInline };
