import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './admin/Dashboard';
import { StudentDashboard } from './students/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'principal') {
    return <AdminDashboard />;
  }

  if (user?.role?.toLowerCase() === 'student') {
    return <StudentDashboard />;
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
