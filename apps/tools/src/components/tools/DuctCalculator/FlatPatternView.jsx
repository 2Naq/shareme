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
    <div className="border-border relative overflow-hidden rounded-md border bg-[#0d1418]">
      <svg
        viewBox={viewBox}
        className="block h-auto w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <div className="text-muted-foreground pointer-events-none absolute top-2 right-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px]">
        <span
          className="inline-block h-2 w-2 border border-red-500 bg-red-500/60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(255,90,77,0.3) 2px,rgba(255,90,77,0.3) 3px)",
          }}
        />
        Vùng cắt bỏ
        <span className="ml-1.5 inline-block h-0 w-3 border-t border-dashed border-sky-400" />
        Đường gấp
      </div>
    </div>
  );
}
