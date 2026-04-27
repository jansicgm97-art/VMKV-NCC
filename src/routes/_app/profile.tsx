import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/app/UserAvatar";
import { RoleBadge } from "@/components/app/RoleBadge";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { compressToSquareJpeg } from "@/lib/image-utils";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "My Profile — VMKV NCC" }] }),
});

function ProfilePage() {
  const { user, profile, roles, refresh } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [regNo, setRegNo] = useState(profile?.regimental_number ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      phone: phone || null,
      regimental_number: regNo || null,
      bio: bio || null,
      profile_completed: true,
    }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    await refresh();
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setBusy(true);
    try {
      const blob = await compressToSquareJpeg(file, 600, 0.85);
      const path = `${user.id}/avatar.jpg`;
      const { error } = await supabase.storage.from("profile-photos")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("profile-photos").getPublicUrl(path);
      const cacheBust = `${publicUrl}?v=${Date.now()}`;
      const { error: e2 } = await supabase.from("profiles").update({ photo_url: cacheBust }).eq("id", user.id);
      if (e2) throw e2;
      toast.success("Photo updated");
      await refresh();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card className="p-5">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <UserAvatar url={profile?.photo_url} name={profile?.full_name} className="h-28 w-28" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-accent text-accent-foreground p-2 shadow-elegant hover:scale-110 transition"
              aria-label="Change photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
            />
          </div>
          <div className="text-center">
            <p className="font-semibold">{profile?.full_name || "Cadet"}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
            <div className="flex gap-1 justify-center mt-1">
              {roles.map((r) => <RoleBadge key={r} role={r} />)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <form onSubmit={save} className="space-y-3">
          <div>
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={120} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
            </div>
            <div>
              <Label>Regimental No.</Label>
              <Input value={regNo} onChange={(e) => setRegNo(e.target.value)} maxLength={50} />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} />
          </div>
          <Button type="submit" disabled={busy}>Save changes</Button>
        </form>
      </Card>
    </div>
  );
}