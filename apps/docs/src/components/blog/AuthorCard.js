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

export default function AuthorCard({ author, count, variant = "default" }) {
  const { name, title, imageURL, email, page, socials, description, isPro } =
    author;
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
              {AuthorAvt({ imageURL, name, initials, avatarSize, isPro })}
            </Link>
          ) : (
            AuthorAvt({ imageURL, name, initials, avatarSize, isPro })
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

function AuthorAvt({
  imageURL,
  name,
  initials,
  avatarSize,
  isPro,
  isShowPro = true,
}) {
  const avatarEl = (
    <Avatar className={avatarSize}>
      <AvatarImage src={imageURL} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
  if (isShowPro && isPro) {
    return (
      <div
        className="rounded-full p-[2.5px] flex items-center justify-center transition-all duration-300 _hover:scale-105 z-10"
        style={{
          background:
            "conic-gradient(from -45deg, #ea4335 0deg 90deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc04 270deg 360deg)",
        }}
      >
        <div className="rounded-full bg-card p-0.5 flex items-center justify-center">
          {avatarEl}
        </div>
      </div>
    );
  }

  return avatarEl;
}

export { AuthorAvt };
