import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Student</CardTitle>
          <CardDescription>
            Your academic dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-content-secondary">
            View your attendance, exam results, and notices here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
