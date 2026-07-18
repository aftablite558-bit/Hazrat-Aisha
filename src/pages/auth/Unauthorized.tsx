import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { authService } from '../../services/auth.service';

export function Unauthorized() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="w-full space-y-6 text-center font-body">
      <div className="flex justify-center">
        <div className="rounded-full bg-danger-500/10 p-4">
          <ShieldAlert className="h-10 w-10 text-danger-500" />
        </div>
      </div>
      
      <div className="space-y-2 font-display">
        <h1 className="text-[var(--text-h3)] font-bold tracking-tight text-content">
          Access Denied
        </h1>
        <p className="text-sm font-body text-content-secondary max-w-sm mx-auto">
          You do not have permission to access this platform. Only administrators, principals, and teachers are authorized.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button onClick={handleLogout} className="w-full" size="lg">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
