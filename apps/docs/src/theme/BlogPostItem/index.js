import React, { useMemo } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemContainer from "@theme/BlogPostItem/Container";
import BlogPostItemHeader from "@theme/BlogPostItem/Header";
import BlogPostItemContent from "@theme/BlogPostItem/Content";
import BlogPostItemFooter from "@theme/BlogPostItem/Footer";
import Link from "@docusaurus/Link";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
      <HoverCardTrigger delay={0} closeDelay={10}>
        <Avatar>
          <AvatarImage src={author.imageURL} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-1 justify-start">
          <div className="flex flex-col gap-1">
            <Avatar className="size-12">
              <AvatarImage src={author.imageURL} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <Link
              to={author.page ? author.page.permalink : "#"}
              className="hover:no-underline text-foreground hover:text-primary"
            >
              <p className="text-base font-bold m-0 leading-tight">
                {author.name}
              </p>
            </Link>
            {author.title && (
              <p className="text-xs text-muted-foreground m-0 leading-normal">
                {author.title}
              </p>
            )}
          </div>
        </div>
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
  const avatarGroup = authors
    ?.slice(0, 2)
    .map((author, index) => <AuthorAvatar key={index} author={author} />);

  return (
    <Card className="relative group/card h-[404px] px-0 overflow-hidden">
      <CardHeader>
        <div className="flex flex-row items-center">
          <div className="relative z-20">
            <AvatarGroup>
              {avatarGroup}
              {authors && authors.length > 3 && (
                <AvatarGroupCount>+{authors.length - 3}</AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>
          <span className="ml-auto flex flex-row invisible group-hover/card:visible relative z-20">
            <Button
              variant="outline"
              className="min-w-0 truncate"
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
        <div className="flex flex-wrap gap-1.5 relative z-20">
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.label}
              to={tag.permalink}
              className="text-[11px] font-semibold px-2 py-0.5 rounded border border-foreground/20 bg-muted no-underline text-foreground/50 transition-all hover:bg-accent"
            >
              #{tag.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-zinc-600 my-1 font-semibold">
            <span>{dateObject.toLocaleDateString("vi-VN")}</span>
            <span> • </span>
            <span>{readingTime.toFixed(0)} phút đọc</span>
          </div>
          <div className="max-h-48 h-48 bg-accent w-full rounded-md border border-md border-input/30 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex rounded-md w-full h-full items-center justify-center text-zinc-600 text-xs font-semibold">
                No Thumbnail
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
