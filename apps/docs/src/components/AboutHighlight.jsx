import React from "react";
import { cn } from "@/lib/utils";

const COLOR_MAP = {
  green: "before:bg-green-500",
  blue: "before:bg-blue-500",
  red: "before:bg-red-500",
  yellow: "before:bg-yellow-500",
  orange: "before:bg-orange-500",
  purple: "before:bg-purple-500",
  pink: "before:bg-pink-500",
  indigo: "before:bg-indigo-500",
  sky: "before:bg-sky-500",
};

export default function AboutHighlight({ text, className, color = "green" }) {
  const bgClass = COLOR_MAP[color] || COLOR_MAP.green;

  return (
    <span
      className={cn(
        "relative px-1.5 py-0.5 mx-1 inline before:absolute before:inset-0 before:block before:-skew-y-2 before:rounded",
        bgClass,
        className,
      )}
    >
      <span className="relative z-10 text-white font-medium">{text}</span>
    </span>
  );
}
