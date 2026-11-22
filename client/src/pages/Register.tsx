import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await AuthAPI.register({ email, username, password });
      login(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Registration failed');
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
            Create shared projects, invite your collaborators with a single link, and code with zero merge conflicts.
          </p>
        </div>

        <div className="text-xs text-text-tertiary font-mono">
          [CRDT • Monaco • Terminal • AI]
        </div>
      </div>

      {/* Right Column (40%): Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-ground">
        <div className="w-full max-w-sm flex flex-col gap-6 text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-1">Create Account</h2>
            <p className="text-xs text-text-secondary">Join SyncWrite to start collaborative coding.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password (min 8 chars, 1 number)"
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
              Get Started
            </Button>
          </form>

          <p className="text-xs text-text-secondary text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
