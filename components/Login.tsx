import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, ArrowRight } from 'lucide-react';
import { Input } from './common/Input';
import { Button } from './common/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email, 'Talha Younas'); // Mock login
      navigate('/');
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
        
        <h2 className="text-2xl font-bold text-center text-slate-900 font-display mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Sign in to your automation dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</a>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading}
            fullWidth
            size="lg"
            icon={!isLoading && <ArrowRight size={20} />}
            className="mt-6"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
};