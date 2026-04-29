import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/app/UserAvatar";
import { RoleBadge } from "@/components/app/RoleBadge";
import { ShieldCheck, UserMinus, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — VMKV NCC" }] }),
});

type Pending = {
  id: string; full_name: string; photo_url: string; user_id: string; created_at: string;
};
type UserRow = { id: string; full_name: string; photo_url: string | null; email: string | null };
type PendingAccount = {
  id: string;
  full_name: string;
  email: string | null;
  photo_url: string | null;
  created_at: string;
};
type RejectedAccount = {
  id: string;
  full_name: string;
  email: string | null;
  photo_url: string | null;
  created_at: string;
  approval_reviewed_at: string | null;
};

function Admin() {
  const { isAdmin, isAno, loading } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Pending[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, AppRole[]>>({});
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);
  const [rejectedAccounts, setRejectedAccounts] = useState<RejectedAccount[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/dashboard" });
  }, [isAdmin, loading, navigate]);

  const load = async () => {
    const { data: ad } = await supabase.from("admissions")
      .select("id, full_name, photo_url, user_id, created_at").eq("status", "pending")
      .order("created_at", { ascending: false });
    setPending((ad ?? []) as Pending[]);

    const { data: us } = await supabase.from("profiles").select("id, full_name, photo_url, email")
      .eq("approval_status", "approved")
      .order("full_name");
    setUsers((us ?? []) as UserRow[]);
    const { data: rs } = await supabase.from("user_roles").select("user_id, role");
    const map: Record<string, AppRole[]> = {};
    (rs ?? []).forEach((r) => {
      map[r.user_id] = [...(map[r.user_id] ?? []), r.role as AppRole];
    });
    setRolesByUser(map);

    const { data: pa } = await supabase
      .from("profiles")
      .select("id, full_name, email, photo_url, created_at")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });
    setPendingAccounts((pa ?? []) as PendingAccount[]);

    const { data: ra } = await supabase
      .from("profiles")
      .select("id, full_name, email, photo_url, created_at, approval_reviewed_at")
      .eq("approval_status", "rejected")
      .order("created_at", { ascending: false });
    setRejectedAccounts((ra ?? []) as RejectedAccount[]);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const review = async (id: string, status: "approved" | "rejected") => {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("admissions").update({
      status, reviewed_by: u.user?.id, reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    toast.success(status);
    load();
  };

  const assignRole = async (uid: string, role: AppRole) => {
    if (role === "main_senior" && !isAno) return toast.error("Only ANO can assign Main Senior");
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role, assigned_by: u.user?.id });
    if (error) return toast.error(error.message);
    toast.success("Role assigned");
    load();
  };

  const removeRole = async (uid: string, role: AppRole) => {
    if (role === "main_senior" && !isAno) return toast.error("Only ANO can remove Main Senior");
    if (role === "ano") return toast.error("ANO role cannot be removed here");
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    if (error) return toast.error(error.message);
    load();
  };

  const removeCadet = async (uid: string) => {
    if (!confirm("Remove this cadet's roles?")) return;
    await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "cadet");
    load();
  };

  const reviewAccount = async (uid: string, status: "approved" | "rejected") => {
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        approval_status: status,
        approval_reviewed_by: u.user?.id,
        approval_reviewed_at: new Date().toISOString(),
      })
      .eq("id", uid);
    if (error) return toast.error(error.message);
    toast.success(`Account ${status}`);
    load();
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-accent" /> Admin Panel
        {isAno && <Badge className="bg-accent text-accent-foreground"><Crown className="h-3 w-3 mr-1" />ANO</Badge>}
      </h1>

      <Tabs defaultValue="approvals">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="accounts">Accounts ({pendingAccounts.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedAccounts.length})</TabsTrigger>
          <TabsTrigger value="approvals">Admissions ({pending.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-2 pt-3">
          {pendingAccounts.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              No accounts awaiting approval.
            </Card>
          )}
          {pendingAccounts.map((p) => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <UserAvatar url={p.photo_url} name={p.full_name} className="h-12 w-12" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.full_name || "Unnamed cadet"}</p>
                <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                <p className="text-[10px] text-muted-foreground">
                  Signed up {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" onClick={() => reviewAccount(p.id, "approved")}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => reviewAccount(p.id, "rejected")}>Reject</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-2 pt-3">
          {rejectedAccounts.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              No rejected accounts.
            </Card>
          )}
          {rejectedAccounts.map((p) => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <UserAvatar url={p.photo_url} name={p.full_name} className="h-12 w-12" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.full_name || "Unnamed cadet"}</p>
                <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                <p className="text-[10px] text-muted-foreground">
                  Signed up {new Date(p.created_at).toLocaleDateString()}
                </p>
                {p.approval_reviewed_at && (
                  <p className="text-[10px] text-red-600">
                    Rejected {new Date(p.approval_reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => reviewAccount(p.id, "approved")}>Re-approve</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approvals" className="space-y-2 pt-3">
          {pending.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">No pending admissions.</Card>}
          {pending.map((p) => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <img src={p.photo_url} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.full_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <Button size="sm" onClick={() => review(p.id, "approved")}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => review(p.id, "rejected")}>Reject</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-2 pt-3">
          {users.map((u) => {
            const rs = rolesByUser[u.id] ?? [];
            return (
              <Card key={u.id} className="p-3">
                <div className="flex items-center gap-3">
                  <UserAvatar url={u.photo_url} name={u.full_name} className="h-10 w-10" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{u.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rs.map((r) => (
                        <button key={r} onClick={() => removeRole(u.id, r)} title="Click to remove">
                          <RoleBadge role={r} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeCadet(u.id)} className="text-destructive" aria-label="Remove cadet">
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {!rs.includes("senior") && (
                    <Button size="sm" variant="outline" onClick={() => assignRole(u.id, "senior")}>+ Senior</Button>
                  )}
                  {isAno && !rs.includes("main_senior") && (
                    <Button size="sm" variant="outline" onClick={() => assignRole(u.id, "main_senior")}>+ Main Senior</Button>
                  )}
                  {isAno && !rs.includes("ano") && (
                    <Button size="sm" variant="outline" onClick={() => assignRole(u.id, "ano")}>+ ANO</Button>
                  )}
                  {!rs.includes("cadet") && (
                    <Button size="sm" variant="outline" onClick={() => assignRole(u.id, "cadet")}>+ Cadet</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}