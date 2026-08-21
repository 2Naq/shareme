import React, { useState, useMemo, useEffect } from "react";
import { ALL_DEVICES } from "./data/fxDevicesData";
import { DeviceStats } from "./components/DeviceStats";
import { DeviceSearchFilter } from "./components/DeviceSearchFilter";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceGrid } from "./components/DeviceGrid";
import { DevicePagination } from "./components/DevicePagination";
import { DeviceDetailModal } from "./components/DeviceDetailModal";

export default function FxSpecialDevices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRw, setSelectedRw] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default 10 items per page

  // Filter & search processing
  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_DEVICES.filter((device) => {
      // 1. Type Filter (all, bit, word)
      if (selectedType !== "all" && device.type !== selectedType) {
        return false;
      }

      // 2. Category Filter (all, comm, system, clock, error, math, positioning, analog)
      if (selectedCategory !== "all" && device.category !== selectedCategory) {
        return false;
      }

      // 3. R/W Filter (all, R, W, R/W)
      if (selectedRw !== "all" && device.rw !== selectedRw) {
        return false;
      }

      // 4. Search Query (ID, Name, Summary, Description, Tags)
      if (query) {
        const matchesId = device.id.toLowerCase().includes(query);
        const matchesName = device.name.toLowerCase().includes(query);
        const matchesSummary = device.summary.toLowerCase().includes(query);
        const matchesDesc = device.description.toLowerCase().includes(query);
        const matchesModels = device.applicableModels.toLowerCase().includes(query);
        const matchesTags = device.tags?.some((t) => t.toLowerCase().includes(query));

        return matchesId || matchesName || matchesSummary || matchesDesc || matchesModels || matchesTags;
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedRw]);

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedCategory, selectedRw]);

  // Paginated devices slice
  const paginatedDevices = useMemo(() => {
    if (pageSize === "all") return filteredDevices;
    const start = (currentPage - 1) * pageSize;
    return filteredDevices.slice(start, start + pageSize);
  }, [filteredDevices, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header Description */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Tra Cứu Special Bit & Word Devices PLC Mitsubishi FX Series
        </h2>
        <p className="text-sm text-muted-foreground">
          Tra cứu nhanh các rơ-le phụ đặc biệt (Bit M8000+) và thanh ghi đặc biệt (Word D8000+) trên các dòng PLC FX0N, FX1S, FX1N, FX2N, FX3G, FX3U, FX3UC...
        </p>
      </div>

      {/* Overview Statistics */}
      <DeviceStats devices={ALL_DEVICES} />

      {/* Search & Filtering Control Panel */}
      <DeviceSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedRw={selectedRw}
        setSelectedRw={setSelectedRw}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalResults={filteredDevices.length}
      />

      {/* Main Content Display (Table or Cards Grid) */}
      {viewMode === "table" ? (
        <DeviceTable devices={paginatedDevices} onSelectDevice={setSelectedDevice} />
      ) : (
        <DeviceGrid devices={paginatedDevices} onSelectDevice={setSelectedDevice} />
      )}

      {/* Pagination Controls */}
      <DevicePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={filteredDevices.length}
      />

      {/* Detail Modal Dialog */}
      <DeviceDetailModal
        device={selectedDevice}
        isOpen={Boolean(selectedDevice)}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
}
