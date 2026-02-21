import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get("redirect") ?? "/recommend";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase client auto-processes OAuth hash; session may be set on next tick
        await new Promise((r) => setTimeout(r, 100));
        const { data: { session }, error: err } = await supabase.auth.getSession();
        if (err) throw err;
        if (session) {
          navigate(redirectTo, { replace: true });
        } else {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          if (code) {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeErr) throw exchangeErr;
            navigate(redirectTo, { replace: true });
          } else {
            navigate("/auth", { replace: true });
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Authentication failed");
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate, redirectTo]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf6f0] via-[#f9ebe3] to-[#f5d5c5]">
        <p className="text-destructive mb-4">{error}</p>
        <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf6f0] via-[#f9ebe3] to-[#f5d5c5]">
      <Loader2 className="w-10 h-10 animate-spin text-[#e76f51]" />
      <p className="mt-4 text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  );
}
