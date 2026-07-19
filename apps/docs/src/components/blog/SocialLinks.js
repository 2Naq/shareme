import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  GitHubIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
  InstagramIcon,
  EmailIcon,
  WebsiteIcon,
  ZaloIcon,
} from "../icons/";

/**
 * Social platform configurations with custom SVG React icons
 */
const SOCIAL_PLATFORMS = {
  github: { label: "GitHub", icon: GitHubIcon },
  x: { label: "X", icon: XIcon },
  twitter: { label: "Twitter", icon: XIcon },
  linkedin: { label: "LinkedIn", icon: LinkedinIcon },
  instagram: { label: "Instagram", icon: InstagramIcon },
  youtube: { label: "YouTube", icon: YoutubeIcon },
  email: { label: "Email", icon: EmailIcon },
  newsletter: { label: "Website", icon: WebsiteIcon },
  zalo: { label: "Zalo", icon: ZaloIcon },
};

function getSocialConfig(platform) {
  return SOCIAL_PLATFORMS[platform] || { label: platform, icon: null };
}

function getSocialUrl(platform, value) {
  if (!value) return "";
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:")
  ) {
    return value;
  }
  switch (platform) {
    case "github":
      return `https://github.com/${value}`;
    case "linkedin":
      return `https://linkedin.com/in/${value}`;
    case "x":
    case "twitter":
      return `https://x.com/${value}`;
    case "zalo":
      return `https://zalo.me/${value}`;
    case "youtube":
      return `https://youtube.com/@${value}`;
    case "instagram":
      return `https://instagram.com/${value}`;
    default:
      return `https://${value}`;
  }
}

/**
 * SocialLinks — Hiển thị danh sách social links của 1 tác giả
 * @param {{ socials: Record<string, string> }} props
 */
export default function SocialLinks({ socials }) {
  if (!socials) return null;
  const entries = Object.entries(socials);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([platform, value]) => {
        const { label, icon: IconComponent } = getSocialConfig(platform);
        const link = getSocialUrl(platform, value);
        return (
          <Badge
            key={platform}
            variant="outline"
            render={
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline inline-flex items-center gap-1 px-1.5 py-0.5"
                title={label}
              >
                {IconComponent ? (
                  <IconComponent className="size-3.5" />
                ) : (
                  <span className="text-xs">🔗</span>
                )}
                <span>{label}</span>
              </a>
            }
          />
        );
      })}
    </div>
  );
}
