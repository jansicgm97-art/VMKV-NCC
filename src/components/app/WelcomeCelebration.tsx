import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, PartyPopper } from "lucide-react";
import logo from "@/assets/vmkv-ncc-logo.png";

interface Props {
  name?: string;
  onClose: () => void;
}

export function WelcomeCelebration({ name, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2.5,
        size: 6 + Math.random() * 8,
        hue: [0, 45, 130, 200, 280, 350][i % 6],
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-hero overflow-hidden p-4">
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="absolute -top-6 block rounded-sm"
            style={{
              left: `${c.left}%`,
              width: `${c.size}px`,
              height: `${c.size * 1.6}px`,
              background: `hsl(${c.hue} 90% 60%)`,
              transform: `rotate(${c.rotate}deg)`,
              animation: `confetti-fall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
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
      `}</style>

      <div
        className={`relative w-full max-w-lg text-center text-primary-foreground transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div
          className="mx-auto mb-5"
          style={{ animation: "badge-pop 0.7s ease-out, shimmer 3s ease-in-out 0.7s infinite" }}
        >
          <img src={logo} alt="" className="h-28 w-auto mx-auto object-contain" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur px-4 py-1.5 text-accent text-xs font-bold tracking-widest uppercase mb-3">
          <PartyPopper className="h-3.5 w-3.5" /> Congratulations{name ? `, ${name.split(" ")[0]}` : ""}!
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-lg">
          Welcome to <span className="text-accent">Vinayaka Mission's Kirupananda Variyar</span> Engineering College
        </h1>
        <p className="mt-3 text-sm sm:text-base opacity-95 font-medium">
          and the National Cadet Corps,
          <br className="hidden sm:block" />
          <span className="text-accent">Deemed to be University</span>
        </p>
        <p className="mt-2 text-xs sm:text-sm opacity-90 tracking-wider">
          11 TAMILNADU SIGNAL COMPANY NCC, SALEM
        </p>

        <div className="mt-6 rounded-xl bg-card/15 backdrop-blur border border-white/20 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold flex items-center gap-1">
                Account pending approval <Sparkles className="h-3.5 w-3.5 text-accent" />
              </p>
              <p className="opacity-90 mt-1 text-xs leading-relaxed">
                Your sign-up request has been sent to the ANO and senior admins.
                Once they approve your account, you'll be able to sign in and
                join the unit. We'll see you on parade soon, cadet!
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          size="lg"
          className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-elegant"
        >
          Got it — back to sign in
        </Button>
      </div>
    </div>
  );
}