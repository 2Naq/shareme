import { cn } from "@/lib/utils";

export default function Separator({ className }) {
  return (
    <div
      className={cn(
        "relative isolate flex h-8 w-full border-edge separator-pattern",
        "before:absolute before:content-[''] before:left-[-100vw] before:z-[-1] before:h-8 before:w-[200vw] before:border-y before:border-edge",
        className,
      )}
    />
  );
}
