import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { UserService } from '../../services/user.service';
import { useToast } from '../../context/ToastContext';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
      await UserService.submitRegistrationRequest(email, password, name, 'student');
      addToast('Registration request submitted successfully!', 'success');
      setIsSubmitted(true);
    } catch (error: any) {
      addToast(error.message || 'Failed to submit registration request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-white/10 dark:bg-black/20';
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

  if (isSubmitted) {
    return (
      <div className="w-full space-y-6 text-center font-body py-4">
        <div className="w-16 h-16 bg-emerald-500/10 dark:bg-sky-500/10 text-emerald-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 dark:border-sky-500/20">
          <User className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-content">
            Request Submitted!
          </h1>
          <p className="text-sm text-content-secondary max-w-sm mx-auto leading-relaxed">
            Aapki registration request submit ho chuki hai. Admin ya Principal ke approve karne ke baad aap login kar sakenge.
          </p>
        </div>

        <div className="pt-4">
          <Button onClick={() => navigate('/login')} className="w-full" size="lg">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 text-center font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
          Create an account
        </h1>
        <p className="text-sm font-body text-content-secondary">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 font-body">
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
                      passwordStrength >= level ? getStrengthColor() : 'bg-white/10 dark:bg-black/20/40'
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
