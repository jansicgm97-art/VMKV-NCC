import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Button } from "./button-B2R08Of-.js";
import { I as Input } from "./input-DD7rev21.js";
import { L as Label } from "./label-DwcCBX1v.js";
import { T as Textarea } from "./textarea-DPTcPPFi.js";
import { B as Badge } from "./badge-CNkGfYSq.js";
import { C as CalendarDays } from "./calendar-days-CWNwfTBi.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CSwKuDfi.js";
function LeavePage() {
  const {
    user,
    isSeniorOrAbove
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [type, setType] = reactExports.useState("Casual");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const load = async () => {
    const {
      data
    } = await supabase.from("leave_requests").select("*").order("created_at", {
      ascending: false
    });
    setItems(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("leave_requests").insert({
      cadet_user_id: user.id,
      leave_type: type,
      from_date: from,
      to_date: to,
      reason
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setReason("");
    setFrom("");
    setTo("");
    toast.success("Submitted");
    load();
  };
  const review = async (id, status) => {
    const {
      data: u
    } = await supabase.auth.getUser();
    await supabase.from("leave_requests").update({
      status,
      reviewed_by: u.user?.id,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-6 w-6 text-primary" }),
      " Leave / Permission"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: type, onChange: (e) => setType(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value), required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), required: true, maxLength: 500 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: "Submit request" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
            l.leave_type,
            " · ",
            l.from_date,
            " → ",
            l.to_date
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: l.reason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "outline", children: l.status })
      ] }),
      isSeniorOrAbove && l.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => review(l.id, "approved"), children: "Approve" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => review(l.id, "rejected"), children: "Reject" })
      ] })
    ] }, l.id)) })
  ] });
}
export {
  LeavePage as component
};
