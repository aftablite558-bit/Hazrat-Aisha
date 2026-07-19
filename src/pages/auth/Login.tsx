import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import { FirebaseError } from 'firebase/app';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(email, password, rememberMe);
      addToast('Successfully logged in', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            addToast('Invalid email or password', 'error');
            break;
          case 'auth/user-disabled':
            addToast('This account has been disabled', 'error');
            break;
          default:
            addToast('Failed to login. Please try again.', 'error');
        }
      } else {
        addToast('An unexpected error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 text-center font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content ">
          Welcome back
        </h1>
        <p className="text-sm font-body text-content-secondary ">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 font-body">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-content-secondary font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-content-tertiary" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-content-secondary font-medium">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-content-tertiary" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-content-tertiary hover:text-content-secondary focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/20 cursor-pointer"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal text-content-secondary cursor-pointer select-none">
            Remember me
          </Label>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading} size="lg">
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm font-body text-content-secondary">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Request access
        </Link>
      </div>
    </div>
  );
}
