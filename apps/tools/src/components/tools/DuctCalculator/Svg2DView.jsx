import React from 'react';

/**
 * Renders SVG 2D diagram content using dangerouslySetInnerHTML.
 * This is necessary because the SVG markup is generated dynamically
 * by the helper functions.
 */
export default function Svg2DView({ svgContent, viewBox = '0 0 640 360', className = '' }) {
  return (
    <div
      className={`rounded-md border border-border overflow-hidden bg-[#0d1418] ${className}`}
    >
      <svg
        viewBox={viewBox}
        className="block w-full h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
