import { cn } from "@/lib/utils";

export default function AboutHighlight({ text, className }) {
  return (
    <span
      className={cn(
        "_before:bg-green-500 relative mx-2 inline-block px-1 py-2 before:absolute before:-inset-1 before:block before:-skew-y-2",
        "before:bg-linear-to-r before:from-blue-700 before:via-blue-500 before:to-blue-400 before:dark:from-blue-400 before:dark:via-blue-300 before:dark:to-sky-300",
        // "animate-pulse",
        className,
      )}
    >
      <span className="shimmer relative pr-px text-white">{text}</span>
    </span>
  );
}
