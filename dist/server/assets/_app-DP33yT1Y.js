import { M as useRouter, r as reactExports, U as jsxRuntimeExports, _ as Outlet } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, a as useNavigate, L as Link, l as logo } from "./router-ANgPuP48.js";
import { U as UserAvatar } from "./UserAvatar-T8hiH7Ix.js";
import { c as createLucideIcon, a as cn } from "./index-CSwKuDfi.js";
import { B as Button } from "./button-B2R08Of-.js";
import { S as ShieldCheck } from "./shield-check-Dd3U_5iJ.js";
import { M as Megaphone } from "./megaphone-BboDYdKT.js";
import { I as Image } from "./image-BRiAKGEh.js";
import { M as MessagesSquare } from "./messages-square-EUrQTWjp.js";
import { B as BookOpen } from "./book-open-DVT2A5y1.js";
import { C as ClipboardCheck } from "./clipboard-check-Co7kfbCV.js";
import { C as CalendarDays } from "./calendar-days-CWNwfTBi.js";
import { F as FileText } from "./file-text-DQWsOYoo.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-BhpMngH6.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$2 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const NAV = [{
  to: "/dashboard",
  label: "Home",
  icon: House
}, {
  to: "/announcements",
  label: "Notices",
  icon: Megaphone
}, {
  to: "/gallery",
  label: "Gallery",
  icon: Image
}, {
  to: "/chat",
  label: "Chat",
  icon: MessagesSquare
}, {
  to: "/profile",
  label: "Me",
  icon: User
}];
function AppShell() {
  const {
    user,
    loading,
    profile,
    isAdmin,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/"
    });
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    if (loading || !user || !profile) return;
    if (!isAdmin && profile.approval_status && profile.approval_status !== "approved") {
      signOut().then(() => navigate({
        to: "/"
      }));
    }
  }, [loading, user, profile, isAdmin, signOut, navigate]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse text-muted-foreground", children: "Loading…" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-sidebar text-sidebar-foreground shadow-elegant", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl flex items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", className: "h-10 w-auto object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-base", children: "VMKV NCC" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] tracking-widest opacity-80", children: "VMKV CADETS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "rounded-md bg-accent text-accent-foreground px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
          " Admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: profile?.photo_url, name: profile?.full_name, className: "h-9 w-9" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-sidebar-foreground hover:bg-sidebar-accent h-9 w-9", onClick: async () => {
          await signOut();
          navigate({
            to: "/"
          });
        }, "aria-label": "Sign out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 mx-auto w-full max-w-3xl px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecondaryRow, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-elegant", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl grid grid-cols-5", children: NAV.map((n) => {
      const active = location.pathname.startsWith(n.to);
      const Icon = n.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: cn("flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors", active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
        n.label
      ] }, n.to);
    }) }) })
  ] });
}
function SecondaryRow() {
  const items = [{
    to: "/library",
    label: "Library",
    icon: BookOpen
  }, {
    to: "/attendance",
    label: "Attendance",
    icon: ClipboardCheck
  }, {
    to: "/leave",
    label: "Leave",
    icon: CalendarDays
  }, {
    to: "/admission",
    label: "Admission",
    icon: FileText
  }, {
    to: "/nominal-roll",
    label: "Roll",
    icon: FileText
  }];
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-3xl px-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto py-1 -mx-1 px-1", children: items.map((it) => {
    const Icon = it.icon;
    const active = location.pathname.startsWith(it.to);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: it.to, className: cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors", active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-secondary"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      it.label
    ] }, it.to);
  }) }) });
}
export {
  AppShell as component
};
