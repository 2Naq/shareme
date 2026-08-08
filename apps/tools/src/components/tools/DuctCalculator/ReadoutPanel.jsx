import React from "react";

/**
 * ReadoutPanel: displays calculation results in a grid.
 * items: Array<{ label: string, value: string|number, unit: string }>
 */
export default function ReadoutPanel({ items = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="border-border rounded-md border bg-[#0d1418] px-3 py-2.5"
        >
          <div className="text-muted-foreground mb-1 text-[10.5px] tracking-wider uppercase">
            {item.label}
          </div>
          <div className="font-mono text-xl font-bold text-amber-400">
            {item.value}
            <span className="text-muted-foreground ml-0.5 text-xs font-normal">
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
