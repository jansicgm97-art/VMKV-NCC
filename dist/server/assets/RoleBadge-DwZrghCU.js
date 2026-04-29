import { U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { B as Badge } from "./badge-CNkGfYSq.js";
const LABELS = {
  ano: "ANO",
  main_senior: "Main Senior",
  senior: "Senior",
  cadet: "Cadet"
};
function RoleBadge({ role }) {
  const variant = role === "ano" ? "bg-accent text-accent-foreground" : role === "main_senior" ? "bg-primary text-primary-foreground" : role === "senior" ? "bg-secondary text-secondary-foreground border border-primary/30" : "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: variant, children: LABELS[role] });
}
export {
  RoleBadge as R
};
