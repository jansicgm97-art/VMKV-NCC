import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase } from "./router-ANgPuP48.js";
import { I as Input } from "./input-DD7rev21.js";
import { B as Button } from "./button-B2R08Of-.js";
import { U as UserAvatar } from "./UserAvatar-T8hiH7Ix.js";
import { f as format } from "./format-ma9Y_NEl.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-BhpMngH6.js";
import "./en-US-BJPbq_wX.js";
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function Chat() {
  const {
    user
  } = useAuth();
  const [msgs, setMsgs] = reactExports.useState([]);
  const [profiles, setProfiles] = reactExports.useState({});
  const [text, setText] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const loadProfiles = async (ids) => {
    if (ids.length === 0) return;
    const {
      data
    } = await supabase.from("profiles").select("id, full_name, photo_url").in("id", ids);
    const map = {};
    (data ?? []).forEach((p) => map[p.id] = p);
    setProfiles((prev) => ({
      ...prev,
      ...map
    }));
  };
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("chat_messages").select("*").order("created_at", {
        ascending: true
      }).limit(200);
      const arr = data ?? [];
      setMsgs(arr);
      await loadProfiles(Array.from(new Set(arr.map((m) => m.user_id))));
    })();
    const ch = supabase.channel("chat").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "chat_messages"
    }, (payload) => {
      const m = payload.new;
      setMsgs((prev) => [...prev, m]);
      if (!profiles[m.user_id]) loadProfiles([m.user_id]);
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  reactExports.useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [msgs.length]);
  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !user) return;
    setText("");
    const {
      error
    } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      body
    });
    if (error) setText(body);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-220px)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-3 pr-1", children: [
      msgs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground mt-10", children: "Start the conversation, cadet." }),
      msgs.map((m) => {
        const me = m.user_id === user?.id;
        const p = profiles[m.user_id];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2 ${me ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { url: p?.photo_url, name: p?.full_name ?? "Cadet", className: "h-8 w-8 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] ${me ? "items-end" : ""} flex flex-col`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground px-1", children: [
              p?.full_name ?? "Cadet",
              " · ",
              format(new Date(m.created_at), "p")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-2xl px-3 py-2 text-sm ${me ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`, children: m.body })
          ] })
        ] }, m.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: send, className: "flex gap-2 mt-3 pt-3 border-t", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: text, onChange: (e) => setText(e.target.value), placeholder: "Message…", maxLength: 1e3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
    ] })
  ] });
}
export {
  Chat as component
};
