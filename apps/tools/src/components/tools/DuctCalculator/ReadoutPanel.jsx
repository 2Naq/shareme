import React from "react";

/**
 * ReadoutPanel: displays calculation results in a grid.
 * items: Array<{ label: string, value: string|number, unit: string }>
 */
export default function ReadoutPanel({ items = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-[#0d1418] border border-border rounded-md px-3 py-2.5"
        >
          <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground mb-1">
            {item.label}
          </div>
          <div className="font-mono text-xl font-bold text-amber-400">
            {item.value}
            <span className="text-xs text-muted-foreground font-normal ml-0.5">
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
