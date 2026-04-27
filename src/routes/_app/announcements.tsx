import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pin, Plus, Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/announcements")({
  component: Announcements,
  head: () => ({ meta: [{ title: "Announcements — VMKV NCC" }] }),
});

type Item = {
  id: string;
  title: string;
  body: string;
  category: "camp" | "circular" | "notification";
  pinned: boolean;
  created_at: string;
};

function Announcements() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [showNew, setShowNew] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" /> Announcements
        </h1>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowNew((s) => !s)}>
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        )}
      </header>

      {isAdmin && showNew && <NewForm onSaved={() => { setShowNew(false); load(); }} />}

      {items.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No announcements yet.
        </Card>
      ) : (
        items.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold flex items-center gap-1.5">
                {a.pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                {a.title}
              </h3>
              <Badge variant="outline" className="capitalize text-[10px]">
                {a.category}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{a.body}</p>
            <p className="mt-3 text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
            </p>
          </Card>
        ))
      )}
    </div>
  );
}

function NewForm({ onSaved }: { onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<"camp" | "circular" | "notification">("notification");
  const [pinned, setPinned] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("announcements").insert({
      title,
      body,
      category,
      pinned,
      created_by: user?.id,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Posted");
    onSaved();
  };

  return (
    <Card className="p-4 space-y-3">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
        </div>
        <div>
          <Label>Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required maxLength={4000} rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="circular">Circular</SelectItem>
                <SelectItem value="camp">Camp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <input
              id="pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="pinned">Pin to top</Label>
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          Post
        </Button>
      </form>
    </Card>
  );
}