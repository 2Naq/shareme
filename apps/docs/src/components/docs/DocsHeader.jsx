import React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { categorys } from "@site/src/constants/category";

export default function DocsHeader({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="text-center space-y-4 max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Danh sách tài liệu
      </h1>

      {/* SEARCH & FILTER BAR */}
      <div className="pt-4 space-y-4">
        <InputGroup className="w-full h-12 shadow rounded-2xl">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4 opacity-50" />
          </InputGroupAddon>
          <InputGroupInput
            className="w-full"
            placeholder="Tìm kiếm thư mục, thương hiệu, mã thiết bị (Mitsubishi, E720, Omron...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                onClick={() => setSearchQuery("")}
                title="Xóa tìm kiếm"
              >
                <XIcon className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* FILTER TABS */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Button
            onClick={() => setActiveTab("all")}
            variant={activeTab === "all" ? "default" : "outline"}
            className="px-4 py-2 rounded-xl transition-all"
          >
            Tất cả
          </Button>
          {categorys.map((cat) => (
            <Button
              key={cat.id}
              variant={activeTab === cat.id ? "default" : "outline"}
              onClick={() => setActiveTab(cat.id)}
              className="px-4 py-2 rounded-xl transition-all"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
