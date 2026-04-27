import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/leave")({
  component: LeavePage,
  head: () => ({ meta: [{ title: "Leave — VMKV NCC" }] }),
});

type LR = { id: string; cadet_user_id: string; leave_type: string; from_date: string; to_date: string; reason: string; status: string };

function LeavePage() {
  const { user, isSeniorOrAbove } = useAuth();
  const [items, setItems] = useState<LR[]>([]);
  const [type, setType] = useState("Casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("leave_requests").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as LR[]);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("leave_requests").insert({
      cadet_user_id: user.id, leave_type: type, from_date: from, to_date: to, reason,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setReason(""); setFrom(""); setTo("");
    toast.success("Submitted");
    load();
  };

  const review = async (id: string, status: "approved" | "rejected") => {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("leave_requests").update({
      status, reviewed_by: u.user?.id, reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays className="h-6 w-6 text-primary" /> Leave / Permission
      </h1>

      <Card className="p-4">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Type</Label><Input value={type} onChange={(e) => setType(e.target.value)} required /></div>
            <div><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></div>
            <div><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} required /></div>
          </div>
          <div><Label>Reason</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} required maxLength={500} /></div>
          <Button type="submit" disabled={busy}>Submit request</Button>
        </form>
      </Card>

      <div className="space-y-2">
        {items.map((l) => (
          <Card key={l.id} className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm">
                <p className="font-medium">{l.leave_type} · {l.from_date} → {l.to_date}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{l.reason}</p>
              </div>
              <Badge variant={l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "outline"}>
                {l.status}
              </Badge>
            </div>
            {isSeniorOrAbove && l.status === "pending" && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => review(l.id, "approved")}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => review(l.id, "rejected")}>Reject</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}