import { cn } from "@/lib/utils";

export default function AboutHighlight({ text, className }) {
    return (
        <span className={cn("relative px-1 py-2 mx-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-2 before:bg-green-500", className)}>
            <span className="relative text-white">
                {text}
            </span>
        </span>
    );
}