import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// ─── COPY BUTTON ─────────────────────────────────────────────────────────────
export default function CopyBtn({ value, className = "" }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`text-muted-foreground hover:text-foreground h-7 w-7 shrink-0 ${className}`}
      onClick={() => copyToClipboard(value)}
      title="Sao chép"
    >
      {isCopied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
