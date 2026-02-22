import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  Crosshair,
  Layers,
  User,
  Mail,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

const benefits = [
  { icon: <Brain size={18} />, text: "AI-powered content generation" },
  { icon: <Target size={18} />, text: "Intelligent lead scoring" },
  { icon: <Crosshair size={18} />, text: "Performance analytics insights" },
  { icon: <Layers size={18} />, text: "Multi-channel campaign management" },
];

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: "", color: "" };
    if (password.length < 6)
      return { level: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { level: 2, label: "Fair", color: "bg-amber-500" };
    return { level: 3, label: "Strong", color: "bg-emerald-500" };
  })();

  const handleSubmit = (e: React.FormEvent) => {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, name);
      navigate("/");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] -ml-36 -mb-36" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              AutoMarketer
            </span>
          </div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-[52px]">
            AI-Powered Platform
          </span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Start growing your
              <br />
              business today
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Join marketers using AI to create better content, faster
              campaigns, and smarter strategies.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="text-blue-400">{item.icon}</div>
                <span className="text-sm text-slate-300 font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "AutoMarketer has transformed how we manage our marketing
              campaigns. The AI content generation saves us 20+ hours per week."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                SK
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sarah Kim</p>
                <p className="text-xs text-slate-500">
                  Head of Marketing, TechCorp
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 relative z-10">
          © {new Date().getFullYear()} AutoMarketer AI. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              AutoMarketer
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Get started with your free AutoMarketer account
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
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
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white pr-10"
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
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
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
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-blue-600">Terms of Service</span> and{" "}
                  <span className="text-blue-600">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
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
                className="text-blue-600 hover:text-blue-700 font-semibold"
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
