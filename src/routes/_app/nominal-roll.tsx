import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/nominal-roll")({
  component: NominalRoll,
  head: () => ({ meta: [{ title: "Nominal Roll — VMKV NCC" }] }),
});

type Row = { id: string; full_name: string; regimental_number: string | null; rank: string | null; course: string | null; year_of_study: string | null };

function NominalRoll() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [v, setV] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("nominal_roll").select("*").order("full_name");
    setRows((data ?? []) as Row[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("nominal_roll").insert({
      full_name: v.full_name, regimental_number: v.regimental_number || null,
      rank: v.rank || null, course: v.course || null, year_of_study: v.year_of_study || null,
      created_by: u.user?.id,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setV({});
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" /> Nominal Roll
      </h1>
      {isAdmin && (
        <Card className="p-4">
          <form onSubmit={add} className="grid grid-cols-2 gap-2">
            <Input placeholder="Full name" required value={v.full_name ?? ""} onChange={(e) => setV({ ...v, full_name: e.target.value })} />
            <Input placeholder="Regt. No." value={v.regimental_number ?? ""} onChange={(e) => setV({ ...v, regimental_number: e.target.value })} />
            <Input placeholder="Rank" value={v.rank ?? ""} onChange={(e) => setV({ ...v, rank: e.target.value })} />
            <Input placeholder="Course" value={v.course ?? ""} onChange={(e) => setV({ ...v, course: e.target.value })} />
            <Input placeholder="Year" value={v.year_of_study ?? ""} onChange={(e) => setV({ ...v, year_of_study: e.target.value })} />
            <Button type="submit" disabled={busy}>Add</Button>
          </form>
        </Card>
      )}
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id} className="p-3 flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{r.rank ? `${r.rank} ` : ""}{r.full_name}</p>
              <p className="text-xs text-muted-foreground">{[r.regimental_number, r.course, r.year_of_study].filter(Boolean).join(" · ")}</p>
            </div>
            {isAdmin && (
              <button onClick={async () => { await supabase.from("nominal_roll").delete().eq("id", r.id); load(); }} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </Card>
        ))}
        {rows.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">Roll is empty.</Card>}
      </div>
    </div>
  );
}