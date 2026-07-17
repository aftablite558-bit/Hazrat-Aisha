import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import { FirebaseError } from 'firebase/app';
import { UserRole } from '../../types';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Simple password strength calculation
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(email, password, name, role);
      addToast('Account created successfully. Please verify your email.', 'success');
      navigate('/verify-email');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            addToast('An account with this email already exists', 'error');
            break;
          case 'auth/invalid-email':
            addToast('Invalid email address', 'error');
            break;
          case 'auth/weak-password':
            addToast('Password is too weak', 'error');
            break;
          default:
            addToast('Failed to create account. Please try again.', 'error');
        }
      } else {
        addToast('An unexpected error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-line';
    if (passwordStrength === 1) return 'bg-danger-500';
    if (passwordStrength === 2) return 'bg-warning-500';
    if (passwordStrength === 3) return 'bg-info-500';
    return 'bg-success-500';
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="w-full min-w-0 space-y-2 text-center font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
          Create an account
        </h1>
        <p className="text-sm font-body text-content-secondary">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 font-body">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-content-secondary font-medium">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-content-tertiary" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="role" className="text-content-secondary font-medium">Role</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-3 h-5 w-5 text-content-tertiary" />
            <select
              id="role"
              className="flex h-[var(--size-input-md)] w-full rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--space-md)] py-2 pl-10 text-[var(--text-body)] font-normal text-[var(--text-primary)] transition-all duration-[var(--duration-fast)] hover:border-[var(--border-strong)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--bg-surface-overlay)] disabled:text-[var(--text-disabled)]"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={isLoading}
              required
            >
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-content-secondary font-medium">Password</Label>
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
          
          {/* Password Strength Meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength >= level ? getStrengthColor() : 'bg-line/40'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-semibold text-right ${
                passwordStrength <= 1 ? 'text-danger-500' :
                passwordStrength === 2 ? 'text-warning-500' :
                passwordStrength === 3 ? 'text-info-500' :
                'text-success-500'
              }`}>
                {getStrengthLabel()}
              </p>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading} size="lg">
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm font-body text-content-secondary">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
