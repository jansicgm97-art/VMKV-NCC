import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Button } from "./button-B2R08Of-.js";
import { I as Input } from "./input-DD7rev21.js";
import { U as Users } from "./users-B3hT0aqJ.js";
import { T as Trash2 } from "./trash-2-CRUXg3Ku.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CSwKuDfi.js";
function NominalRoll() {
  const {
    isAdmin
  } = useAuth();
  const [rows, setRows] = reactExports.useState([]);
  const [v, setV] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  const load = async () => {
    const {
      data
    } = await supabase.from("nominal_roll").select("*").order("full_name");
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      data: u
    } = await supabase.auth.getUser();
    const {
      error
    } = await supabase.from("nominal_roll").insert({
      full_name: v.full_name,
      regimental_number: v.regimental_number || null,
      rank: v.rank || null,
      course: v.course || null,
      year_of_study: v.year_of_study || null,
      created_by: u.user?.id
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setV({});
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary" }),
      " Nominal Roll"
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: add, className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name", required: true, value: v.full_name ?? "", onChange: (e) => setV({
        ...v,
        full_name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Regt. No.", value: v.regimental_number ?? "", onChange: (e) => setV({
        ...v,
        regimental_number: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Rank", value: v.rank ?? "", onChange: (e) => setV({
        ...v,
        rank: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Course", value: v.course ?? "", onChange: (e) => setV({
        ...v,
        course: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Year", value: v.year_of_study ?? "", onChange: (e) => setV({
        ...v,
        year_of_study: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: "Add" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
            r.rank ? `${r.rank} ` : "",
            r.full_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: [r.regimental_number, r.course, r.year_of_study].filter(Boolean).join(" · ") })
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await supabase.from("nominal_roll").delete().eq("id", r.id);
          load();
        }, className: "text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, r.id)),
      rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "Roll is empty." })
    ] })
  ] });
}
export {
  NominalRoll as component
};
