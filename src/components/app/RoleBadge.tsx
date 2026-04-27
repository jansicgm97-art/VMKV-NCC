import { Badge } from "@/components/ui/badge";
import type { AppRole } from "@/lib/auth-context";

const LABELS: Record<AppRole, string> = {
  ano: "ANO",
  main_senior: "Main Senior",
  senior: "Senior",
  cadet: "Cadet",
};

export function RoleBadge({ role }: { role: AppRole }) {
  const variant =
    role === "ano"
      ? "bg-accent text-accent-foreground"
      : role === "main_senior"
        ? "bg-primary text-primary-foreground"
        : role === "senior"
          ? "bg-secondary text-secondary-foreground border border-primary/30"
          : "bg-muted text-muted-foreground";
  return <Badge className={variant}>{LABELS[role]}</Badge>;
}