import React from "react";
import clsx from "clsx";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import { useBlogMetadata } from "@docusaurus/plugin-content-blog/client";
import Layout from "@theme/Layout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import BlogPostItems from "@theme/BlogPostItems";
import AuthorCard from "@/components/blog/AuthorCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function Metadata({ author }) {
  const title = `Bài viết của ${author.name}`;
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_posts" />
    </>
  );
}

function ViewAllAuthorsLink() {
  const { authorsListPath } = useBlogMetadata();
  return (
    <Button
      variant="outline"
      className="mt-3"
      nativeButton={false}
      render={
        <Link
          to={authorsListPath}

          className="no-underline text-muted-foreground hover:text-foreground"
        >
          ← Xem tất cả tác giả
        </Link>
      }
    />
  );
}

function Content({ author, items, sidebar, listMetadata }) {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Author Header */}
        <div className="max-w-md mx-auto mb-6">
          <AuthorCard author={author} variant="large" />
        </div>

        <div className="flex justify-center mb-6">
          <ViewAllAuthorsLink />
        </div>

        <Separator className="mb-8" />

        {/* Bài viết */}
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Tác giả này chưa có bài viết nào.
          </p>
        ) : (
          <>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Bài viết ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogPostItems items={items} />
            </div>
            <div className="mt-8">
              <BlogListPaginator metadata={listMetadata} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default function BlogAuthorsPostsPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsPostsPage,
      )}
    >
      <Metadata {...props} />
      <Content {...props} />
    </HtmlClassNameProvider>
  );
}
