import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { I as Input } from "./input-DD7rev21.js";
import { L as Label } from "./label-DwcCBX1v.js";
import { c as compressToSquareJpeg } from "./image-utils-C3htUm6p.js";
import { I as Image } from "./image-BRiAKGEh.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import { T as Trash2 } from "./trash-2-CRUXg3Ku.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function Gallery() {
  const {
    isAdmin
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const [caption, setCaption] = reactExports.useState("");
  const fileRef = reactExports.useRef(null);
  const load = async () => {
    const {
      data
    } = await supabase.from("gallery_items").select("id,image_url,caption,title").order("created_at", {
      ascending: false
    });
    setItems(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const upload = async (file) => {
    setBusy(true);
    try {
      const blob = await compressToSquareJpeg(file, 1200, 0.85);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const {
        error: upErr
      } = await supabase.storage.from("gallery").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("gallery").getPublicUrl(path);
      const {
        data: u
      } = await supabase.auth.getUser();
      const {
        error: insErr
      } = await supabase.from("gallery_items").insert({
        image_url: publicUrl,
        caption: caption || null,
        uploaded_by: u.user?.id
      });
      if (insErr) throw insErr;
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Uploaded");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (it) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery_items").delete().eq("id", it.id);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6 text-primary" }),
      " Gallery"
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Upload photo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Caption (optional)", value: caption, onChange: (e) => setCaption(e.target.value), maxLength: 200 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", disabled: busy, onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) upload(f);
      }, className: "block w-full text-sm" }),
      busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "inline h-3 w-3 mr-1" }),
        "Uploading…"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: [
      items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-lg overflow-hidden bg-muted aspect-square", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.image_url, alt: it.caption ?? "", className: "h-full w-full object-cover", loading: "lazy" }),
        it.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2", children: it.caption }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(it), className: "absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-md p-1 opacity-0 group-hover:opacity-100 transition", "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] }, it.id)),
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "col-span-full p-6 text-center text-sm text-muted-foreground", children: "No photos yet." })
    ] })
  ] });
}
export {
  Gallery as component
};
