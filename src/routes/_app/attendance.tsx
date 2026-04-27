import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/UserAvatar";
import { ClipboardCheck, Check, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/attendance")({
  component: Attendance,
  head: () => ({ meta: [{ title: "Attendance — VMKV NCC" }] }),
});

type Cadet = { id: string; full_name: string; photo_url: string | null };
type Mark = { cadet_user_id: string; status: "present" | "absent" | "leave" };

function Attendance() {
  const { isSeniorOrAbove } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  const [cadets, setCadets] = useState<Cadet[]>([]);
  const [marks, setMarks] = useState<Record<string, Mark["status"]>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: rs } = await supabase.from("user_roles").select("user_id").eq("role", "cadet");
      const ids = (rs ?? []).map((r) => r.user_id);
      if (ids.length === 0) { setCadets([]); return; }
      const { data: profs } = await supabase.from("profiles").select("id, full_name, photo_url").in("id", ids);
      setCadets((profs ?? []) as Cadet[]);
      const { data: today } = await supabase
        .from("attendance").select("cadet_user_id, status").eq("attendance_date", format(new Date(), "yyyy-MM-dd"));
      const m: Record<string, Mark["status"]> = {};
      (today ?? []).forEach((t) => { m[t.cadet_user_id] = t.status as Mark["status"]; });
      setMarks(m);
    })();
  }, []);

  const mark = async (uid: string, status: Mark["status"]) => {
    if (!isSeniorOrAbove) return;
    setBusy(true);
    setMarks((m) => ({ ...m, [uid]: status }));
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("attendance").upsert({
      cadet_user_id: uid, attendance_date: today, status, marked_by: u.user?.id,
    }, { onConflict: "cadet_user_id,attendance_date" });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ClipboardCheck className="h-6 w-6 text-primary" /> Attendance
      </h1>
      <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, dd MMM yyyy")}</p>
      {!isSeniorOrAbove && <Card className="p-3 text-xs text-muted-foreground">View-only. Only seniors can mark.</Card>}
      <div className="space-y-2">
        {cadets.map((c) => {
          const s = marks[c.id];
          return (
            <Card key={c.id} className="p-3 flex items-center gap-3">
              <UserAvatar url={c.photo_url} name={c.full_name} className="h-10 w-10" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.full_name || "Cadet"}</p>
                {s && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s}</span>}
              </div>
              {isSeniorOrAbove && (
                <div className="flex gap-1">
                  <Button size="icon" variant={s === "present" ? "default" : "outline"} disabled={busy} onClick={() => mark(c.id, "present")} aria-label="Present"><Check className="h-4 w-4" /></Button>
                  <Button size="icon" variant={s === "absent" ? "destructive" : "outline"} disabled={busy} onClick={() => mark(c.id, "absent")} aria-label="Absent"><X className="h-4 w-4" /></Button>
                </div>
              )}
            </Card>
          );
        })}
        {cadets.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No cadets yet.</Card>
        )}
      </div>
    </div>
  );
}