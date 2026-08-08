import React from "react";
import { Button } from "@/components/ui/button";
import { NotFileIcon } from "@/components/icons";

export default function DocsEmptyState({ onReset }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <NotFileIcon />
      <h3 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-200">
        Không tìm thấy tài liệu phù hợp
      </h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Thử lại với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.
      </p>
      <Button onClick={onReset}>Đặt lại bộ lọc</Button>
    </div>
  );
}
