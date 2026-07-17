/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/toast-container';
import { Layout } from './components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { OfflineIndicator } from './components/ui/OfflineIndicator';

// Routing
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { GuestRoute } from './components/routing/GuestRoute';

// Auth Layout
import { AuthLayout } from './components/layout/AuthLayout';

// Public Layout
import { PublicLayout } from './pages/public/PublicLayout';

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const LayoutDebug = lazy(() => import('./pages/debug/LayoutDebug'));
const StaffLogin = lazy(() => import('./pages/auth/StaffLogin').then(m => ({ default: m.StaffLogin })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const Unauthorized = lazy(() => import('./pages/auth/Unauthorized').then(m => ({ default: m.Unauthorized })));

// Student Pages
const StudentList = lazy(() => import('./pages/students/StudentList').then(m => ({ default: m.StudentList })));
const StudentForm = lazy(() => import('./pages/students/StudentForm').then(m => ({ default: m.StudentForm })));
const StudentDetails = lazy(() => import('./pages/students/StudentDetails').then(m => ({ default: m.StudentDetails })));

// Staff Pages
const StaffList = lazy(() => import('./pages/staff/StaffList').then(m => ({ default: m.StaffList })));
const StaffForm = lazy(() => import('./pages/staff/StaffForm').then(m => ({ default: m.StaffForm })));
const StaffDetails = lazy(() => import('./pages/staff/StaffDetails').then(m => ({ default: m.StaffDetails })));

// Modules
const AttendanceDashboard = lazy(() => import('./pages/attendance/AttendanceDashboard').then(m => ({ default: m.AttendanceDashboard })));
const AdmissionDashboard = lazy(() => import('./pages/admissions/AdmissionDashboard').then(m => ({ default: m.AdmissionDashboard })));
const AdmissionForm = lazy(() => import('./pages/admissions/AdmissionForm').then(m => ({ default: m.AdmissionForm })));
const FeeDashboard = lazy(() => import('./pages/fees/FeeDashboard').then(m => ({ default: m.FeeDashboard })));

// Exams
const ExamDashboard = lazy(() => import('./pages/exams/ExamDashboard').then(m => ({ default: m.ExamDashboard })));
const ExamForm = lazy(() => import('./pages/exams/ExamForm').then(m => ({ default: m.ExamForm })));
const MarksEntry = lazy(() => import('./pages/exams/MarksEntry').then(m => ({ default: m.MarksEntry })));
const ResultPublish = lazy(() => import('./pages/exams/ResultPublish').then(m => ({ default: m.ResultPublish })));
const ReportCard = lazy(() => import('./pages/exams/ReportCard').then(m => ({ default: m.ReportCard })));
const ResultPortal = lazy(() => import('./pages/public/ResultPortal').then(m => ({ default: m.ResultPortal })));

// Public Pages
const PublicHome = lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/public/about/About').then(m => ({ default: m.About })));
const Academics = lazy(() => import('./pages/public/academics/Academics').then(m => ({ default: m.Academics })));
const Gallery = lazy(() => import('./pages/public/gallery/Gallery').then(m => ({ default: m.Gallery })));
const Notices = lazy(() => import('./pages/public/notices/Notices').then(m => ({ default: m.Notices })));
const Contact = lazy(() => import('./pages/public/contact/Contact').then(m => ({ default: m.Contact })));
const AdmissionsInfo = lazy(() => import('./pages/public/AdmissionsInfo').then(m => ({ default: m.AdmissionsInfo })));
const FeeStructure = lazy(() => import('./pages/public/FeeStructure').then(m => ({ default: m.FeeStructure })));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/public/TermsConditions').then(m => ({ default: m.TermsConditions })));

// Settings
const SettingsDashboard = lazy(() => import('./pages/settings/SettingsDashboard').then(m => ({ default: m.SettingsDashboard })));
const GeneralSettings = lazy(() => import('./pages/settings/GeneralSettings').then(m => ({ default: m.GeneralSettings })));
const UserManagement = lazy(() => import('./pages/settings/UserManagement').then(m => ({ default: m.UserManagement })));
const SystemLogs = lazy(() => import('./pages/settings/SystemLogs').then(m => ({ default: m.SystemLogs })));
const BackupRestore = lazy(() => import('./pages/settings/BackupRestore').then(m => ({ default: m.BackupRestore })));
const SecuritySettings = lazy(() => import('./pages/settings/SecuritySettings').then(m => ({ default: m.SecuritySettings })));

export default function App() {
  return (
    <ThemeProvider defaultTheme="obsidian">
      <ToastProvider>
        <ToastContainer />
        <AuthProvider>
          <OfflineIndicator />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              <Route path="/debug" element={<LayoutDebug />} />
              {/* Public Website */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<PublicHome />} />
                <Route path="about" element={<About />} />
                <Route path="academics" element={<Academics />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="notices" element={<Notices />} />
                <Route path="contact" element={<Contact />} />
                <Route path="results" element={<ResultPortal />} />
                <Route path="admissions-info" element={<AdmissionsInfo />} />
                <Route path="fee-structure" element={<FeeStructure />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
              </Route>

              {/* Guest routes (accessible only when NOT logged in) */}
              <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/staff-login" element={<StaffLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
              </Route>

              {/* Special auth route (accessible when logged in but not verified) */}
              <Route element={<AuthLayout />}>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Route>

              {/* Protected admin routes */}
              <Route element={<ProtectedRoute requireVerified allowedRoles={['admin', 'principal', 'teacher']} />}>
                <Route path="/dashboard" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="students">
                    <Route index element={<StudentList />} />
                    <Route path="new" element={<StudentForm />} />
                    <Route path=":id" element={<StudentDetails />} />
                    <Route path=":id/edit" element={<StudentForm />} />
                  </Route>
                  <Route path="staff">
                    <Route index element={<StaffList />} />
                    <Route path="new" element={<StaffForm />} />
                    <Route path=":id" element={<StaffDetails />} />
                    <Route path=":id/edit" element={<StaffForm />} />
                  </Route>
                  <Route path="attendance" element={<AttendanceDashboard />} />
                  <Route path="admissions">
                    <Route index element={<AdmissionDashboard />} />
                    <Route path="new" element={<AdmissionForm />} />
                  </Route>
                  <Route path="fees/*" element={<FeeDashboard />} />
                  <Route path="exams">
                    <Route index element={<ExamDashboard />} />
                    <Route path="new" element={<ExamForm />} />
                    <Route path=":id/edit" element={<ExamForm />} />
                    <Route path=":id/marks" element={<MarksEntry />} />
                    <Route path=":id/publish" element={<ResultPublish />} />
                    <Route path=":examId/report-card/:studentId" element={<ReportCard />} />
                  </Route>
                  <Route path="academics" element={<div className="p-8">Academics module coming soon</div>} />
                  <Route path="calendar" element={<div className="p-8">Calendar module coming soon</div>} />
                  <Route path="messages" element={<div className="p-8">Messages module coming soon</div>} />
                  <Route path="settings" element={<SettingsDashboard />}>
                    <Route index element={<Navigate to="general" replace />} />
                    <Route path="general" element={<GeneralSettings />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="security" element={<SecuritySettings />} />
                    <Route path="backups" element={<BackupRestore />} />
                    <Route path="logs" element={<SystemLogs />} />
                  </Route>
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

