import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { u as useAuth, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { B as Button } from "./button-B2R08Of-.js";
import { I as Input } from "./input-DD7rev21.js";
import { L as Label } from "./label-DwcCBX1v.js";
import { T as Textarea } from "./textarea-DPTcPPFi.js";
import { B as Badge } from "./badge-CNkGfYSq.js";
import { c as compressToSquareJpeg } from "./image-utils-C3htUm6p.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import { F as FileText } from "./file-text-DQWsOYoo.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode);
const SECTIONS = [{
  title: "Personal",
  fields: [{
    key: "full_name",
    label: "Full name",
    full: true
  }, {
    key: "date_of_birth",
    label: "Date of birth",
    type: "date"
  }, {
    key: "gender",
    label: "Gender"
  }, {
    key: "blood_group",
    label: "Blood group"
  }, {
    key: "religion",
    label: "Religion"
  }, {
    key: "category",
    label: "Category (Gen/OBC/SC/ST)"
  }, {
    key: "nationality",
    label: "Nationality"
  }, {
    key: "aadhaar_number",
    label: "Aadhaar number"
  }]
}, {
  title: "Contact",
  fields: [{
    key: "phone",
    label: "Phone"
  }, {
    key: "email",
    label: "Email",
    type: "email"
  }, {
    key: "permanent_address",
    label: "Permanent address",
    full: true
  }, {
    key: "current_address",
    label: "Current address",
    full: true
  }]
}, {
  title: "Family",
  fields: [{
    key: "father_name",
    label: "Father's name"
  }, {
    key: "father_occupation",
    label: "Father's occupation"
  }, {
    key: "father_phone",
    label: "Father's phone"
  }, {
    key: "mother_name",
    label: "Mother's name"
  }, {
    key: "mother_occupation",
    label: "Mother's occupation"
  }, {
    key: "mother_phone",
    label: "Mother's phone"
  }, {
    key: "guardian_name",
    label: "Guardian (if any)"
  }, {
    key: "emergency_contact",
    label: "Emergency contact"
  }]
}, {
  title: "Academic",
  fields: [{
    key: "course",
    label: "Course (B.E. / B.Tech)"
  }, {
    key: "branch",
    label: "Branch"
  }, {
    key: "year_of_study",
    label: "Year of study"
  }, {
    key: "roll_number",
    label: "Roll number"
  }, {
    key: "college_id",
    label: "College ID"
  }, {
    key: "hostel_or_dayscholar",
    label: "Hostel / Day Scholar"
  }]
}, {
  title: "Physical & Medical",
  fields: [{
    key: "height_cm",
    label: "Height (cm)",
    type: "number"
  }, {
    key: "weight_kg",
    label: "Weight (kg)",
    type: "number"
  }, {
    key: "identification_marks",
    label: "Identification marks",
    full: true
  }, {
    key: "medical_conditions",
    label: "Medical conditions",
    full: true
  }, {
    key: "allergies",
    label: "Allergies",
    full: true
  }]
}, {
  title: "NCC & Other",
  fields: [{
    key: "ncc_unit",
    label: "NCC unit"
  }, {
    key: "ncc_wing",
    label: "NCC wing"
  }, {
    key: "enrollment_year",
    label: "Enrollment year"
  }, {
    key: "prior_ncc_experience",
    label: "Prior NCC experience"
  }, {
    key: "hobbies",
    label: "Hobbies",
    full: true
  }, {
    key: "achievements",
    label: "Achievements",
    full: true
  }]
}];
function Admission() {
  const {
    user
  } = useAuth();
  const [existing, setExisting] = reactExports.useState(null);
  const [vals, setVals] = reactExports.useState({
    nationality: "Indian",
    ncc_unit: "11 TAMILNADU SIGNAL COMPANY NCC SALEM",
    ncc_wing: "Senior Division"
  });
  const [photoUrl, setPhotoUrl] = reactExports.useState(null);
  const [decl, setDecl] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("admissions").select("status").eq("user_id", user.id).maybeSingle().then(({
      data
    }) => setExisting(data));
  }, [user]);
  const uploadPhoto = async (file) => {
    if (!user) return;
    setBusy(true);
    try {
      const blob = await compressToSquareJpeg(file, 600, 0.9);
      const path = `${user.id}/admission.jpg`;
      const {
        error
      } = await supabase.storage.from("profile-photos").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: true
      });
      if (error) throw error;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("profile-photos").getPublicUrl(path);
      setPhotoUrl(`${publicUrl}?v=${Date.now()}`);
      toast.success("Photo ready");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!photoUrl) return toast.error("Passport-size photo is required");
    if (!decl) return toast.error("Please accept the declaration");
    setBusy(true);
    const payload = {
      ...vals,
      photo_url: photoUrl,
      declaration_accepted: true,
      user_id: user.id
    };
    if (vals.height_cm) payload.height_cm = Number(vals.height_cm);
    if (vals.weight_kg) payload.weight_kg = Number(vals.weight_kg);
    if (!vals.full_name) return toast.error("Full name required");
    const {
      error
    } = await supabase.from("admissions").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
  };
  if (submitted || existing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-14 w-14 text-success mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Welcome to VMKV NCC Family 🎖️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Your admission form has been submitted. Status:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: existing?.status ?? "pending" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-primary" }),
      " Admission Form"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Passport-size photo (required)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photoUrl, alt: "", className: "h-24 w-24 object-cover rounded-md border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground", children: "No photo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) uploadPhoto(f);
          }, className: "text-sm" })
        ] })
      ] }),
      SECTIONS.map((sec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-primary", children: sec.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: sec.fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: f.full ? "col-span-2" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: f.label }),
          f.full ? /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: vals[f.key] ?? "", onChange: (e) => setVals((v) => ({
            ...v,
            [f.key]: e.target.value
          })), rows: 2 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: f.type ?? "text", value: vals[f.key] ?? "", onChange: (e) => setVals((v) => ({
            ...v,
            [f.key]: e.target.value
          })) })
        ] }, f.key)) })
      ] }, sec.title)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: decl, onChange: (e) => setDecl(e.target.checked), className: "mt-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "I declare that the information furnished above is true and correct to the best of my knowledge." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: "Submit application" })
    ] })
  ] });
}
export {
  Admission as component
};
