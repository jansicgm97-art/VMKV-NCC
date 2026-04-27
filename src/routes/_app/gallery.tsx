import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { compressToSquareJpeg } from "@/lib/image-utils";

export const Route = createFileRoute("/_app/gallery")({
  component: Gallery,
  head: () => ({ meta: [{ title: "Gallery — VMKV NCC" }] }),
});

type Item = { id: string; image_url: string; caption: string | null; title: string | null };

function Gallery() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("id,image_url,caption,title")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const blob = await compressToSquareJpeg(file, 1200, 0.85);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
      const { data: u } = await supabase.auth.getUser();
      const { error: insErr } = await supabase.from("gallery_items").insert({
        image_url: publicUrl,
        caption: caption || null,
        uploaded_by: u.user?.id,
      });
      if (insErr) throw insErr;
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Uploaded");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (it: Item) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery_items").delete().eq("id", it.id);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ImageIcon className="h-6 w-6 text-primary" /> Gallery
      </h1>

      {isAdmin && (
        <Card className="p-4 space-y-3">
          <Label>Upload photo</Label>
          <Input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
            className="block w-full text-sm"
          />
          {busy && <p className="text-xs text-muted-foreground"><Upload className="inline h-3 w-3 mr-1" />Uploading…</p>}
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-square">
            <img src={it.image_url} alt={it.caption ?? ""} className="h-full w-full object-cover" loading="lazy" />
            {it.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2">
                {it.caption}
              </div>
            )}
            {isAdmin && (
              <button
                onClick={() => remove(it)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-md p-1 opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <Card className="col-span-full p-6 text-center text-sm text-muted-foreground">
            No photos yet.
          </Card>
        )}
      </div>
    </div>
  );
}