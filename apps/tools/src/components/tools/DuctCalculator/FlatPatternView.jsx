import React from "react";

/**
 * FlatPatternView: Renders an SVG flat pattern (unfolded sheet metal view)
 * showing cut zones, fold lines, and dimensions.
 *
 * Props:
 *   - svgContent: raw SVG inner HTML string
 *   - viewBox: SVG viewBox string
 */
export default function FlatPatternView({
  svgContent,
  viewBox = "0 0 700 420",
}) {
  return (
    <div className="rounded-md border border-border overflow-hidden bg-[#0d1418] relative">
      <svg
        viewBox={viewBox}
        className="block w-full h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <div className="absolute top-2 right-3 font-mono text-[10px] text-muted-foreground bg-black/60 px-2 py-0.5 rounded pointer-events-none flex items-center gap-1.5">
        <span
          className="w-2 h-2 bg-red-500/60 border border-red-500 inline-block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(255,90,77,0.3) 2px,rgba(255,90,77,0.3) 3px)",
          }}
        />
        Vùng cắt bỏ
        <span className="w-3 h-0 border-t border-dashed border-sky-400 inline-block ml-1.5" />
        Đường gấp
      </div>
    </div>
  );
}
