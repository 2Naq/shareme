import CopyBtn from "@/components/btnCoppy";
import { Badge } from "@/components/ui/badge";

// ─── RESULT ROW ──────────────────────────────────────────────────────────────
export default function ResultRow({
  label,
  value,
  mono = true,
  badge = false,
}) {
  if (!value && value !== 0) return null;
  const display = String(value);
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {badge ? (
          <Badge variant="outline" className="font-mono text-xs px-2">
            {display}
          </Badge>
        ) : (
          <span className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}>
            {display}
          </span>
        )}
        <CopyBtn value={display} />
      </div>
    </div>
  );
}
