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
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
        Danh sách tài liệu
      </h1>

      {/* SEARCH & FILTER BAR */}
      <div className="space-y-4 pt-4">
        <InputGroup className="h-12 w-full rounded-2xl shadow">
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
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            onClick={() => setActiveTab("all")}
            variant={activeTab === "all" ? "default" : "outline"}
            className="rounded-xl px-4 py-2 transition-all"
          >
            Tất cả
          </Button>
          {categorys.map((cat) => (
            <Button
              key={cat.id}
              variant={activeTab === cat.id ? "default" : "outline"}
              onClick={() => setActiveTab(cat.id)}
              className="rounded-xl px-4 py-2 transition-all"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
