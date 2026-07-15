import React from 'react';

/**
 * FormulaBar: displays a formula string with syntax highlighting.
 * Accepts raw HTML (use <b> for amber highlights).
 */
export default function FormulaBar({ html, children }) {
  if (children) {
    return (
      <div className="font-mono text-xs sm:text-sm text-cyan-400 bg-[#0d1418] border border-border rounded-md px-3 py-2.5 overflow-x-auto whitespace-nowrap flex items-center gap-2 [&_b]:text-amber-400">
        {children}
      </div>
    );
  }

  return (
    <div
      className="font-mono text-xs sm:text-sm text-cyan-400 bg-[#0d1418] border border-border rounded-md px-3 py-2.5 overflow-x-auto whitespace-nowrap [&_b]:text-amber-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
