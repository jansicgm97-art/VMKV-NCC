import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/app/RoleBadge";
import { UserAvatar } from "@/components/app/UserAvatar";
import {
  Megaphone,
  Image as ImageIcon,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  FileText,
  Users,
  MessagesSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — VMKV NCC" }] }),
});

const TILES = [
  { to: "/announcements", label: "Announcements", icon: Megaphone, color: "from-primary to-primary-glow" },
  { to: "/gallery", label: "Gallery", icon: ImageIcon, color: "from-accent to-accent" },
  { to: "/library", label: "Library", icon: BookOpen, color: "from-primary to-primary-glow" },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck, color: "from-accent to-accent" },
  { to: "/leave", label: "Leave", icon: CalendarDays, color: "from-primary to-primary-glow" },
  { to: "/admission", label: "Admission", icon: FileText, color: "from-accent to-accent" },
  { to: "/nominal-roll", label: "Nominal Roll", icon: Users, color: "from-primary to-primary-glow" },
  { to: "/chat", label: "Chat", icon: MessagesSquare, color: "from-accent to-accent" },
] as const;

function Dashboard() {
  const { profile, roles } = useAuth();
  const [latest, setLatest] = useState<
    { id: string; title: string; body: string; category: string; created_at: string }[]
  >([]);
  const [stats, setStats] = useState({ cadets: 0, announcements: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id,title,body,category,created_at")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);
      setLatest(data ?? []);
      const { count: c } = await supabase
        .from("user_roles")
        .select("*", { head: true, count: "exact" })
        .eq("role", "cadet");
      const { count: a } = await supabase
        .from("announcements")
        .select("*", { head: true, count: "exact" });
      setStats({ cadets: c ?? 0, announcements: a ?? 0 });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-primary text-primary-foreground p-5 shadow-elegant border-0">
        <div className="flex items-center gap-4">
          <UserAvatar
            url={profile?.photo_url}
            name={profile?.full_name}
            className="h-16 w-16 ring-accent/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs opacity-80 tracking-widest">JAI HIND, CADET</p>
            <h1 className="text-xl font-bold truncate">
              {profile?.full_name || "Welcome"}
            </h1>
            <div className="flex flex-wrap gap-1 mt-1">
              {roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md bg-primary-foreground/10 p-2">
            <div className="text-2xl font-bold">{stats.cadets}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-80">Cadets</div>
          </div>
          <div className="rounded-md bg-primary-foreground/10 p-2">
            <div className="text-2xl font-bold">{stats.announcements}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-80">Notices</div>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick access
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex flex-col items-center gap-2 rounded-xl bg-card p-3 border border-border hover:shadow-elegant transition-all"
            >
              <div className={`rounded-lg bg-gradient-to-br ${t.color} p-2.5 text-primary-foreground group-hover:scale-110 transition-transform`}>
                <t.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-center font-medium leading-tight">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Latest notices
          </h2>
          <Link to="/announcements" className="text-xs text-primary font-medium">
            See all →
          </Link>
        </div>
        {latest.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground">No announcements yet.</Card>
        ) : (
          <div className="space-y-2">
            {latest.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {a.category}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.body}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}