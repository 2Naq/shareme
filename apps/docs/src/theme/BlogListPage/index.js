// oxlint-disable no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import BlogPostItems from "@theme/BlogPostItems";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import Link from "@docusaurus/Link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AuthorCard from "@/components/blog/AuthorCard";
import { Menu, SearchIcon, XIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// ─── Metadata ────────────────────────────────────────────────
function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

// ─── Sidebar: Popular Posts ──────────────────────────────────
function PopularPosts({ items }) {
  const topPosts = items.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">🔥Các bài viết nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {topPosts.map((item, index) => {
          const { title, permalink, date, authors } = item.content.metadata;
          const dateObj = new Date(date);
          return (
            <React.Fragment key={permalink}>
              {index > 0 && <Separator />}
              <Link
                to={permalink}
                className="group/popular flex flex-col gap-1 no-underline"
              >
                <span className="text-sm font-medium text-foreground group-hover/popular:text-primary transition-colors line-clamp-2">
                  {title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {dateObj.toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Sidebar: Tag Cloud ─────────────────────────────────────
function TagCloud({ allTags, selectedTag, onSelectTag }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold">Danh mục</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className="cursor-pointer transition-all"
            render={
              <button onClick={() => onSelectTag(tag)}>
                {tag === "Tất cả" ? "Tất cả" : `#${tag}`}
              </button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Blog Horizontal Filter Bar ─────────────────────────────
function TagFilterBar({ allTags, selectedTag, onSelectTag, hiddenTagsCount }) {
  return (
    <div className="flex gap-2 items-center">
      <>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={clsx(
              "shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border border-solid transition-all duration-200 cursor-pointer",
              selectedTag === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {tag === "Tất cả" ? "🏷️ Tất cả" : `# ${tag}`}
          </button>
        ))}

        {hiddenTagsCount > 0 && (
          <div className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border border-foreground/30 bg-muted select-none">
            <span>+{hiddenTagsCount}</span>
          </div>
        )}
      </>
    </div>
  );
}

function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props;
  console.log({ props });
  const { siteConfig } = useDocusaurusContext();
  const authors = siteConfig.customFields?.authors || {};
  const authorRaw = authors.anTng;
  const PRIMARY_AUTHOR = authorRaw
    ? {
        ...authorRaw,
        imageURL: authorRaw.image_url || authorRaw.imageURL,
        page: { permalink: "/blog/authors/an-nguyen" },
      }
    : null;

  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const [openDialog, setOpenDialog] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Trích xuất danh sách tag duy nhất và đếm số lượng bài viết của từng tag
  const { allTags, topTags, tagCounts } = useMemo(() => {
    const counts = { "Tất cả": items.length };
    items.forEach((item) => {
      if (item.content?.metadata?.tags) {
        item.content.metadata.tags.forEach((tag) => {
          counts[tag.label] = (counts[tag.label] || 0) + 1;
        });
      }
    });

    const tagsList = Object.keys(counts).filter((tag) => tag !== "Tất cả");

    // Sắp xếp các tag theo số bài viết giảm dần
    const sortedTags = [...tagsList].sort((a, b) => counts[b] - counts[a]);

    // Lấy top 4 tags nhiều bài nhất
    const top4 = sortedTags.slice(0, 4);

    return {
      allTags: ["Tất cả", ...sortedTags],
      topTags: ["Tất cả", ...top4],
      tagCounts: counts,
    };
  }, [items]);

  // Lọc danh sách tag hiển thị ở thanh bar nằm ngang:
  // Nếu tag đang chọn không nằm trong topTags, chèn thêm vào cuối để người dùng thấy feedback
  const visibleTags = useMemo(() => {
    if (topTags.includes(selectedTag)) {
      return topTags;
    }
    return [...topTags, selectedTag];
  }, [topTags, selectedTag]);

  // Số lượng tag bị ẩn
  const hiddenTagsCount = useMemo(() => {
    return allTags.length - visibleTags.length;
  }, [allTags, visibleTags]);

  // Lọc bài viết theo tag và từ khóa tìm kiếm (debouncedSearchQuery)
  const filteredItems = useMemo(() => {
    let result = items;

    // Lọc theo tag
    if (selectedTag !== "Tất cả") {
      result = result.filter((item) =>
        item.content?.metadata?.tags?.some((tag) => tag.label === selectedTag),
      );
    }

    // Lọc theo từ khóa tìm kiếm (title, description, tags)
    if (debouncedSearchQuery.trim() !== "") {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const title = item.content?.metadata?.title?.toLowerCase() || "";
        const description =
          item.content?.metadata?.description?.toLowerCase() || "";
        const tagsStr =
          item.content?.metadata?.tags
            ?.map((t) => t.label.toLowerCase())
            .join(" ") || "";
        return (
          title.includes(query) ||
          description.includes(query) ||
          tagsStr.includes(query)
        );
      });
    }

    return result;
  }, [items, selectedTag, debouncedSearchQuery]);

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* ── Header ────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">Blog</h1>
        </div>

        {/* ── Tag Filter Bar & Search Input (cuộn ngang và tìm kiếm bài viết) ── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6 w-full min-w-0">
          {/* Cụm bộ lọc tag bên trái */}
          <div className="flex gap-2 items-center w-full flex-1 overflow-x-hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenDialog(true)}
                className="shrink-0 size-8"
                title="Xem tất cả danh mục"
              >
                <Menu className="size-4" />
              </Button>

              <Separator orientation="vertical" className="h-6 w-px" />
            </div>

            <ScrollArea className="w-60 flex-1">
              <TagFilterBar
                allTags={visibleTags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                hiddenTagsCount={hiddenTagsCount}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Ô tìm kiếm bài viết bên phải */}
          <InputGroup className="w-full md:max-w-xs h-8 shrink-0">
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4 opacity-50" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Tìm kiếm bài viết..."
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
        </div>

        {/* ── Command Dialog tìm kiếm danh mục ──────────────── */}
        <CommandDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Tìm kiếm danh mục"
          description="Tìm kiếm và lựa chọn danh mục bài viết"
        >
          <CommandInput placeholder="Tìm kiếm danh mục..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục nào.</CommandEmpty>
            <CommandGroup heading="Danh mục bài viết">
              {allTags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => {
                    setSelectedTag(tag);
                    setOpenDialog(false);
                  }}
                  data-checked={selectedTag === tag ? "true" : "false"}
                >
                  <span>{tag === "Tất cả" ? "🏷️ Tất cả" : `# ${tag}`}</span>
                  {tagCounts[tag] !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {tagCounts[tag]} bài viết
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* ── Layout 2 cột ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Grid bài viết */}
          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BlogPostItems items={filteredItems} />
            </div>
            {/* Pagination — chỉ khi không đang lọc */}
            {selectedTag === "Tất cả" && (
              <div className="mt-8">
                <BlogListPaginator metadata={metadata} />
              </div>
            )}
          </main>

          {/* Cột phải: Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6 lg:sticky lg:top-[calc(var(--ifm-navbar-height)+2rem)] lg:self-start">
            <AuthorCard author={PRIMARY_AUTHOR} />
            <PopularPosts items={items} />
            <TagCloud
              allTags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

// ─── Export ──────────────────────────────────────────────────
export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
