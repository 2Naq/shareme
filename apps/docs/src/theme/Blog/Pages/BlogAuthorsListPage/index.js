// oxlint-disable no-unused-vars
import React from "react";
import clsx from "clsx";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import SearchMetadata from "@theme/SearchMetadata";
import AuthorCard from "@/components/blog/AuthorCard";
import { Separator } from "@/components/ui/separator";
import AboutHighlight from "@/components/AboutHighlight";

export default function BlogAuthorsListPage({ authors, sidebar }) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsListPage,
      )}
    >
      <PageMetadata title="Tác giả" />
      <SearchMetadata tag="blog_authors_list" />
      <Layout>
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">Tác giả</h1>
            <p className="text-muted-foreground text-sm">
              Những người đóng góp nội dung cho blog{" "}
              <AboutHighlight text="shareme"></AboutHighlight>
            </p>
          </div>

          <Separator className="mb-8" />

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <AuthorCard
                key={author.key}
                author={author}
                count={author.count}
              />
            ))}
          </div>
        </div>
      </Layout>
    </HtmlClassNameProvider>
  );
}
