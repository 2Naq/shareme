import React, { useMemo } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemContainer from "@theme/BlogPostItem/Container";
import BlogPostItemHeader from "@theme/BlogPostItem/Header";
import BlogPostItemContent from "@theme/BlogPostItem/Content";
import BlogPostItemFooter from "@theme/BlogPostItem/Footer";
import Link from "@docusaurus/Link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AuthorCard, { AuthorAvt } from "@/components/blog/AuthorCard";

// Component con hiển thị Avatar của từng Tác giả với hiệu ứng Hover Card
const AuthorAvatar = React.memo(({ author }) => {
  const authorInitials = useMemo(() => {
    if (!author || !author.name) return "AN";
    return author.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, [author]);

  return (
    <HoverCard>
      <HoverCardTrigger delay={0} closeDelay={0}>
        {AuthorAvt({
          imageURL: author.imageURL,
          name: author.name,
          initials: authorInitials,
          avatarSize: "size-8",
          isPro: author.isPro,
          isShowPro: false,
        })}
      </HoverCardTrigger>
      <HoverCardContent className="bg-transparent border-none ring-0 shadow-none">
        <AuthorCard author={author} count={author.count} variant="compact" />
      </HoverCardContent>
    </HoverCard>
  );
});

export default function BlogPostItem({ children, className }) {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { frontMatter, title, readingTime, date, authors, tags, permalink } =
    metadata;

  const thumbnail = frontMatter.image;
  const dateObject = new Date(date);

  // 1. Nếu đang xem CHI TIẾT bài viết, giữ nguyên giao diện đọc mặc định của Docusaurus
  if (isBlogPostPage) {
    return (
      <BlogPostItemContainer className={className}>
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
      </BlogPostItemContainer>
    );
  }

  // Render tối đa 2 tác giả trong Avatar Group
  const showAuthorAvt = 4;
  const avatarGroup = authors
    ?.slice(0, showAuthorAvt)
    .map((author, index) => <AuthorAvatar key={index} author={author} />);

  return (
    <Card
      title={title}
      className="relative group/card h-101 px-0 overflow-hidden"
    >
      <CardHeader>
        <div className="flex flex-row items-center">
          <div className="relative z-20">
            <AvatarGroup>
              {avatarGroup}
              {authors && authors.length > showAuthorAvt && (
                <AvatarGroupCount>
                  +{authors.length - showAuthorAvt}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>
          <span className="ml-auto flex flex-row invisible group-hover/card:visible relative z-20">
            <Button
              variant="outline"
              className="min-w-0 truncate"
              nativeButton={false}
              render={
                <Link
                  className="no-underline hover:text-foreground/60 text-foreground/50"
                  to={permalink}
                >
                  Đọc thêm
                </Link>
              }
            />
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 h-full">
        <h3 className="line-clamp-3 m-0">
          <Link
            to={permalink}
            className="text-inherit hover:no-underline after:absolute after:inset-0 after:z-10"
          >
            {title}
          </Link>
        </h3>
        <div className="flex-1"></div>
        <ScrollArea>
          <div className="flex min-h-px w-full min-w-0 items-center gap-1.5 relative z-20 ">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag.label}
                to={tag.permalink}
                className="text-[11px] font-semibold px-2 py-0.5 rounded border border-foreground/20 bg-muted no-underline text-foreground/50 transition-all hover:bg-accent text-nowrap"
              >
                #{tag.label}
              </Link>
            ))}

            {tags.length > 2 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded border border-foreground/20 bg-muted text-foreground/50">
                +{tags.length - 2}
              </span>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex flex-col">
          <div className="text-xs text-zinc-600 my-1 font-semibold">
            <span>{dateObject.toLocaleDateString("vi-VN")}</span>
            <span> • </span>
            <span>{readingTime.toFixed(0)} phút đọc</span>
          </div>
          <div className="max-h-48 sm:min-h-48 min-h-32 h-full bg-accent w-full rounded-md border border-md border-input/30 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-1 rounded-md w-full h-48 items-center justify-center text-zinc-600 text-xs font-semibold">
                No Thumbnail
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
