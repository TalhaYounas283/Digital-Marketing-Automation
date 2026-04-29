import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  TrendingUp,
  Star,
  Shield,
  CheckCircle2,
  Activity,
  Users,
} from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleForgotPassword = () => {
    if (!email) {
      showToast("Enter your email first", {
        variant: "warning",
        description: "We need your email to send the reset link.",
      });
      return;
    }
    showToast("Reset link sent", {
      variant: "success",
      description: `Check ${email} for instructions.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const name = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      login(email, name);
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel — Branded marketing canvas with stylized dashboard mockup */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
        {/* Ambient glow shapes */}
        <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] bg-indigo-500/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-fuchsia-500/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-cyan-400/10 rounded-full blur-[90px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/40">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tracking-tight">
                AutoMarketer
              </div>
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">
                AI Marketing Suite
              </div>
            </div>
          </div>

          {/* Hero copy + dashboard mockup */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  Trusted by 500+ marketing teams
                </span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                Marketing on
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  autopilot.
                </span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-md">
                Generate content, automate campaigns, and turn data into growth
                — all from one intelligent workspace.
              </p>
            </div>

            {/* Dashboard mockup — pure CSS/JSX, no image asset */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-cyan-500/40 rounded-2xl blur-2xl opacity-60" />
              <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 px-3 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 font-mono">
                    automarketer.app/dashboard
                  </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "Reach", val: "248K", color: "text-indigo-300" },
                    { label: "Engage", val: "12.4%", color: "text-fuchsia-300" },
                    { label: "ROI", val: "4.8×", color: "text-emerald-300" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white/5 border border-white/10 rounded-lg p-2.5"
                    >
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        {s.label}
                      </div>
                      <div className={`text-lg font-bold ${s.color}`}>
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake chart */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-semibold text-slate-300">
                      Engagement, last 30 days
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
                      <TrendingUp size={10} /> +18.4%
                    </div>
                  </div>
                  <svg viewBox="0 0 200 50" className="w-full h-12">
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,40 L20,32 L40,36 L60,24 L80,28 L100,18 L120,22 L140,12 L160,16 L180,8 L200,12 L200,50 L0,50 Z"
                      fill="url(#g1)"
                    />
                    <path
                      d="M0,40 L20,32 L40,36 L60,24 L80,28 L100,18 L120,22 L140,12 L160,16 L180,8 L200,12"
                      stroke="#c4b5fd"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Activity row */}
                <div className="space-y-1.5">
                  {[
                    {
                      icon: <Activity size={10} />,
                      text: "Campaign “Spring Launch” published",
                      time: "2m",
                    },
                    {
                      icon: <Users size={10} />,
                      text: "32 new leads scored",
                      time: "14m",
                    },
                    {
                      icon: <CheckCircle2 size={10} />,
                      text: "Email sequence completed",
                      time: "1h",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-md px-2.5 py-1.5"
                    >
                      <div className="text-indigo-300">{item.icon}</div>
                      <div className="flex-1 text-[10px] text-slate-300">
                        {item.text}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer badges */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-amber-300 text-amber-300"
                />
              ))}
              <span className="text-xs text-slate-300 ml-1.5 font-semibold">
                4.9 / 5
              </span>
              <span className="text-xs text-slate-500">on G2</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Shield size={12} className="text-emerald-400" />
              <span>SOC 2 · GDPR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              AutoMarketer
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to continue managing your campaigns.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
