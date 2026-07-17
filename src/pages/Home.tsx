import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './admin/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Home() {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'principal') {
    return <AdminDashboard />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Hazrat Aisha Academy</CardTitle>
          <CardDescription>
            You are logged in as {user?.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-content-secondary">
            Welcome to the Teacher Portal. From here you can manage attendance, marks, homework, and view your assigned notices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
