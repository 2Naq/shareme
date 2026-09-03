import React, { useState, useMemo, useEffect } from "react";
import { ALL_FAULTS, ALL_REGISTERS } from "./data";
import { InverterStats } from "./components/InverterStats";
import { InverterSearchFilter } from "./components/InverterSearchFilter";
import { FaultTable } from "./components/FaultTable";
import { ModbusRegisterTable } from "./components/ModbusRegisterTable";
import { InverterGrid } from "./components/InverterGrid";
import { FaultDetailModal } from "./components/FaultDetailModal";
import { RegisterDetailModal } from "./components/RegisterDetailModal";
import { InverterPagination } from "./components/InverterPagination";

export default function InverterFaults() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState("faults"); // "faults" | "registers"
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegisterType, setSelectedRegisterType] = useState("all");

  // Selection states for Modals
  const [selectedFault, setSelectedFault] = useState(null);
  const [selectedRegister, setSelectedRegister] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter Faults
  const filteredFaults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_FAULTS.filter((fault) => {
      // 1. Brand filter
      if (selectedBrand !== "all" && fault.brand !== selectedBrand) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all" && fault.category !== selectedCategory) {
        return false;
      }

      // 3. Search query
      if (query) {
        const matchesCode = fault.code.toLowerCase().includes(query);
        const matchesName = fault.name.toLowerCase().includes(query);
        const matchesHex = fault.hexCode.toLowerCase().includes(query);
        const matchesDec = String(fault.decCode).toLowerCase().includes(query);
        const matchesModels = fault.models.some((m) =>
          m.toLowerCase().includes(query),
        );
        const matchesCauses = fault.causes.some((c) =>
          c.toLowerCase().includes(query),
        );
        const matchesSolutions = fault.solutions.some((s) =>
          s.toLowerCase().includes(query),
        );
        const matchesTips = fault.expertTips?.toLowerCase().includes(query);

        return (
          matchesCode ||
          matchesName ||
          matchesHex ||
          matchesDec ||
          matchesModels ||
          matchesCauses ||
          matchesSolutions ||
          matchesTips
        );
      }

      return true;
    });
  }, [searchQuery, selectedBrand, selectedCategory]);

  // Filter Modbus Registers
  const filteredRegisters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_REGISTERS.filter((reg) => {
      // 1. Brand filter
      if (selectedBrand !== "all" && reg.brand !== selectedBrand) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all" && reg.category !== selectedCategory) {
        return false;
      }

      // 3. Register Type filter (coil vs holding)
      if (selectedRegisterType !== "all" && reg.type !== selectedRegisterType) {
        return false;
      }

      // 4. Search query
      if (query) {
        const matchesHex = reg.addressHex0Based.toLowerCase().includes(query);
        const matchesDec = String(reg.addressDec1Based)
          .toLowerCase()
          .includes(query);
        const matchesName = reg.name.toLowerCase().includes(query);
        const matchesDesc = reg.description.toLowerCase().includes(query);
        const matchesBits = reg.bitDetails?.some(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.desc.toLowerCase().includes(query) ||
            b.bit.toLowerCase().includes(query),
        );

        return (
          matchesHex || matchesDec || matchesName || matchesDesc || matchesBits
        );
      }

      return true;
    });
  }, [searchQuery, selectedBrand, selectedCategory, selectedRegisterType]);

  // Reset to page 1 on filter or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchQuery,
    selectedBrand,
    selectedCategory,
    selectedRegisterType,
  ]);

  // Active items and pagination
  const currentItems =
    activeTab === "faults" ? filteredFaults : filteredRegisters;

  const paginatedItems = useMemo(() => {
    if (pageSize === "all") return currentItems;
    const start = (currentPage - 1) * pageSize;
    return currentItems.slice(start, start + pageSize);
  }, [currentItems, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header Description */}
      <div className="space-y-1">
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Tra Cứu Mã Lỗi & Toàn Bộ Thanh Ghi Modbus Biến Tần
        </h2>
        <p className="text-muted-foreground text-sm">
          Công cụ toàn diện hỗ trợ ní tra cứu mã lỗi, mã Hex/Dec, nguyên nhân,
          Gợi ý xử lý và đầy đủ thanh ghi cuộn Coil & Holding Register (RS-485
          Modbus RTU) cho các dòng biến tần Mitsubishi, Omron, Wecon...
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <InverterStats
        faults={filteredFaults}
        registers={filteredRegisters}
        selectedBrand={selectedBrand}
      />

      {/* Search & Multi-level Filter */}
      <InverterSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedRegisterType={selectedRegisterType}
        setSelectedRegisterType={setSelectedRegisterType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalResults={currentItems.length}
      />

      {/* Main Content Display */}
      {activeTab === "faults" ? (
        viewMode === "table" ? (
          <FaultTable
            faults={paginatedItems}
            onSelectFault={setSelectedFault}
          />
        ) : (
          <InverterGrid
            items={paginatedItems}
            activeTab="faults"
            onSelectItem={setSelectedFault}
          />
        )
      ) : viewMode === "table" ? (
        <ModbusRegisterTable
          registers={paginatedItems}
          onSelectRegister={setSelectedRegister}
        />
      ) : (
        <InverterGrid
          items={paginatedItems}
          activeTab="registers"
          onSelectItem={setSelectedRegister}
        />
      )}

      {/* Pagination Controls */}
      <InverterPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={currentItems.length}
      />

      {/* Fault Detail Modal */}
      <FaultDetailModal
        fault={selectedFault}
        isOpen={Boolean(selectedFault)}
        onClose={() => setSelectedFault(null)}
      />

      {/* Modbus Register Detail Modal */}
      <RegisterDetailModal
        register={selectedRegister}
        isOpen={Boolean(selectedRegister)}
        onClose={() => setSelectedRegister(null)}
      />
    </div>
  );
}
