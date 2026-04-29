import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Button } from "./button-B2R08Of-.js";
import { U as UserAvatar } from "./UserAvatar-T8hiH7Ix.js";
import { f as format } from "./format-ma9Y_NEl.js";
import { C as ClipboardCheck } from "./clipboard-check-Co7kfbCV.js";
import { C as Check } from "./check-DMGMA8l8.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-BhpMngH6.js";
import "./en-US-BJPbq_wX.js";
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function Attendance() {
  const {
    isSeniorOrAbove
  } = useAuth();
  const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
  const [cadets, setCadets] = reactExports.useState([]);
  const [marks, setMarks] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: rs
      } = await supabase.from("user_roles").select("user_id").eq("role", "cadet");
      const ids = (rs ?? []).map((r) => r.user_id);
      if (ids.length === 0) {
        setCadets([]);
        return;
      }
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name, photo_url").in("id", ids);
      setCadets(profs ?? []);
      const {
        data: today2
      } = await supabase.from("attendance").select("cadet_user_id, status").eq("attendance_date", format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
      const m = {};
      (today2 ?? []).forEach((t) => {
        m[t.cadet_user_id] = t.status;
      });
      setMarks(m);
    })();
  }, []);
  const mark = async (uid, status) => {
    if (!isSeniorOrAbove) return;
    setBusy(true);
    setMarks((m) => ({
      ...m,
      [uid]: status
    }));
    const {
      data: u
    } = await supabase.auth.getUser();
    const {
      error
    } = await supabase.from("attendance").upsert({
      cadet_user_id: uid,
      attendance_date: today,
      status,
      marked_by: u.user?.id
    }, {
      onConflict: "cadet_user_id,attendance_date"
    });
    setBusy(false);
    if (error) toast.error(error.message);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-6 w-6 text-primary" }),
      " Attendance"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: format(/* @__PURE__ */ new Date(), "EEEE, dd MMM yyyy") }),
    !isSeniorOrAbove && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3 text-xs text-muted-foreground", children: "View-only. Only seniors can mark." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      cadets.map((c) => {
        const s = marks[c.id];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: c.photo_url, name: c.full_name, className: "h-10 w-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: c.full_name || "Cadet" }),
            s && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: s })
          ] }),
          isSeniorOrAbove && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: s === "present" ? "default" : "outline", disabled: busy, onClick: () => mark(c.id, "present"), "aria-label": "Present", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: s === "absent" ? "destructive" : "outline", disabled: busy, onClick: () => mark(c.id, "absent"), "aria-label": "Absent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] })
        ] }, c.id);
      }),
      cadets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No cadets yet." })
    ] })
  ] });
}
export {
  Attendance as component
};
