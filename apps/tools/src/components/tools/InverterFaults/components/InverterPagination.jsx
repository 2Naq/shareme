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

export function InverterPagination({
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
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
      {/* Items count display */}
      <div className="text-muted-foreground text-xs">
        Hiển thị{" "}
        <span className="text-foreground font-semibold">
          {startItem}-{endItem}
        </span>{" "}
        trong tổng số{" "}
        <span className="text-foreground font-semibold">{totalItems}</span> mục
      </div>

      {/* Pagination controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Page size select */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs">Mỗi trang:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(val === "all" ? "all" : Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-20 rounded-lg text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation buttons */}
        {!isAll && totalPages > 1 && (
          <div className="flex items-center gap-1">
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

            <div className="flex items-center gap-1 px-1">
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="text-muted-foreground px-1 text-xs"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-8 rounded-lg px-2.5 text-xs font-semibold"
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
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
    </div>
  );
}
