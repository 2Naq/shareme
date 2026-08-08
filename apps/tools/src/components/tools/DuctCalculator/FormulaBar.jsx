import React from "react";

/**
 * FormulaBar: displays a formula string with syntax highlighting.
 * Accepts raw HTML (use <b> for amber highlights).
 */
export default function FormulaBar({ html, children }) {
  if (children) {
    return (
      <div className="border-border flex items-center gap-2 overflow-x-auto rounded-md border bg-[#0d1418] px-3 py-2.5 font-mono text-xs whitespace-nowrap text-cyan-400 sm:text-sm [&_b]:text-amber-400">
        {children}
      </div>
    );
  }

  return (
    <div
      className="border-border overflow-x-auto rounded-md border bg-[#0d1418] px-3 py-2.5 font-mono text-xs whitespace-nowrap text-cyan-400 sm:text-sm [&_b]:text-amber-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
