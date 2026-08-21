import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function DevicePagination({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
}) {
  if (totalItems === 0) return null;

  const isAll = pageSize === "all" || pageSize >= totalItems;
  const numericPageSize = isAll ? totalItems : Number(pageSize);
  const totalPages = isAll ? 1 : Math.ceil(totalItems / numericPageSize);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * numericPageSize + 1;
  const endItem = Math.min(currentPage * numericPageSize, totalItems);

  // Generate page numbers array (with ellipsis window if many pages)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  return (
    <div className="border-border/60 bg-card flex flex-col gap-3 rounded-2xl border p-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
      {/* Left: Summary & Page Size Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
        <div className="text-muted-foreground">
          Hiển thị{" "}
          <span className="text-foreground font-bold">
            {startItem} - {endItem}
          </span>{" "}
          trên tổng số{" "}
          <span className="text-foreground font-bold">{totalItems}</span> thiết
          bị
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden sm:inline">
            Hiển thị:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(val === "all" ? "all" : Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-25-xs border-border/60 h-8 rounded-lg">
              <SelectValue placeholder="10 / trang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / trang</SelectItem>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: Navigation Controls */}
      {!isAll && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 self-center sm:self-auto">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            title="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Prev Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          <div className="mx-1 flex items-center gap-1">
            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-muted-foreground px-1.5 font-mono"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${num}`}
                  variant={currentPage === num ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(Number(num))}
                  className="h-8 w-8 rounded-lg p-0 font-mono text-xs font-medium"
                >
                  {num}
                </Button>
              ),
            )}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            title="Trang kế"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
