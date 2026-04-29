import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-nmbh7RaZ.js";
import { l as logo, u as useAuth, a as useNavigate, L as Link, s as supabase, t as toast } from "./router-ANgPuP48.js";
import { B as Button } from "./button-B2R08Of-.js";
import { I as Input } from "./input-DD7rev21.js";
import { L as Label } from "./label-DwcCBX1v.js";
import { C as Card } from "./card-3z3NcXTO.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CmNjcURl.js";
import { c as createLucideIcon } from "./index-CSwKuDfi.js";
import { S as ShieldCheck } from "./shield-check-Dd3U_5iJ.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-D3rFzNQH.js";
import "./index-BhpMngH6.js";
const __iconNode$3 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79", key: "gwxi1d" }],
  ["path", { d: "M4 3h.01", key: "1vcuye" }],
  ["path", { d: "M22 8h.01", key: "1mrtc2" }],
  ["path", { d: "M15 2h.01", key: "1cjtqr" }],
  ["path", { d: "M22 20h.01", key: "1mrys2" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      key: "hbicv8"
    }
  ],
  [
    "path",
    { d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17", key: "1i94pl" }
  ],
  ["path", { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7", key: "1cofks" }],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
      key: "4kbmks"
    }
  ]
];
const PartyPopper = createLucideIcon("party-popper", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const bg = "/assets/auditorium-bg-D7hl4fYv.jpg";
function WelcomeCelebration({ name, onClose }) {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);
  const confetti = reactExports.useMemo(
    () => Array.from({ length: 60 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2.5,
      size: 6 + Math.random() * 8,
      hue: [0, 45, 130, 200, 280, 350][i % 6],
      rotate: Math.random() * 360
    })),
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-gradient-hero overflow-hidden p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: confetti.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "absolute -top-6 block rounded-sm",
        style: {
          left: `${c.left}%`,
          width: `${c.size}px`,
          height: `${c.size * 1.6}px`,
          background: `hsl(${c.hue} 90% 60%)`,
          transform: `rotate(${c.rotate}deg)`,
          animation: `confetti-fall ${c.duration}s linear ${c.delay}s infinite`
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.9; }
        }
        @keyframes badge-pop {
          0% { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { filter: drop-shadow(0 0 10px hsl(var(--accent) / 0.5)); }
          50% { filter: drop-shadow(0 0 28px hsl(var(--accent) / 0.95)); }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `relative w-full max-w-lg text-center text-primary-foreground transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mx-auto mb-5",
              style: { animation: "badge-pop 0.7s ease-out, shimmer 3s ease-in-out 0.7s infinite" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", className: "h-28 w-auto mx-auto object-contain" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur px-4 py-1.5 text-accent text-xs font-bold tracking-widest uppercase mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PartyPopper, { className: "h-3.5 w-3.5" }),
            " Congratulations",
            name ? `, ${name.split(" ")[0]}` : "",
            "!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-lg", children: [
            "Welcome to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Vinayaka Mission's Kirupananda Variyar" }),
            " Engineering College"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm sm:text-base opacity-95 font-medium", children: [
            "and the National Cadet Corps,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Deemed to be University" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs sm:text-sm opacity-90 tracking-wider", children: "11 TAMILNADU SIGNAL COMPANY NCC, SALEM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-xl bg-card/15 backdrop-blur border border-white/20 p-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-accent shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold flex items-center gap-1", children: [
                "Account pending approval ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-accent" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 mt-1 text-xs leading-relaxed", children: "Your sign-up request has been sent to the ANO and senior admins. Once they approve your account, you'll be able to sign in and join the unit. We'll see you on parade soon, cadet!" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: onClose,
              size: "lg",
              className: "mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-elegant",
              children: "Got it — back to sign in"
            }
          )
        ]
      }
    )
  ] });
}
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const MICROSOFT_CLIENT_ID = "YOUR_MICROSOFT_CLIENT_ID";
const generateRandomString = (length = 32) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Array.from(window.crypto.getRandomValues(new Uint8Array(length / 2))).map((b) => b.toString(16).padStart(2, "0")).join("");
};
const ensureGoogleAuth = async () => {
  if (window.gapi?.auth2) return window.gapi.auth2;
  await new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[src='https://apis.google.com/js/api.js']");
    if (existingScript) {
      if (window.gapi) {
        window.gapi.load("auth2", { callback: () => resolve(), onerror: reject });
        return;
      }
    }
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.gapi) return reject(new Error("Google API failed to load."));
      window.gapi.load("auth2", { callback: () => resolve(), onerror: reject });
    };
    script.onerror = () => reject(new Error("Failed to load Google API script."));
    document.head.appendChild(script);
  });
  return window.gapi.auth2;
};
const getGoogleIdToken = async () => {
  const auth2 = await ensureGoogleAuth();
  const instance = auth2.getAuthInstance ? auth2.getAuthInstance() : null;
  const googleAuth = instance || await auth2.init({
    client_id: GOOGLE_CLIENT_ID,
    scope: "openid email profile"
  });
  const googleUser = await googleAuth.signIn();
  const idToken = googleUser?.getAuthResponse()?.id_token;
  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }
  return idToken;
};
const parseHash = (hash) => {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    id_token: params.get("id_token"),
    access_token: params.get("access_token"),
    state: params.get("state"),
    error: params.get("error"),
    error_description: params.get("error_description")
  };
};
const openMicrosoftAuthPopup = async (url, expectedState) => {
  const popup = window.open(url, "_blank", "width=500,height=700");
  if (!popup) {
    throw new Error("Unable to open Microsoft login popup.");
  }
  return new Promise((resolve, reject) => {
    const interval = window.setInterval(() => {
      if (!popup || popup.closed) {
        window.clearInterval(interval);
        reject(new Error("Microsoft login popup was closed."));
        return;
      }
      let hash = "";
      try {
        if (popup.location.origin === window.location.origin) {
          hash = popup.location.hash;
        }
      } catch {
        return;
      }
      if (!hash) return;
      const { id_token, access_token, state, error, error_description } = parseHash(hash);
      if (error) {
        popup.close();
        window.clearInterval(interval);
        reject(new Error(error_description ?? error));
        return;
      }
      if (!id_token) return;
      if (state !== expectedState) {
        popup.close();
        window.clearInterval(interval);
        reject(new Error("Microsoft login state mismatch."));
        return;
      }
      popup.close();
      window.clearInterval(interval);
      resolve({ idToken: id_token, accessToken: access_token ?? void 0 });
    }, 250);
  });
};
const getMicrosoftIdToken = async () => {
  const state = generateRandomString();
  const nonce = generateRandomString();
  const redirectUri = window.location.origin;
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    response_type: "id_token",
    redirect_uri: redirectUri,
    response_mode: "fragment",
    scope: "openid profile email",
    nonce,
    state,
    prompt: "select_account"
  });
  const endpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  const { idToken, accessToken } = await openMicrosoftAuthPopup(endpoint, state);
  return { idToken, accessToken, nonce };
};
function Landing() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [celebrate, setCelebrate] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/dashboard"
    });
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    const flag = sessionStorage.getItem("vmkv_just_signed_up");
    if (flag) {
      sessionStorage.removeItem("vmkv_just_signed_up");
      setCelebrate({
        name: flag
      });
    }
  }, []);
  const checkApproval = async (uid) => {
    const {
      data
    } = await supabase.from("profiles").select("approval_status").eq("id", uid).maybeSingle();
    return data?.approval_status ?? "pending";
  };
  const onGoogle = async () => {
    setBusy(true);
    sessionStorage.setItem("vmkv_oauth_attempt", "1");
    try {
      const idToken = await getGoogleIdToken();
      const {
        error
      } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken
      });
      if (error) {
        throw error;
      }
      await handlePostAuth();
    } catch (err) {
      toast.error(err?.message ?? "Google sign-in failed");
      setBusy(false);
    }
  };
  const onMicrosoft = async () => {
    setBusy(true);
    sessionStorage.setItem("vmkv_oauth_attempt", "1");
    try {
      const {
        idToken,
        accessToken,
        nonce
      } = await getMicrosoftIdToken();
      const {
        error
      } = await supabase.auth.signInWithIdToken({
        provider: "azure",
        token: idToken,
        access_token: accessToken,
        nonce
      });
      if (error) {
        throw error;
      }
      await handlePostAuth();
    } catch (err) {
      toast.error(err?.message ?? "Microsoft sign-in failed");
      setBusy(false);
    }
  };
  const handlePostAuth = async () => {
    const {
      data: {
        user: u
      }
    } = await supabase.auth.getUser();
    if (!u) return;
    const {
      data: userRoles
    } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
    const isAdmin = userRoles?.some((r) => r.role === "ano" || r.role === "main_senior") ?? false;
    const status = await checkApproval(u.id);
    if (!isAdmin && status !== "approved") {
      const {
        data: prof
      } = await supabase.from("profiles").select("full_name, welcomed_at").eq("id", u.id).maybeSingle();
      await supabase.auth.signOut();
      if (!prof?.welcomed_at) {
        await supabase.from("profiles").update({
          welcomed_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", u.id);
        setCelebrate({
          name: prof?.full_name || u.user_metadata?.full_name || ""
        });
      } else {
        toast.error(status === "rejected" ? "Your account was rejected. Please contact the ANO." : "Your account is pending admin approval.");
      }
      setBusy(false);
      return;
    }
    navigate({
      to: "/dashboard"
    });
  };
  const onEmailLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    await handlePostAuth();
  };
  const onEmailSignup = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: name
        }
      }
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    const {
      data: {
        user: u
      }
    } = await supabase.auth.getUser();
    if (u) {
      await supabase.from("profiles").update({
        welcomed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", u.id);
      await supabase.auth.signOut();
    }
    setBusy(false);
    setCelebrate({
      name
    });
  };
  if (celebrate) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeCelebration, { name: celebrate.name, onClose: () => setCelebrate(null) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bg, alt: "", className: "absolute inset-0 h-full w-full object-cover opacity-25", loading: "eager" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-hero" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 flex flex-col items-center justify-center px-4 py-10 text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "VMKV Cadets emblem", className: "h-32 w-auto object-contain drop-shadow-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-bold tracking-tight", children: "VMKV NCC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent font-semibold tracking-widest text-sm mt-1", children: "VMKV CADETS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm opacity-80 max-w-xs", children: "11 Tamil Nadu Signal Company NCC Salem · VMKV Engineering College" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md p-6 shadow-elegant bg-card/95 text-card-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "login", className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", children: "Sign in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Sign up" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "login", className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full", onClick: onGoogle, disabled: busy, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
              " Continue with Google"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full", onClick: onMicrosoft, disabled: busy, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MsIcon, {}),
              " Continue with Microsoft"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-2 text-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-2 relative", children: "or" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-1/2 h-px bg-border -z-0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onEmailLogin, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "w-full", disabled: busy, children: [
              "Sign in ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "signup", className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onEmailSignup, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name2", children: "Full name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name2", required: true, value: name, onChange: (e) => setName(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email2", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email2", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password2", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password2", type: "password", minLength: 8, required: true, value: password, onChange: (e) => setPassword(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: "Create account" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
            " Cadets can sign in via Google, Microsoft, or email. Seniors use IDs issued by ANO."
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "mt-6 text-xs opacity-70 hover:opacity-100 underline-offset-4 hover:underline", children: "Already signed in? Open dashboard" })
    ] })
  ] });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" })
  ] });
}
function MsIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#F25022", d: "M2 2h9.5v9.5H2z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#7FBA00", d: "M12.5 2H22v9.5h-9.5z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#00A4EF", d: "M2 12.5h9.5V22H2z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FFB900", d: "M12.5 12.5H22V22h-9.5z" })
  ] });
}
export {
  Landing as component
};
