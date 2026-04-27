import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Send } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/chat")({
  component: Chat,
  head: () => ({ meta: [{ title: "Chat — VMKV NCC" }] }),
});

type Msg = { id: string; user_id: string; body: string; created_at: string };
type ProfileLite = { id: string; full_name: string; photo_url: string | null };

function Chat() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadProfiles = async (ids: string[]) => {
    if (ids.length === 0) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, photo_url")
      .in("id", ids);
    const map: Record<string, ProfileLite> = {};
    (data ?? []).forEach((p) => (map[p.id] = p as ProfileLite));
    setProfiles((prev) => ({ ...prev, ...map }));
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      const arr = (data ?? []) as Msg[];
      setMsgs(arr);
      await loadProfiles(Array.from(new Set(arr.map((m) => m.user_id))));
    })();

    const ch = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const m = payload.new as Msg;
          setMsgs((prev) => [...prev, m]);
          if (!profiles[m.user_id]) loadProfiles([m.user_id]);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !user) return;
    setText("");
    const { error } = await supabase.from("chat_messages").insert({ user_id: user.id, body });
    if (error) setText(body);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {msgs.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-10">
            Start the conversation, cadet.
          </p>
        )}
        {msgs.map((m) => {
          const me = m.user_id === user?.id;
          const p = profiles[m.user_id];
          return (
            <div key={m.id} className={`flex gap-2 ${me ? "flex-row-reverse" : ""}`}>
              <UserAvatar url={p?.photo_url} name={p?.full_name ?? "Cadet"} className="h-8 w-8 shrink-0" />
              <div className={`max-w-[75%] ${me ? "items-end" : ""} flex flex-col`}>
                <div className="text-[10px] text-muted-foreground px-1">
                  {p?.full_name ?? "Cadet"} · {format(new Date(m.created_at), "p")}
                </div>
                <div className={`rounded-2xl px-3 py-2 text-sm ${me ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  {m.body}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 mt-3 pt-3 border-t">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          maxLength={1000}
        />
        <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}