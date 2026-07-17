import React, { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import { FirebaseError } from 'firebase/app';
import { motion } from 'motion/react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      setIsSubmitted(true);
      addToast('Password reset email sent', 'success');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            // For security reasons, don't reveal if user exists, just show success
            setIsSubmitted(true);
            break;
          case 'auth/invalid-email':
            addToast('Invalid email address', 'error');
            break;
          default:
            addToast('Failed to send reset email. Please try again.', 'error');
        }
      } else {
        addToast('An unexpected error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center font-body"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-success-500/10 p-4">
            <CheckCircle2 className="h-10 w-10 text-success-500" />
          </div>
        </div>
        
        <div className="space-y-2 font-display">
          <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
            Check your email
          </h1>
          <p className="text-sm font-body text-content-secondary">
            We've sent a password reset link to <br />
            <span className="font-semibold text-content">{email}</span>
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link to="/login">
              Back to login
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6 font-body">
      <div className="w-full min-w-0 space-y-2 text-center font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
          Reset password
        </h1>
        <p className="text-sm font-body text-content-secondary">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4">
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

        <Button type="submit" className="w-full mt-2" isLoading={isLoading} size="lg">
          Send reset link
        </Button>
      </form>

      <div className="text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm font-semibold text-content-secondary hover:text-content transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
