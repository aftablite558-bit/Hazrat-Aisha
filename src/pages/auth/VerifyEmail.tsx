import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, ArrowRight, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'motion/react';

export function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // If user is already verified, redirect them
    if (firebaseUser?.emailVerified) {
      navigate('/');
    }
    
    // Auto refresh user state periodically to check for verification
    const interval = setInterval(async () => {
      if (firebaseUser) {
        await firebaseUser.reload();
        if (firebaseUser.emailVerified) {
          addToast('Email verified successfully!', 'success');
          navigate('/');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [firebaseUser, navigate, addToast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      await authService.resendVerificationEmail();
      addToast('Verification email resent', 'success');
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      addToast('Failed to resend verification email', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      addToast('Failed to log out', 'error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6 text-center font-body"
    >
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/15 p-4">
          <Mail className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2 font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
          Verify your email
        </h1>
        <p className="text-sm font-body text-content-secondary max-w-sm mx-auto">
          We've sent a verification link to <br />
          <span className="font-semibold text-content">{firebaseUser?.email}</span>
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-sm text-primary">
        <p>
          Please check your inbox and click the link to verify your email address. 
          This page will automatically update once verified.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <Button 
          onClick={handleResend} 
          variant="secondary" 
          className="w-full"
          disabled={isResending || countdown > 0}
          size="lg"
        >
          {countdown > 0 ? (
            `Resend available in ${countdown}s`
          ) : (
            <>
              <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              Resend verification email
            </>
          )}
        </Button>
        
        <Button 
          onClick={() => firebaseUser?.reload()} 
          className="w-full"
          size="lg"
        >
          I have verified my email
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="pt-4 border-t border-line">
        <button 
          onClick={handleLogout}
          className="inline-flex items-center text-sm font-semibold text-content-secondary hover:text-content transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out and try another account
        </button>
      </div>
    </motion.div>
  );
}
