import React, { useMemo } from "react";
import Link from "@docusaurus/Link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SocialLinks from "@/components/blog/SocialLinks";

/**
 * AuthorCard — Card hiển thị thông tin 1 tác giả
 * @param {object} props
 * @param {object} props.author - Docusaurus AuthorItemProp
 * @param {number} [props.count] - Số bài viết (nếu có)
 * @param {'compact'|'default'|'large'} [props.variant='default'] - Kích cỡ hiển thị
 */
export default function AuthorCard({ author, count, variant = "default" }) {
  const { name, title, imageURL, email, page, socials, description } = author;
  const link =
    page?.permalink || author.url || (email && `mailto:${email}`) || undefined;

  const initials = useMemo(() => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const avatarSize =
    variant === "large"
      ? "size-20"
      : variant === "compact"
        ? "size-10"
        : "size-14";

  return (
    <Card className="transition-all duration-200 hover:shadow-sm">
      <CardHeader>
        <div
          className={`flex ${variant === "large" ? "flex-col items-center gap-4" : "flex-col items-center gap-3"}`}
        >
          {/* Avatar */}
          {link ? (
            <Link to={link} className="no-underline">
              <Avatar className={avatarSize}>
                <AvatarImage src={imageURL} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar className={avatarSize}>
              <AvatarImage src={imageURL} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}

          {/* Name + Count */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <CardTitle
                className={variant === "large" ? "text-xl" : "text-base"}
              >
                {link ? (
                  <Link
                    to={link}
                    className="text-inherit hover:text-primary no-underline transition-colors"
                  >
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </CardTitle>
              {count !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {count} bài
                </Badge>
              )}
            </div>

            {/* Title */}
            {title && (
              <CardDescription className="text-center text-xs">
                {title}
              </CardDescription>
            )}

            {/* Description (variant large) */}
            {variant === "large" && description && (
              <p className="text-sm text-muted-foreground text-center m-0 mt-1 max-w-md">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Social Links */}
      {socials && Object.keys(socials).length > 0 && (
        <CardContent className="flex justify-center">
          <SocialLinks socials={socials} />
        </CardContent>
      )}
    </Card>
  );
}
