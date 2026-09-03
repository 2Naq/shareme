import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BRANDS,
  FAULT_CATEGORIES,
  REGISTER_CATEGORIES,
  REGISTER_TYPES,
} from "../data/types";
import {
  Search,
  X,
  LayoutGrid,
  Table as TableIcon,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export function InverterSearchFilter({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedRegisterType,
  setSelectedRegisterType,
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

  const activeFilterCount =
    (selectedBrand !== "all" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (activeTab === "registers" && selectedRegisterType !== "all" ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedRegisterType("all");
    setSearchQuery("");
  };

  const categories =
    activeTab === "faults" ? FAULT_CATEGORIES : REGISTER_CATEGORIES;

  return (
    <>
      <div ref={sentinelRef} className="h-0 w-full" />
      <div
        className={`bg-card/95 border-border/80 sticky top-0 z-20 space-y-3 rounded-2xl border p-3.5 backdrop-blur-md transition-all duration-200 ${
          isStuck
            ? "border-border/80 rounded-none border border-t-0"
            : "border-border/60 rounded-2xl border"
        }`}
      >
        {/* Main Bar: Search + Tab Switcher + View Mode Toggle */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={
                activeTab === "faults"
                  ? "Tìm mã lỗi (E.OC1, E01, E-02...), mã Hex (10H), triệu chứng, tên lỗi..."
                  : "Tìm thanh ghi (40003, 0002H, 2000H...), chức năng, tên cờ bit..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 pl-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-0.5"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tab Switcher: Lỗi vs Modbus */}
          <div className="bg-muted/60 border-border/60 flex items-center rounded-xl border p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("faults");
                setSelectedCategory("all");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "faults"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mã Lỗi Biến Tần
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("registers");
                setSelectedCategory("all");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "registers"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Thanh Ghi Modbus
            </button>
          </div>

          {/* Mobile Filter Button & View Mode */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {/* Filter Popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative gap-1.5 rounded-xl text-xs font-medium"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Bộ Lọc
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary ml-1 h-5 px-1.5 text-[10px] font-bold"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 space-y-4 p-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <SlidersHorizontal className="h-4 w-4" />
                    Tùy chọn lọc
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-primary text-xs hover:underline"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>

                {/* Hãng biến tần */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">
                    Hãng sản xuất
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="border-input bg-background text-foreground w-full rounded-lg border px-2.5 py-1.5 text-xs outline-hidden"
                  >
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phân loại Category */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">
                    Phân loại{" "}
                    {activeTab === "faults" ? "nhóm lỗi" : "chức năng"}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border-input bg-background text-foreground w-full rounded-lg border px-2.5 py-1.5 text-xs outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loại Modbus nếu đang ở tab Registers */}
                {activeTab === "registers" && (
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-medium">
                      Loại đối tượng Modbus
                    </label>
                    <select
                      value={selectedRegisterType}
                      onChange={(e) => setSelectedRegisterType(e.target.value)}
                      className="border-input bg-background text-foreground w-full rounded-lg border px-2.5 py-1.5 text-xs outline-hidden"
                    >
                      {REGISTER_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* View Mode Toggle Button */}
            <div className="bg-muted/60 border-border/60 flex items-center rounded-xl border p-0.5">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 rounded-lg"
                title="Xem dạng Bảng (Table)"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 rounded-lg"
                title="Xem dạng Lưới Thẻ (Cards Grid)"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Brand Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-muted-foreground mr-1 text-xs font-medium">
            Hãng:
          </span>
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => setSelectedBrand(brand.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {brand.badge}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Đặt lại
              </Button>
            )}
            <Badge variant="outline" className="text-muted-foreground text-xs">
              {totalResults} kết quả
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}
