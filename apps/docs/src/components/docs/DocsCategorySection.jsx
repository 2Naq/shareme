import React from "react";
import { FolderGit2, Cpu, Sliders, CircuitBoard } from "lucide-react";
import DocCard from "./DocCard";
import { Badge } from "../ui/badge";

const CATEGORY_ICONS = {
  plc: Cpu,
  inverter: CircuitBoard,
  other: Sliders,
};

export default function DocsCategorySection({ category }) {
  const CategoryIconComponent = CATEGORY_ICONS[category.id] || FolderGit2;

  return (
    <section className="space-y-5">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-muted/80 border-input/30 flex items-center justify-center rounded-xl border p-2.5">
            <CategoryIconComponent className="h-6 w-6" />
          </div>
          <div>
            <h2 className="m-0 text-xl font-bold tracking-tight sm:text-2xl">
              {category.title}
            </h2>
            <p className="m-0 text-xs sm:text-sm">{category.description}</p>
          </div>
        </div>
        <Badge variant="secondary">{category.items.length} mục</Badge>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <DocCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
