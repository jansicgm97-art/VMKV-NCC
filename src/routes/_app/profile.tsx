import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/app/UserAvatar";
import { RoleBadge } from "@/components/app/RoleBadge";
import { Camera, Link as LinkIcon, Unlink } from "lucide-react";
import { toast } from "sonner";
import { compressToSquareJpeg } from "@/lib/image-utils";
import { getGoogleIdToken, getMicrosoftIdToken } from "@/lib/oauth-utils";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "My Profile — VMKV NCC" }] }),
});

function ProfilePage() {
  const { user, profile, roles, refresh, isAdmin } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [regNo, setRegNo] = useState(profile?.regimental_number ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [linkingBusy, setLinkingBusy] = useState(false);
  const [linkedIdentities, setLinkedIdentities] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadLinkedIdentities();
    }

    // Check if user just returned from linking flow
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('link_identity') === 'true') {
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh identities after a short delay to ensure linking is complete
      setTimeout(() => {
        loadLinkedIdentities();
        toast.success("Account linked successfully!");
      }, 1000);
    }
  }, [user]);

  const loadLinkedIdentities = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.auth.admin.listUserIdentities(user.id);
      if (error) throw error;
      setLinkedIdentities(data?.identities || []);
    } catch (e) {
      console.error("Failed to load linked identities:", e);
    }
  };

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

  const linkGoogleAccount = async () => {
    if (!user) return;
    setLinkingBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            link_identity: 'true'
          }
        }
      });
      if (error) throw error;
      // The linking will happen automatically when the user returns
    } catch (e) {
      toast.error((e as Error).message);
      setLinkingBusy(false);
    }
  };

  const linkMicrosoftAccount = async () => {
    if (!user) return;
    setLinkingBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            link_identity: 'true'
          }
        }
      });
      if (error) throw error;
      // The linking will happen automatically when the user returns
    } catch (e) {
      toast.error((e as Error).message);
      setLinkingBusy(false);
    }
  };

  const unlinkIdentity = async (identityId: string) => {
    if (!user) return;
    setLinkingBusy(true);
    try {
      const { error } = await supabase.auth.unlinkIdentity({
        identity_id: identityId
      });
      if (error) throw error;
      toast.success("Account unlinked successfully");
      await loadLinkedIdentities();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLinkingBusy(false);
    }
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

      {(profile?.approval_status === "approved" || isAdmin) && (
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Linked Accounts
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Link additional accounts for easier sign-in. You can link Google and Microsoft accounts.
          </p>

          <div className="space-y-3">
            {linkedIdentities.map((identity) => (
              <div key={identity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {identity.provider === 'google' && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {identity.provider === 'azure' && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 3h18v18H3V3zm16 16V5H5v14h14zM9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{identity.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      {identity.identity_data?.email || 'Linked account'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => unlinkIdentity(identity.id)}
                  disabled={linkingBusy}
                  className="text-destructive hover:text-destructive"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Unlink
                </Button>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {!linkedIdentities.some(id => id.provider === 'google') && (
                <Button
                  variant="outline"
                  onClick={linkGoogleAccount}
                  disabled={linkingBusy}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Link Google Account
                </Button>
              )}

              {!linkedIdentities.some(id => id.provider === 'azure') && (
                <Button
                  variant="outline"
                  onClick={linkMicrosoftAccount}
                  disabled={linkingBusy}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 3h18v18H3V3zm16 16V5H5v14h14zM9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"/>
                  </svg>
                  Link Microsoft Account
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}