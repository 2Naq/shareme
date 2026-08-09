import React, { useMemo } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
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
      <HoverCardContent className="border-none bg-transparent shadow-none ring-0">
        <AuthorCard author={author} count={author.count} variant="compact" />
      </HoverCardContent>
    </HoverCard>
  );
});

function getThumbnailUrl(assetsImage, frontMatterImage) {
  let img = assetsImage || frontMatterImage;
  if (!img) return null;
  if (typeof img === "object" && img.default) {
    img = img.default;
  }
  if (typeof img !== "string") return null;
  return img;
}

export default function BlogPostItem({ children, className }) {
  const { metadata, isBlogPostPage } = useBlogPost();
  const {
    frontMatter,
    title,
    readingTime,
    date,
    authors,
    tags,
    permalink,
    assets,
  } = metadata;

  const rawThumbnail = getThumbnailUrl(assets?.image, frontMatter?.image);
  const thumbnail = useBaseUrl(rawThumbnail);
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
      className="group/card relative h-101 overflow-hidden px-0"
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
          <span className="invisible relative z-20 ml-auto flex flex-row group-hover/card:visible">
            <Button
              variant="outline"
              className="min-w-0 truncate"
              nativeButton={false}
              render={
                <Link
                  className="hover:text-foreground/60 text-foreground/50 no-underline"
                  to={permalink}
                >
                  Đọc thêm
                </Link>
              }
            />
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-1">
        <h3 className="m-0 line-clamp-3">
          <Link
            to={permalink}
            className="text-inherit after:absolute after:inset-0 after:z-10 hover:no-underline"
          >
            {title}
          </Link>
        </h3>
        <div className="flex-1"></div>
        <ScrollArea>
          <div className="relative z-20 flex min-h-px w-full min-w-0 items-center gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag.label}
                to={tag.permalink}
                className="border-foreground/20 bg-muted text-foreground/50 hover:bg-accent rounded border px-2 py-0.5 text-[11px] font-semibold text-nowrap no-underline transition-all"
              >
                #{tag.label}
              </Link>
            ))}

            {tags.length > 2 && (
              <span className="border-foreground/20 bg-muted text-foreground/50 rounded border px-2 py-0.5 text-[11px] font-semibold">
                +{tags.length - 2}
              </span>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex flex-col">
          <div className="my-1 text-xs font-semibold text-zinc-600">
            <span>{dateObject.toLocaleDateString("vi-VN")}</span>
            <span> • </span>
            <span>{readingTime.toFixed(0)} phút đọc</span>
          </div>
          <div className="bg-accent border-md border-input/30 h-full max-h-48 min-h-32 w-full overflow-hidden rounded-md border sm:min-h-48">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-48 w-full flex-1 items-center justify-center rounded-md text-xs font-semibold text-zinc-600">
                No Thumbnail
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
