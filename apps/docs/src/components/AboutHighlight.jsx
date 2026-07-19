import React from "react";
import { cn } from "@/lib/utils";

export default function AboutHighlight({ text, className, color = "green" }) {
  return (
    <span
      className={cn(
        "relative px-1.5 py-0.5 mx-1 inline before:absolute before:inset-0 before:block before:-skew-y-2 before:rounded",
        `before:bg-${color}-500`,
        className,
      )}
    >
      <span className="relative z-10 text-white font-medium">{text}</span>
    </span>
  );
}
