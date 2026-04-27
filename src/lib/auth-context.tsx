import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "ano" | "main_senior" | "senior" | "cadet";

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  regimental_number: string | null;
  rank: string | null;
  photo_url: string | null;
  bio: string | null;
  profile_completed: boolean;
}

interface AuthCtx {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isAno: boolean;
  isSeniorOrAbove: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AppCtxLike>(null as unknown as AppCtxLike);
type AppCtxLike = AuthCtx;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRoles = async (uid: string) => {
    const [{ data: prof }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((prof as ProfileRow | null) ?? null);
    setRoles(((rs ?? []) as { role: AppRole }[]).map((r) => r.role));
  };

  const refresh = async () => {
    if (user) await loadProfileAndRoles(user.id);
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // defer to avoid deadlock
        setTimeout(() => {
          loadProfileAndRoles(sess.user.id);
        }, 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfileAndRoles(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAno = roles.includes("ano");
  const isAdmin = isAno || roles.includes("main_senior");
  const isSeniorOrAbove = isAdmin || roles.includes("senior");

  const value: AuthCtx = {
    session,
    user,
    profile,
    roles,
    loading,
    isAdmin,
    isAno,
    isSeniorOrAbove,
    refresh,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}