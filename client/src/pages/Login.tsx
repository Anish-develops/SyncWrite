import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await AuthAPI.login({ email, password });
      login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-surface-ground overflow-y-auto">
      {/* Left Column (60%): Brand Editorial Area */}
      <div className="hidden md:flex md:w-[60%] bg-surface-sunken border-r border-border p-16 flex-col justify-between relative overflow-hidden select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-white font-bold font-mono text-xs">
            SW
          </div>
          <span className="font-bold text-base tracking-tight">SyncWrite</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary leading-tight mb-4">
            Build together.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            The collaborative IDE where teams think in code, pair in real-time, and execute without friction.
          </p>
        </div>

        <div className="text-xs text-text-tertiary font-mono">
          [Industrial Workshop Edition]
        </div>
      </div>

      {/* Right Column (40%): Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-ground">
        <div className="w-full max-w-sm flex flex-col gap-6 text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-1">Sign in</h2>
            <p className="text-xs text-text-secondary">Enter your credentials to access your projects.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="mt-2 w-full font-semibold"
            >
              Sign In
            </Button>
          </form>

          <p className="text-xs text-text-secondary text-center">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent hover:underline">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
