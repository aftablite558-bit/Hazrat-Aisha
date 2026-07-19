import React from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { Settings, Users, Shield, Database, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { name: 'General Settings', path: 'general', icon: Settings },
  { name: 'User Management', path: 'users', icon: Users },
  { name: 'Security', path: 'security', icon: Shield },
  { name: 'Backup & Restore', path: 'backups', icon: Database },
  { name: 'System Logs', path: 'logs', icon: Activity },
];

export function SettingsDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  
  // RBAC for settings - Only admins can see all settings
  const navItems = user?.role === 'admin' 
    ? adminNavItems 
    : [
        // Principals or teachers see general settings in read-only mode,
        // or just don't have access at all.
        { name: 'General Settings', path: 'general', icon: Settings }
      ];

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">System Administration</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname.endsWith(`/settings/${item.path}`) || (item.path === 'general' && location.pathname.endsWith('/settings'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
