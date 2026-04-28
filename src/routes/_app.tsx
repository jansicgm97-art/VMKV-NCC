import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserAvatar } from "@/components/app/UserAvatar";
import {
  Home,
  Megaphone,
  Image as ImageIcon,
  ClipboardCheck,
  MessagesSquare,
  User,
  ShieldCheck,
  BookOpen,
  CalendarDays,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/vmkv-ncc-logo.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/announcements", label: "Notices", icon: Megaphone },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/chat", label: "Chat", icon: MessagesSquare },
  { to: "/profile", label: "Me", icon: User },
] as const;

function AppShell() {
  const { user, loading, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  // Block sign-in if account isn't approved yet
  useEffect(() => {
    if (loading || !user || !profile) return;
    if (profile.approval_status && profile.approval_status !== "approved") {
      signOut().then(() => navigate({ to: "/" }));
    }
  }, [loading, user, profile, signOut, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <header className="sticky top-0 z-40 bg-sidebar text-sidebar-foreground shadow-elegant">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-10 w-auto object-contain" />
            <div className="leading-tight">
              <div className="font-bold text-base">VMKV NCC</div>
              <div className="text-[10px] tracking-widest opacity-80">
                VMKV CADETS
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-md bg-accent text-accent-foreground px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 hover:opacity-90"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
            <Link to="/profile">
              <UserAvatar
                url={profile?.photo_url}
                name={profile?.full_name}
                className="h-9 w-9"
              />
            </Link>
            <Button
              size="icon"
              variant="ghost"
              className="text-sidebar-foreground hover:bg-sidebar-accent h-9 w-9"
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-5">
        <Outlet />
      </main>

      <SecondaryRow />

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-elegant">
        <div className="mx-auto max-w-3xl grid grid-cols-5">
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SecondaryRow() {
  const items = [
    { to: "/library", label: "Library", icon: BookOpen },
    { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/leave", label: "Leave", icon: CalendarDays },
    { to: "/admission", label: "Admission", icon: FileText },
    { to: "/nominal-roll", label: "Roll", icon: FileText },
  ] as const;
  const location = useLocation();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-2">
      <div className="flex gap-2 overflow-x-auto py-1 -mx-1 px-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = location.pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-secondary",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}