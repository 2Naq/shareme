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

          className="text-muted-foreground hover:text-foreground no-underline"
        >
          ← Xem tất cả tác giả
        </Link>
      }
    />
  );
}

function Content({ author, items, listMetadata }) {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Author Header */}
        <div className="mx-auto mb-6 max-w-md">
          <AuthorCard author={author} variant="large" />
        </div>

        <div className="mb-6 flex justify-center">
          <ViewAllAuthorsLink />
        </div>

        <Separator className="mb-8" />

        {/* Bài viết */}
        {items.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">
            Tác giả này chưa có bài viết nào.
          </p>
        ) : (
          <>
            <h2 className="text-foreground mb-6 text-xl font-bold">
              Bài viết ({items.length})
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
