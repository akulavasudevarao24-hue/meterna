import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type AuthMode = "login" | "register";
type PhoneStep = "enter" | "verify";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/recommend";
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("enter");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setPhoneStep("enter");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    const normalized = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
    if (!normalized || normalized.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: normalized,
        options: { channel: "sms" },
      });
      if (err) throw err;
      setPhoneStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    const normalized = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;

    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        phone: normalized,
        token: otp,
        type: "sms",
      });
      if (err) throw err;
      if (data.session) navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password || password.length < 6) {
      setError(mode === "register" ? "Password must be at least 6 characters" : "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
        if (err) throw err;
        setError(null);
        navigate(redirectTo, { replace: true });
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f0] via-[#f9ebe3] to-[#f5d5c5] p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[420px] p-10 rounded-2xl bg-white/95 backdrop-blur shadow-2xl border border-[#f1e5dc]"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e76f51] to-[#f4a261] bg-clip-text text-transparent">
            Materna AI
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Welcome back to your maternal care assistant" : "Create your account"}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full h-11 border-[#f1e5dc] hover:bg-[#fdf6f0]"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#f1e5dc]" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-[#f1e5dc]" />
        </div>

        {/* Phone OTP */}
        <div className="space-y-3 mb-6">
          <Label className="text-foreground">Phone (SMS OTP)</Label>
          {phoneStep === "enter" ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={handleSendPhoneOtp}
                disabled={loading}
                className="bg-gradient-to-r from-[#e76f51] to-[#f4a261] hover:opacity-90"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="justify-center gap-1">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="border-[#f1e5dc]" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setPhoneStep("enter"); setOtp(""); setError(null); }}
                  disabled={loading}
                >
                  Change number
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-[#e76f51] to-[#f4a261]"
                  onClick={handleVerifyPhoneOtp}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#f1e5dc]" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-[#f1e5dc]" />
        </div>

        {/* Email + Password */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={mode === "register" ? "Min 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-[#e76f51] to-[#f4a261] hover:opacity-90"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-[#e76f51] hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By continuing, you agree to Materna AI's Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
