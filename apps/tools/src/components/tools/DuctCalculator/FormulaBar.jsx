import React from 'react';

/**
 * FormulaBar: displays a formula string with syntax highlighting.
 * Accepts raw HTML (use <b> for amber highlights).
 */
export default function FormulaBar({ html }) {
  return (
    <div
      className="font-mono text-xs sm:text-sm text-cyan-400 bg-[#0d1418] border border-border rounded-md px-3 py-2.5 overflow-x-auto whitespace-nowrap [&_b]:text-amber-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
