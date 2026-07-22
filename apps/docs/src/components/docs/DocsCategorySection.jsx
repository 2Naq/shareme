import React from "react";
import { FolderGit2, Cpu, Zap, Sliders } from "lucide-react";
import DocCard from "./DocCard";
import { Badge } from "../ui/badge";

const CATEGORY_ICONS = {
  plc: Cpu,
  inverter: Zap,
  other: Sliders,
};

export default function DocsCategorySection({ category }) {
  const CategoryIconComponent = CATEGORY_ICONS[category.id] || FolderGit2;

  return (
    <section className="space-y-5">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-muted/80 flex items-center justify-center border border-input/30">
            <CategoryIconComponent className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight m-0">
              {category.title}
            </h2>
            <p className="text-xs sm:text-sm m-0">{category.description}</p>
          </div>
        </div>
        <Badge variant="secondary">{category.items.length} mục</Badge>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.items.map((item) => (
          <DocCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
