import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, a as useNavigate, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Button } from "./button-B2R08Of-.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CmNjcURl.js";
import { B as Badge } from "./badge-CNkGfYSq.js";
import { U as UserAvatar } from "./UserAvatar-T8hiH7Ix.js";
import { R as RoleBadge } from "./RoleBadge-DwZrghCU.js";
import { S as ShieldCheck } from "./shield-check-Dd3U_5iJ.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-D3rFzNQH.js";
import "./index-BhpMngH6.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode);
function Admin() {
  const {
    isAdmin,
    isAno,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = reactExports.useState([]);
  const [users, setUsers] = reactExports.useState([]);
  const [rolesByUser, setRolesByUser] = reactExports.useState({});
  const [pendingAccounts, setPendingAccounts] = reactExports.useState([]);
  const [rejectedAccounts, setRejectedAccounts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!loading && !isAdmin) navigate({
      to: "/dashboard"
    });
  }, [isAdmin, loading, navigate]);
  const load = async () => {
    const {
      data: ad
    } = await supabase.from("admissions").select("id, full_name, photo_url, user_id, created_at").eq("status", "pending").order("created_at", {
      ascending: false
    });
    setPending(ad ?? []);
    const {
      data: us
    } = await supabase.from("profiles").select("id, full_name, photo_url, email").eq("approval_status", "approved").order("full_name");
    setUsers(us ?? []);
    const {
      data: rs
    } = await supabase.from("user_roles").select("user_id, role");
    const map = {};
    (rs ?? []).forEach((r) => {
      map[r.user_id] = [...map[r.user_id] ?? [], r.role];
    });
    setRolesByUser(map);
    const {
      data: pa
    } = await supabase.from("profiles").select("id, full_name, email, photo_url, created_at").eq("approval_status", "pending").order("created_at", {
      ascending: false
    });
    setPendingAccounts(pa ?? []);
    const {
      data: ra
    } = await supabase.from("profiles").select("id, full_name, email, photo_url, created_at, approval_reviewed_at").eq("approval_status", "rejected").order("created_at", {
      ascending: false
    });
    setRejectedAccounts(ra ?? []);
  };
  reactExports.useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);
  const review = async (id, status) => {
    const {
      data: u
    } = await supabase.auth.getUser();
    await supabase.from("admissions").update({
      status,
      reviewed_by: u.user?.id,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    toast.success(status);
    load();
  };
  const assignRole = async (uid, role) => {
    if (role === "main_senior" && !isAno) return toast.error("Only ANO can assign Main Senior");
    const {
      data: u
    } = await supabase.auth.getUser();
    const {
      error
    } = await supabase.from("user_roles").insert({
      user_id: uid,
      role,
      assigned_by: u.user?.id
    });
    if (error) return toast.error(error.message);
    toast.success("Role assigned");
    load();
  };
  const removeRole = async (uid, role) => {
    if (role === "main_senior" && !isAno) return toast.error("Only ANO can remove Main Senior");
    if (role === "ano") return toast.error("ANO role cannot be removed here");
    const {
      error
    } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    if (error) return toast.error(error.message);
    load();
  };
  const removeCadet = async (uid) => {
    if (!confirm("Remove this cadet's roles?")) return;
    await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "cadet");
    load();
  };
  const reviewAccount = async (uid, status) => {
    const {
      data: u
    } = await supabase.auth.getUser();
    const {
      error
    } = await supabase.from("profiles").update({
      approval_status: status,
      approval_reviewed_by: u.user?.id,
      approval_reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", uid);
    if (error) return toast.error(error.message);
    toast.success(`Account ${status}`);
    load();
  };
  if (!isAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-accent" }),
      " Admin Panel",
      isAno && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent text-accent-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 mr-1" }),
        "ANO"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "approvals", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "accounts", children: [
          "Accounts (",
          pendingAccounts.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "rejected", children: [
          "Rejected (",
          rejectedAccounts.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "approvals", children: [
          "Admissions (",
          pending.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "users", children: [
          "Users (",
          users.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "accounts", className: "space-y-2 pt-3", children: [
        pendingAccounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No accounts awaiting approval." }),
        pendingAccounts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: p.photo_url, name: p.full_name, className: "h-12 w-12" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: p.full_name || "Unnamed cadet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: p.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              "Signed up ",
              new Date(p.created_at).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => reviewAccount(p.id, "approved"), children: "Approve" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => reviewAccount(p.id, "rejected"), children: "Reject" })
        ] }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "rejected", className: "space-y-2 pt-3", children: [
        rejectedAccounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No rejected accounts." }),
        rejectedAccounts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: p.photo_url, name: p.full_name, className: "h-12 w-12" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: p.full_name || "Unnamed cadet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: p.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              "Signed up ",
              new Date(p.created_at).toLocaleDateString()
            ] }),
            p.approval_reviewed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-red-600", children: [
              "Rejected ",
              new Date(p.approval_reviewed_at).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => reviewAccount(p.id, "approved"), children: "Re-approve" })
        ] }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "approvals", className: "space-y-2 pt-3", children: [
        pending.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No pending admissions." }),
        pending.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.photo_url, alt: "", className: "h-12 w-12 rounded object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: p.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(p.created_at).toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => review(p.id, "approved"), children: "Approve" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => review(p.id, "rejected"), children: "Reject" })
        ] }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", className: "space-y-2 pt-3", children: users.map((u) => {
        const rs = rolesByUser[u.id] ?? [];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: u.photo_url, name: u.full_name, className: "h-10 w-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: u.full_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: u.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: rs.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeRole(u.id, r), title: "Click to remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }) }, r)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeCadet(u.id), className: "text-destructive", "aria-label": "Remove cadet", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
            !rs.includes("senior") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => assignRole(u.id, "senior"), children: "+ Senior" }),
            isAno && !rs.includes("main_senior") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => assignRole(u.id, "main_senior"), children: "+ Main Senior" }),
            isAno && !rs.includes("ano") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => assignRole(u.id, "ano"), children: "+ ANO" }),
            !rs.includes("cadet") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => assignRole(u.id, "cadet"), children: "+ Cadet" })
          ] })
        ] }, u.id);
      }) })
    ] })
  ] });
}
export {
  Admin as component
};
