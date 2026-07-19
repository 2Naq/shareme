import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import Link from '@docusaurus/Link';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// ─── Metadata ────────────────────────────────────────────────
function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

// ─── Sidebar: Author Card ─────────────────────────────────────
function AuthorCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-3">
          <Avatar className="size-16">
            <AvatarImage src="https://github.com/2Naq.png" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <CardTitle className="text-base">An Nguyễn</CardTitle>
            <CardDescription className="text-center text-xs">
              Thợ đụng, tập đụng — Chia sẻ kiến thức Điện & Tự Động Hóa công nghiệp
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-2">
        <Badge variant="outline" render={
          <a href="https://github.com/2Naq" target="_blank" rel="noopener noreferrer" className="no-underline">
            GitHub
          </a>
        } />
        <Badge variant="outline" render={
          <a href="https://2naq.github.io/shareme" target="_blank" rel="noopener noreferrer" className="no-underline">
            Website
          </a>
        } />
      </CardContent>
    </Card>
  );
}

// ─── Sidebar: Popular Posts ──────────────────────────────────
function PopularPosts({ items }) {
  const topPosts = items.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">🔥 Bài viết nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {topPosts.map((item, index) => {
          const { title, permalink, date } = item.content.metadata;
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
                <span className="text-xs text-muted-foreground">
                  {dateObj.toLocaleDateString('vi-VN')}
                </span>
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
        <CardTitle className="text-sm">🏷️ Danh mục</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? 'default' : 'outline'}
            className="cursor-pointer transition-all"
            render={
              <button
                onClick={() => onSelectTag(tag)}
              >
                {tag === 'Tất cả' ? 'Tất cả' : `#${tag}`}
              </button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Blog Horizontal Filter Bar ─────────────────────────────
function TagFilterBar({ allTags, selectedTag, onSelectTag }) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-3">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={clsx(
              'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border border-solid transition-all duration-200 cursor-pointer',
              selectedTag === tag
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {tag === 'Tất cả' ? '🏷️ Tất cả' : `# ${tag}`}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

// ─── Main Content ───────────────────────────────────────────
function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props;
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Trích xuất danh sách tag duy nhất
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    items.forEach((item) => {
      if (item.content?.metadata?.tags) {
        item.content.metadata.tags.forEach((tag) => {
          tagsSet.add(tag.label);
        });
      }
    });
    return ['Tất cả', ...Array.from(tagsSet)];
  }, [items]);

  // Lọc bài viết theo tag
  const filteredItems = useMemo(() => {
    if (selectedTag === 'Tất cả') return items;
    return items.filter((item) =>
      item.content?.metadata?.tags?.some((tag) => tag.label === selectedTag)
    );
  }, [items, selectedTag]);

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* ── Header ────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">Blog</h1>
          <p className="text-muted-foreground text-sm">
            Chia sẻ kiến thức Điện & Tự Động Hóa công nghiệp
          </p>
        </div>

        {/* ── Tag Filter Bar (cuộn ngang) ────────────── */}
        <div className="mb-6">
          <TagFilterBar
            allTags={allTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>

        <Separator className="mb-8" />

        {/* ── Layout 2 cột ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Grid bài viết */}
          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogPostItems items={filteredItems} />
            </div>
            {/* Pagination — chỉ khi không đang lọc */}
            {selectedTag === 'Tất cả' && (
              <div className="mt-8">
                <BlogListPaginator metadata={metadata} />
              </div>
            )}
          </main>

          {/* Cột phải: Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6 lg:sticky lg:top-[calc(var(--ifm-navbar-height)+2rem)] lg:self-start">
            <AuthorCard />
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
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
