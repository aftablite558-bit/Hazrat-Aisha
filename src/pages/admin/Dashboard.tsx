import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { 
  Users, GraduationCap, BookOpen, UserPlus, 
  CheckCircle2, DollarSign, Wallet, TrendingUp,
  Bell, Activity, Plus, FileText, Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
  { name: 'Aug', revenue: 4000, expenses: 2400 },
  { name: 'Sep', revenue: 3000, expenses: 1398 },
  { name: 'Oct', revenue: 2000, expenses: 9800 },
  { name: 'Nov', revenue: 2780, expenses: 3908 },
  { name: 'Dec', revenue: 1890, expenses: 4800 },
];

const attendanceData = [
  { name: 'Mon', present: 1100, absent: 140 },
  { name: 'Tue', present: 1150, absent: 90 },
  { name: 'Wed', present: 1120, absent: 120 },
  { name: 'Thu', present: 1180, absent: 60 },
  { name: 'Fri', present: 1090, absent: 150 },
];

const admissionsData = [
  { name: 'Week 1', count: 45 },
  { name: 'Week 2', count: 52 },
  { name: 'Week 3', count: 38 },
  { name: 'Week 4', count: 65 },
];

export function AdminDashboard() {
  const { addToast } = useToast();
  const { theme } = useTheme();
  
  const isDark = theme === 'obsidian' || theme === 'midnight';
  const colors = {
    primary: isDark ? '#34F5C5' : '#10352A',
    secondary: isDark ? '#D4AF37' : '#B8860B',
    tertiary: isDark ? '#f87171' : '#dc2626',
    background: isDark ? '#0A1512' : '#ffffff',
    text: isDark ? '#9DBDB1' : '#3D5C51',
    grid: isDark ? '#1E3A2F' : '#DCE7E1',
  };

  const overviewStats = [
    { name: 'Total Students', value: '1,240', icon: Users, change: '+12%', changeType: 'positive', color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Total Teachers', value: '84', icon: GraduationCap, change: '+2', changeType: 'neutral', color: 'text-success-500', bg: 'bg-success-500/10' },
    { name: 'Total Admissions', value: '256', icon: UserPlus, change: '+18%', changeType: 'positive', color: 'text-accent', bg: 'bg-accent/15' },
    { name: 'Total Classes', value: '42', icon: BookOpen, change: '0', changeType: 'neutral', color: 'text-warning-500', bg: 'bg-warning-500/10' },
    { name: "Today's Attendance", value: '92.5%', icon: CheckCircle2, change: '-1.2%', changeType: 'negative', color: 'text-success-500', bg: 'bg-success-500/10' },
    { name: 'Fees Collected', value: '₹4.2M', icon: Wallet, change: '+24%', changeType: 'positive', color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Pending Dues', value: '₹850K', icon: DollarSign, change: '-5%', changeType: 'positive', color: 'text-danger-500', bg: 'bg-danger-500/10' },
    { name: 'Net Revenue', value: '₹3.8M', icon: TrendingUp, change: '+14%', changeType: 'positive', color: 'text-info-500', bg: 'bg-info-500/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-display">
        <div className="space-y-1">
          <h1 className="text-[var(--text-h3)] sm:text-[var(--text-h2)] font-bold tracking-tight text-content">
            Enterprise Dashboard
          </h1>
          <p className="text-sm sm:text-base text-content-secondary">
            Comprehensive overview and analytics for Hazrat Aisha Academy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => addToast('New student form opened.', 'success')}>
            <Plus className="mr-2 h-4 w-4" />
            New Admission
          </Button>
          <Button variant="secondary" onClick={() => addToast('Report generation started.', 'success')}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 grid-cols-2 md:grid-cols-4"
      >
        {overviewStats.map((stat) => (
          <motion.div key={stat.name} variants={itemVariants}>
            <Card className="h-full hover:shadow-e2 transition-all duration-[var(--duration-normal)] border-white/30 hover:border-white/50">
              <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-content-secondary line-clamp-1 font-display">{stat.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-content font-display">{stat.value}</p>
                  </div>
                  <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} border border-[var(--border-default)]`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-body">
                  <span className={
                    stat.changeType === 'positive' ? 'text-success-500 font-bold' : 
                    stat.changeType === 'negative' ? 'text-danger-500 font-bold' : 
                    'text-content-secondary font-medium'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-content-tertiary ml-1 font-medium">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Revenue & Expenses Analytics</CardTitle>
            <CardDescription>Monthly financial performance overview</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.tertiary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.tertiary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: colors.background, borderColor: colors.grid, color: isDark ? '#fff' : '#000', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: colors.text }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={colors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={colors.tertiary} strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Attendance Bar Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Present vs Absent ratio</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: isDark ? '#374151' : '#f3f4f6' }}
                  contentStyle={{ backgroundColor: colors.background, borderColor: colors.grid, borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="present" name="Present" fill={colors.secondary} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="absent" name="Absent" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Admissions Line Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Admissions Growth</CardTitle>
            <CardDescription>New enrollments this month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={admissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: colors.background, borderColor: colors.grid, borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="count" name="Admissions" stroke={colors.primary} strokeWidth={3} dot={{ r: 4, fill: colors.primary, strokeWidth: 2, stroke: colors.background }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notifications & Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 font-display">
            <div>
              <CardTitle>Recent Activities & Notifications</CardTitle>
              <CardDescription>Latest updates across the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary-hover">
              Mark all as read
            </Button>
          </CardHeader>
          <CardContent className="font-body">
            <div className="space-y-6">
              {[
                { icon: Bell, color: 'text-info-500', bg: 'bg-info-500/10', title: 'System Update Completed', desc: 'Enterprise module v2.4 deployed successfully.', time: '10 mins ago' },
                { icon: Wallet, color: 'text-success-500', bg: 'bg-success-500/10', title: 'Large Payment Received', desc: '₹125,000 collected for Term 2 fees.', time: '2 hours ago' },
                { icon: UserPlus, color: 'text-accent', bg: 'bg-accent/15', title: 'New Admissions', desc: '14 new student profiles created by Front Desk.', time: '4 hours ago' },
                { icon: Activity, color: 'text-warning-500', bg: 'bg-warning-500/10', title: 'Low Attendance Alert', desc: 'Grade 8-B reported < 75% attendance today.', time: '5 hours ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`h-10 w-10 shrink-0 rounded-full ${item.bg} flex items-center justify-center ${item.color} border border-[var(--border-default)]`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none text-content">
                      {item.title}
                    </p>
                    <p className="text-sm text-content-secondary">
                      {item.desc}
                    </p>
                    <p className="text-xs font-medium text-content-tertiary">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
