import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/vmkv-ncc-logo.png";
import bg from "@/assets/auditorium-bg.jpg";
import { Shield, ChevronRight } from "lucide-react";
import { WelcomeCelebration } from "@/components/app/WelcomeCelebration";
import { getGoogleIdToken, getMicrosoftIdToken } from "@/lib/oauth-utils";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Welcome to VMKV NCC" },
      {
        name: "description",
        content:
          "Sign in to VMKV NCC — 11 Tamil Nadu Signal Company NCC Salem, VMKV Engineering College.",
      },
    ],
  }),
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [celebrate, setCelebrate] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  // Detect first-time OAuth signup landing back here and celebrate
  useEffect(() => {
    const flag = sessionStorage.getItem("vmkv_just_signed_up");
    if (flag) {
      sessionStorage.removeItem("vmkv_just_signed_up");
      setCelebrate({ name: flag });
    }
  }, []);

  const checkApproval = async (uid: string): Promise<"approved" | "pending" | "rejected"> => {
    const { data } = await supabase
      .from("profiles")
      .select("approval_status")
      .eq("id", uid)
      .maybeSingle();
    return ((data?.approval_status as "approved" | "pending" | "rejected") ?? "pending");
  };

  const onGoogle = async () => {
    setBusy(true);
    sessionStorage.setItem("vmkv_oauth_attempt", "1");
    try {
      const idToken = await getGoogleIdToken();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) {
        throw error;
      }
      await handlePostAuth();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Google sign-in failed");
      setBusy(false);
    }
  };

  const onMicrosoft = async () => {
    setBusy(true);
    sessionStorage.setItem("vmkv_oauth_attempt", "1");
    try {
      const { idToken, accessToken, nonce } = await getMicrosoftIdToken();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "azure",
        token: idToken,
        access_token: accessToken,
        nonce,
      });
      if (error) {
        throw error;
      }
      await handlePostAuth();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Microsoft sign-in failed");
      setBusy(false);
    }
  };

  const handlePostAuth = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;

    // Check if user has admin roles (ANO or main_senior)
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.id);

    const isAdmin = userRoles?.some(r => r.role === "ano" || r.role === "main_senior") ?? false;

    const status = await checkApproval(u.id);
    if (!isAdmin && status !== "approved") {
      // Was this their very first time? welcomed_at null = yes.
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, welcomed_at")
        .eq("id", u.id)
        .maybeSingle();
      await supabase.auth.signOut();
      if (!prof?.welcomed_at) {
        await supabase.from("profiles").update({ welcomed_at: new Date().toISOString() }).eq("id", u.id);
        setCelebrate({ name: prof?.full_name || u.user_metadata?.full_name || "" });
      } else {
        toast.error(
          status === "rejected"
            ? "Your account was rejected. Please contact the ANO."
            : "Your account is pending admin approval.",
        );
      }
      setBusy(false);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const onEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    await handlePostAuth();
  };

  const onEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    // Try to mark welcomed_at + sign out so they wait for approval
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) {
      await supabase.from("profiles").update({ welcomed_at: new Date().toISOString() }).eq("id", u.id);
      await supabase.auth.signOut();
    }
    setBusy(false);
    setCelebrate({ name });
  };

  if (celebrate) {
    return <WelcomeCelebration name={celebrate.name} onClose={() => setCelebrate(null)} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-10 text-primary-foreground">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="VMKV Cadets emblem"
            className="h-32 w-auto object-contain drop-shadow-2xl"
          />
          <h1 className="mt-4 text-4xl font-bold tracking-tight">VMKV NCC</h1>
          <p className="text-accent font-semibold tracking-widest text-sm mt-1">
            VMKV CADETS
          </p>
          <p className="mt-2 text-sm opacity-80 max-w-xs">
            11 Tamil Nadu Signal Company NCC Salem · VMKV Engineering College
          </p>
        </div>

        <Card className="w-full max-w-md p-6 shadow-elegant bg-card/95 text-card-foreground">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onGoogle}
                  disabled={busy}
                >
                  <GoogleIcon /> Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onMicrosoft}
                  disabled={busy}
                >
                  <MsIcon /> Continue with Microsoft
                </Button>
              </div>
              <div className="relative my-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-2 relative">or</span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-border -z-0" />
              </div>
              <form onSubmit={onEmailLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  Sign in <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 pt-4">
              <form onSubmit={onEmailSignup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name2">Full name</Label>
                  <Input
                    id="name2"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email2">Email</Label>
                  <Input
                    id="email2"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password2">Password</Label>
                  <Input
                    id="password2"
                    type="password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  Create account
                </Button>
              </form>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" /> Cadets can sign in via Google,
                Microsoft, or email. Seniors use IDs issued by ANO.
              </p>
            </TabsContent>
          </Tabs>
        </Card>

        <Link
          to="/dashboard"
          className="mt-6 text-xs opacity-70 hover:opacity-100 underline-offset-4 hover:underline"
        >
          Already signed in? Open dashboard
        </Link>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function MsIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}
