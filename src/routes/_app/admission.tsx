import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { compressToSquareJpeg } from "@/lib/image-utils";

export const Route = createFileRoute("/_app/admission")({
  component: Admission,
  head: () => ({ meta: [{ title: "Admission Form — VMKV NCC" }] }),
});

const SECTIONS: { title: string; fields: { key: string; label: string; type?: string; full?: boolean }[] }[] = [
  {
    title: "Personal",
    fields: [
      { key: "full_name", label: "Full name", full: true },
      { key: "date_of_birth", label: "Date of birth", type: "date" },
      { key: "gender", label: "Gender" },
      { key: "blood_group", label: "Blood group" },
      { key: "religion", label: "Religion" },
      { key: "category", label: "Category (Gen/OBC/SC/ST)" },
      { key: "nationality", label: "Nationality" },
      { key: "aadhaar_number", label: "Aadhaar number" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email", type: "email" },
      { key: "permanent_address", label: "Permanent address", full: true },
      { key: "current_address", label: "Current address", full: true },
    ],
  },
  {
    title: "Family",
    fields: [
      { key: "father_name", label: "Father's name" },
      { key: "father_occupation", label: "Father's occupation" },
      { key: "father_phone", label: "Father's phone" },
      { key: "mother_name", label: "Mother's name" },
      { key: "mother_occupation", label: "Mother's occupation" },
      { key: "mother_phone", label: "Mother's phone" },
      { key: "guardian_name", label: "Guardian (if any)" },
      { key: "emergency_contact", label: "Emergency contact" },
    ],
  },
  {
    title: "Academic",
    fields: [
      { key: "course", label: "Course (B.E. / B.Tech)" },
      { key: "branch", label: "Branch" },
      { key: "year_of_study", label: "Year of study" },
      { key: "roll_number", label: "Roll number" },
      { key: "college_id", label: "College ID" },
      { key: "hostel_or_dayscholar", label: "Hostel / Day Scholar" },
    ],
  },
  {
    title: "Physical & Medical",
    fields: [
      { key: "height_cm", label: "Height (cm)", type: "number" },
      { key: "weight_kg", label: "Weight (kg)", type: "number" },
      { key: "identification_marks", label: "Identification marks", full: true },
      { key: "medical_conditions", label: "Medical conditions", full: true },
      { key: "allergies", label: "Allergies", full: true },
    ],
  },
  {
    title: "NCC & Other",
    fields: [
      { key: "ncc_unit", label: "NCC unit" },
      { key: "ncc_wing", label: "NCC wing" },
      { key: "enrollment_year", label: "Enrollment year" },
      { key: "prior_ncc_experience", label: "Prior NCC experience" },
      { key: "hobbies", label: "Hobbies", full: true },
      { key: "achievements", label: "Achievements", full: true },
    ],
  },
];

function Admission() {
  const { user } = useAuth();
  const [existing, setExisting] = useState<{ status: string } | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({
    nationality: "Indian",
    ncc_unit: "11 TAMILNADU SIGNAL COMPANY NCC SALEM",
    ncc_wing: "Senior Division",
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [decl, setDecl] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("admissions").select("status").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setExisting(data as { status: string } | null));
  }, [user]);

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setBusy(true);
    try {
      const blob = await compressToSquareJpeg(file, 600, 0.9);
      const path = `${user.id}/admission.jpg`;
      const { error } = await supabase.storage.from("profile-photos")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("profile-photos").getPublicUrl(path);
      setPhotoUrl(`${publicUrl}?v=${Date.now()}`);
      toast.success("Photo ready");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!photoUrl) return toast.error("Passport-size photo is required");
    if (!decl) return toast.error("Please accept the declaration");
    setBusy(true);
    const payload = { ...vals, photo_url: photoUrl, declaration_accepted: true, user_id: user.id };
    if (vals.height_cm) (payload as Record<string, unknown>).height_cm = Number(vals.height_cm);
    if (vals.weight_kg) (payload as Record<string, unknown>).weight_kg = Number(vals.weight_kg);
    if (!vals.full_name) return toast.error("Full name required");
    const { error } = await supabase.from("admissions").insert(payload as never);
    setBusy(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
  };

  if (submitted || existing) {
    return (
      <Card className="p-8 text-center space-y-3">
        <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
        <h1 className="text-2xl font-bold">Welcome to VMKV NCC Family 🎖️</h1>
        <p className="text-sm text-muted-foreground">
          Your admission form has been submitted. Status:{" "}
          <Badge>{existing?.status ?? "pending"}</Badge>
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" /> Admission Form
      </h1>
      <form onSubmit={submit} className="space-y-4">
        <Card className="p-4 space-y-3">
          <Label>Passport-size photo (required)</Label>
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="h-24 w-24 object-cover rounded-md border" />
            ) : (
              <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No photo</div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
              className="text-sm"
            />
          </div>
        </Card>

        {SECTIONS.map((sec) => (
          <Card key={sec.title} className="p-4 space-y-3">
            <h2 className="font-semibold text-primary">{sec.title}</h2>
            <div className="grid grid-cols-2 gap-3">
              {sec.fields.map((f) => (
                <div key={f.key} className={f.full ? "col-span-2" : ""}>
                  <Label className="text-xs">{f.label}</Label>
                  {f.full ? (
                    <Textarea
                      value={vals[f.key] ?? ""}
                      onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                      rows={2}
                    />
                  ) : (
                    <Input
                      type={f.type ?? "text"}
                      value={vals[f.key] ?? ""}
                      onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-4">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={decl} onChange={(e) => setDecl(e.target.checked)} className="mt-1" />
            <span>I declare that the information furnished above is true and correct to the best of my knowledge.</span>
          </label>
        </Card>

        <Button type="submit" disabled={busy} className="w-full">Submit application</Button>
      </form>
    </div>
  );
}