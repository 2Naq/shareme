import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORIES, ACCESS_MODES } from "../data/fxDevicesData";
import {
  Search,
  X,
  LayoutGrid,
  Table as TableIcon,
  Filter,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

export function DeviceSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedRw,
  setSelectedRw,
  viewMode,
  setViewMode,
  totalResults,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sentinelRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const scrollParent =
      sentinel.closest("main") ||
      sentinel.closest(".overflow-auto") ||
      sentinel.closest(".overflow-y-auto");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (scrollParent) {
          const parentTop = scrollParent.getBoundingClientRect().top;
          const sentinelTop = entry.boundingClientRect.top;
          setIsStuck(sentinelTop <= parentTop + 2);
        } else {
          setIsStuck(!entry.isIntersecting);
        }
      },
      {
        root: scrollParent || null,
        threshold: [0, 1],
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Active filter count excluding text search query
  const activeFilterCount =
    (selectedType !== "all" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedRw !== "all" ? 1 : 0);

  const isFiltered = searchQuery || activeFilterCount > 0;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedRw("all");
  };

  const selectedCategoryLabel = CATEGORIES.find(
    (c) => c.id === selectedCategory,
  )?.label;

  return (
    <>
      {/* Sentinel element to detect when sticky is active */}
      <div
        ref={sentinelRef}
        className="pointer-events-none h-0 w-full opacity-0"
      />

      <div
        className={`bg-card/95 sticky top-0 z-30 space-y-2 p-3 backdrop-blur-md transition-all duration-200 sm:p-4 ${
          isStuck
            ? "border-border/80 rounded-none border border-t-0"
            : "border-border/60 rounded-2xl border"
        }`}
      >
        {/* Main Sticky Row: Search Input + Filter Popover Dropdown Button + View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm kiếm M8000, D8120, RS485, Clock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-visible:ring-primary h-9 rounded-xl pr-9 pl-10 text-xs sm:h-10 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:bg-accent hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 transition-colors"
                title="Xóa từ khóa"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdown Popover Button */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant={activeFilterCount > 0 ? "default" : "outline"}
                  size="sm"
                  className={`h-9 shrink-0 gap-1.5 rounded-xl px-2.5 font-medium sm:h-10 sm:px-3.5 ${
                    activeFilterCount > 0 ? "shadow-xs" : "border-border/60"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Bộ lọc</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-foreground text-primary flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold sm:h-5 sm:min-w-5 sm:text-[11px]">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />

            <PopoverContent
              align="end"
              className="border-border/80 bg-popover z-50 w-75 space-y-4 rounded-2xl border p-4 shadow-xl sm:w-90"
            >
              {/* Header */}
              <div className="border-border/40 flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <Filter className="text-primary h-4 w-4" />
                  <span className="text-foreground text-sm font-semibold">
                    Bộ lọc nâng cao
                  </span>
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategory("all");
                      setSelectedRw("all");
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Đặt lại
                  </Button>
                )}
              </div>

              {/* Device Type */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  Loại thiết bị
                </label>
                <div className="bg-muted/50 grid grid-cols-3 gap-1 rounded-xl p-1">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "bit", label: "Bit (M)" },
                    { id: "word", label: "Word (D)" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedType(tab.id)}
                      className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                        selectedType === tab.id
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  Nhóm chức năng
                </label>
                <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-background border-border/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Access Mode */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  Quyền truy cập (R/W)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {ACCESS_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedRw(mode.id)}
                      className={`rounded-lg border px-1.5 py-1 text-center font-mono text-xs font-medium transition-all ${
                        selectedRw === mode.id
                          ? "bg-foreground text-background border-foreground font-bold"
                          : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode.id === "all" ? "Mọi R/W" : mode.id}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Mode Switcher */}
          <div className="bg-muted/60 border-border/40 flex shrink-0 items-center gap-0.5 rounded-xl border p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-7 w-7 rounded-lg text-xs sm:h-8 sm:w-auto sm:px-2.5"
              title="Chế độ Bảng"
            >
              <TableIcon className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden font-medium sm:inline">Bảng</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-7 w-7 rounded-lg text-xs sm:h-8 sm:w-auto sm:px-2.5"
              title="Chế độ Thẻ (Card)"
            >
              <LayoutGrid className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden font-medium sm:inline">Thẻ</span>
            </Button>
          </div>
        </div>

        {/* Active Filter Chips & Results Count Bar */}
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-1.5 border-t pt-2 text-xs">
          <div className="text-muted-foreground flex flex-wrap items-center gap-1.5">
            <span>
              Tìm thấy{" "}
              <strong className="text-foreground font-bold">
                {totalResults}
              </strong>{" "}
              kết quả
            </span>

            {selectedType !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-md px-2 py-0.5 text-[11px] font-normal"
              >
                Loại: {selectedType === "bit" ? "Bit (M)" : "Word (D)"}
                <X
                  className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                  onClick={() => setSelectedType("all")}
                />
              </Badge>
            )}

            {selectedCategory !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-md px-2 py-0.5 text-[11px] font-normal"
              >
                Nhóm: {selectedCategoryLabel}
                <X
                  className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}

            {selectedRw !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-normal"
              >
                R/W: {selectedRw}
                <X
                  className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                  onClick={() => setSelectedRw("all")}
                />
              </Badge>
            )}
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto h-5 px-1.5 text-[11px]"
            >
              <X className="mr-1 h-3 w-3" />
              Đặt lại tất cả
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
