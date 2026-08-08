import React from "react";

/**
 * Renders SVG 2D diagram content using dangerouslySetInnerHTML.
 * This is necessary because the SVG markup is generated dynamically
 * by the helper functions.
 */
export default function Svg2DView({
  svgContent,
  viewBox = "0 0 640 360",
  className = "",
}) {
  return (
    <div
      className={`border-border overflow-hidden rounded-md border bg-[#0d1418] ${className}`}
    >
      <svg
        viewBox={viewBox}
        className="block h-auto w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
