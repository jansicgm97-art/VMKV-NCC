import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, L as Link } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Badge } from "./badge-CNkGfYSq.js";
import { R as RoleBadge } from "./RoleBadge-DwZrghCU.js";
import { U as UserAvatar } from "./UserAvatar-T8hiH7Ix.js";
import { M as Megaphone } from "./megaphone-BboDYdKT.js";
import { I as Image } from "./image-BRiAKGEh.js";
import { B as BookOpen } from "./book-open-DVT2A5y1.js";
import { C as ClipboardCheck } from "./clipboard-check-Co7kfbCV.js";
import { C as CalendarDays } from "./calendar-days-CWNwfTBi.js";
import { F as FileText } from "./file-text-DQWsOYoo.js";
import { U as Users } from "./users-B3hT0aqJ.js";
import { M as MessagesSquare } from "./messages-square-EUrQTWjp.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BvpCnn6o.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CSwKuDfi.js";
import "./index-BhpMngH6.js";
import "./en-US-BJPbq_wX.js";
const TILES = [{
  to: "/announcements",
  label: "Announcements",
  icon: Megaphone,
  color: "from-primary to-primary-glow"
}, {
  to: "/gallery",
  label: "Gallery",
  icon: Image,
  color: "from-accent to-accent"
}, {
  to: "/library",
  label: "Library",
  icon: BookOpen,
  color: "from-primary to-primary-glow"
}, {
  to: "/attendance",
  label: "Attendance",
  icon: ClipboardCheck,
  color: "from-accent to-accent"
}, {
  to: "/leave",
  label: "Leave",
  icon: CalendarDays,
  color: "from-primary to-primary-glow"
}, {
  to: "/admission",
  label: "Admission",
  icon: FileText,
  color: "from-accent to-accent"
}, {
  to: "/nominal-roll",
  label: "Nominal Roll",
  icon: Users,
  color: "from-primary to-primary-glow"
}, {
  to: "/chat",
  label: "Chat",
  icon: MessagesSquare,
  color: "from-accent to-accent"
}];
function Dashboard() {
  const {
    profile,
    roles
  } = useAuth();
  const [latest, setLatest] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({
    cadets: 0,
    announcements: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("announcements").select("id,title,body,category,created_at").order("pinned", {
        ascending: false
      }).order("created_at", {
        ascending: false
      }).limit(3);
      setLatest(data ?? []);
      const {
        count: c
      } = await supabase.from("user_roles").select("*", {
        head: true,
        count: "exact"
      }).eq("role", "cadet");
      const {
        count: a
      } = await supabase.from("announcements").select("*", {
        head: true,
        count: "exact"
      });
      setStats({
        cadets: c ?? 0,
        announcements: a ?? 0
      });
    })();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden bg-gradient-primary text-primary-foreground p-5 shadow-elegant border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: profile?.photo_url, name: profile?.full_name, className: "h-16 w-16 ring-accent/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-80 tracking-widest", children: "JAI HIND, CADET" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold truncate", children: profile?.full_name || "Welcome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }, r)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-primary-foreground/10 p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: stats.cadets }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider opacity-80", children: "Cadets" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-primary-foreground/10 p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: stats.announcements }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider opacity-80", children: "Notices" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Quick access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: TILES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: "group flex flex-col items-center gap-2 rounded-xl bg-card p-3 border border-border hover:shadow-elegant transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg bg-gradient-to-br ${t.color} p-2.5 text-primary-foreground group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-center font-medium leading-tight", children: t.label })
      ] }, t.to)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Latest notices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/announcements", className: "text-xs text-primary font-medium", children: "See all →" })
      ] }),
      latest.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 text-sm text-muted-foreground", children: "No announcements yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: latest.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize text-[10px]", children: a.category })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: a.body }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-muted-foreground", children: formatDistanceToNow(new Date(a.created_at), {
          addSuffix: true
        }) })
      ] }, a.id)) })
    ] })
  ] });
}
export {
  Dashboard as component
};
