import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Eye,
  EyeOff,
  Check,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Layers,
  Star,
} from "lucide-react";

const benefits = [
  {
    icon: <Zap size={14} />,
    label: "Free 14-day trial",
    sub: "No credit card required",
  },
  {
    icon: <Target size={14} />,
    label: "AI-powered insights",
    sub: "Generate, score, and optimize",
  },
  {
    icon: <Layers size={14} />,
    label: "Unified workspace",
    sub: "Social, email, and leads in one place",
  },
];

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: "", color: "" };
    if (password.length < 8)
      return { level: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 12)
      return { level: 2, label: "Fair", color: "bg-amber-500" };
    return { level: 3, label: "Strong", color: "bg-emerald-500" };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel — Branded marketing canvas */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
        {/* Ambient glow shapes */}
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-fuchsia-500/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-indigo-500/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-400/10 rounded-full blur-[90px]" />

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

          {/* Hero copy + benefit cards + testimonial */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 backdrop-blur mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-200 tracking-wide">
                  Free 14-day trial · No credit card
                </span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                Start growing
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  in minutes.
                </span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-md">
                Join marketing teams using AutoMarketer to ship campaigns
                faster, qualify leads automatically, and turn data into growth.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2.5">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-indigo-200">
                    {b.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">
                      {b.label}
                    </div>
                    <div className="text-xs text-slate-400">{b.sub}</div>
                  </div>
                  <Check size={16} className="text-emerald-400" />
                </div>
              ))}
            </div>

            {/* Testimonial card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/30 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-amber-300 text-amber-300"
                    />
                  ))}
                </div>
                <p className="text-slate-200 text-sm italic leading-relaxed mb-4">
                  "AutoMarketer cut our content production time by 70%. The AI
                  recommendations alone pay for themselves every week."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    SK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Sarah Kim
                    </p>
                    <p className="text-xs text-slate-400">
                      Head of Marketing · TechCorp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer trust badges */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Shield size={12} className="text-emerald-400" />
              <span>SOC 2 · GDPR compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp size={12} className="text-indigo-300" />
              <span>500+ marketing teams</span>
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
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Get started with your free AutoMarketer workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all bg-white"
                />
              </div>
            </div>

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
                  placeholder="Min. 8 characters"
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
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength.level
                            ? passwordStrength.color
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 border rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 outline-none transition-all bg-white pr-10 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                {confirmPassword && confirmPassword === password && (
                  <Check
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                )}
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-indigo-600">Terms of Service</span> and{" "}
                  <span className="text-indigo-600">Privacy Policy</span>
                </span>
              </label>
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
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
