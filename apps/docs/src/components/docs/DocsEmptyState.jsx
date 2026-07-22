import React from "react";
import { Button } from "@/components/ui/button";
import { NotFileIcon } from "@/components/icons";

export default function DocsEmptyState({ onReset }) {
  return (
    <div className="text-center py-16 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
      <NotFileIcon />
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
        Không tìm thấy tài liệu phù hợp
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
        Thử lại với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.
      </p>
      <Button onClick={onReset}>Đặt lại bộ lọc</Button>
    </div>
  );
}
