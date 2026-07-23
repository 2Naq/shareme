import React, { useState, useMemo } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useDynamicDocsCategories } from "@site/src/components/docs/useDynamicDocsCategories";
import DocsHeader from "@site/src/components/docs/DocsHeader";
import DocsCategorySection from "@site/src/components/docs/DocsCategorySection";
import DocsEmptyState from "@site/src/components/docs/DocsEmptyState";

export default function DocsShowcase() {
  const { siteConfig } = useDocusaurusContext();
  const docsCategories = useDynamicDocsCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter categories and items based on search and tab filter
  const filteredCategories = useMemo(() => {
    return docsCategories
      .map((category) => {
        if (activeTab !== "all" && category.id !== activeTab) {
          return null;
        }

        const matchingItems = category.items.filter((item) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.folderName.toLowerCase().includes(query) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        });

        if (matchingItems.length === 0) return null;

        return {
          ...category,
          items: matchingItems,
        };
      })
      .filter(Boolean);
  }, [docsCategories, searchQuery, activeTab]);

  const handleReset = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  return (
    <Layout title={`${siteConfig.title}`} description="Automation notes">
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <DocsHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {filteredCategories.length === 0 ? (
            <DocsEmptyState onReset={handleReset} />
          ) : (
            filteredCategories.map((category) => (
              <DocsCategorySection key={category.id} category={category} />
            ))
          )}
        </div>
      </main>
    </Layout>
  );
}
