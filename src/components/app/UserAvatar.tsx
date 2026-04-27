import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  url,
  name,
  className,
}: {
  url?: string | null;
  name?: string | null;
  className?: string;
}) {
  const initials = (name ?? "C")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  return (
    <Avatar className={cn("ring-2 ring-primary/20", className)}>
      {url ? <AvatarImage src={url} alt={name ?? "User"} /> : null}
      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
        {initials || "C"}
      </AvatarFallback>
    </Avatar>
  );
}