import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Hexagon, ArrowRight } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email, name);
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-3 rounded-xl text-white shadow-lg">
            <Hexagon size={32} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 font-display mb-2">
          Create Account
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Join AutoMarketer AI today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            size="lg"
            icon={!isLoading && <ArrowRight size={20} />}
            className="mt-6"
          >
            Get Started
          </Button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
