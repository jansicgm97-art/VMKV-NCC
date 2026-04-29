import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { I as Input } from "./input-DD7rev21.js";
import { L as Label } from "./label-DwcCBX1v.js";
import { B as BookOpen } from "./book-open-DVT2A5y1.js";
import { F as FileText } from "./file-text-DQWsOYoo.js";
import { T as Trash2 } from "./trash-2-CRUXg3Ku.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CSwKuDfi.js";
function Library() {
  const {
    isAdmin
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [title, setTitle] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const load = async () => {
    const {
      data
    } = await supabase.from("library_items").select("*").order("created_at", {
      ascending: false
    });
    setItems(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const upload = async (file) => {
    if (!title.trim()) return toast.error("Add a title first");
    setBusy(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${Date.now()}-${safe}`;
      const {
        error
      } = await supabase.storage.from("library").upload(path, file, {
        upsert: false
      });
      if (error) throw error;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("library").getPublicUrl(path);
      const {
        data: u
      } = await supabase.auth.getUser();
      const {
        error: e2
      } = await supabase.from("library_items").insert({
        title,
        category: category || null,
        file_url: publicUrl,
        uploaded_by: u.user?.id
      });
      if (e2) throw e2;
      setTitle("");
      setCategory("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Uploaded");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-primary" }),
      " Library"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Reports, magazines, yearbooks (PDF)." }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 200 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: category, onChange: (e) => setCategory(e.target.value), placeholder: "Yearbook / Report" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "application/pdf", disabled: busy, onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) upload(f);
      }, className: "block w-full text-sm" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-primary/10 p-2 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: it.title }),
          it.category && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: it.category })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: it.file_url, target: "_blank", rel: "noreferrer", className: "text-xs text-primary font-medium", children: "Open" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await supabase.from("library_items").delete().eq("id", it.id);
          load();
        }, className: "text-destructive", "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, it.id)),
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No documents yet." })
    ] })
  ] });
}
export {
  Library as component
};
