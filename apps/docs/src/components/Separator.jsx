import { cn } from "@/lib/utils";

export default function Separator({ className }) {
  return (
    <div
      className={cn(
        "border-edge separator-pattern relative isolate flex h-8 w-full",
        "before:border-edge before:absolute before:left-[-100vw] before:z-[-1] before:h-8 before:w-[200vw] before:border-y before:content-['']",
        className,
      )}
    />
  );
}
