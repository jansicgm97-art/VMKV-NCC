import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/library")({
  component: Library,
  head: () => ({ meta: [{ title: "Library — VMKV NCC" }] }),
});

type Item = { id: string; title: string; description: string | null; category: string | null; file_url: string };

function Library() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("library_items").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    if (!title.trim()) return toast.error("Add a title first");
    setBusy(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from("library").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("library").getPublicUrl(path);
      const { data: u } = await supabase.auth.getUser();
      const { error: e2 } = await supabase.from("library_items").insert({
        title, category: category || null, file_url: publicUrl, uploaded_by: u.user?.id,
      });
      if (e2) throw e2;
      setTitle(""); setCategory("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Uploaded");
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" /> Library
      </h1>
      <p className="text-sm text-muted-foreground">Reports, magazines, yearbooks (PDF).</p>

      {isAdmin && (
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Yearbook / Report" />
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            className="block w-full text-sm"
          />
        </Card>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <Card key={it.id} className="p-4 flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary"><FileText className="h-5 w-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{it.title}</p>
              {it.category && <p className="text-xs text-muted-foreground">{it.category}</p>}
            </div>
            <a href={it.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary font-medium">Open</a>
            {isAdmin && (
              <button
                onClick={async () => { await supabase.from("library_items").delete().eq("id", it.id); load(); }}
                className="text-destructive"
                aria-label="Delete"
              ><Trash2 className="h-4 w-4" /></button>
            )}
          </Card>
        ))}
        {items.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No documents yet.</Card>
        )}
      </div>
    </div>
  );
}