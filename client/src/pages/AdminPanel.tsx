import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  LayoutDashboard, Users, Building2, Calendar, FileText, Settings,
  Bell, Search, LogOut, ChevronRight, TrendingUp, UserPlus,
  ShieldCheck, Activity, BarChart3, Home, MessageSquare
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Communities', value: '45', change: '+5%', icon: Building2, color: 'from-purple-500 to-pink-500' },
    { title: 'Active Events', value: '23', change: '+8%', icon: Calendar, color: 'from-green-500 to-emerald-500' },
    { title: 'Reports', value: '12', change: '-3%', icon: FileText, color: 'from-orange-500 to-red-500' }
  ];

  const recentUsers = [
    { name: 'John Doe', email: 'john@example.com', role: 'Resident', status: 'Active', joinDate: '2 days ago' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', joinDate: '3 days ago' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Resident', status: 'Pending', joinDate: '5 days ago' },
    { name: 'Sarah Williams', email: 'sarah@example.com', role: 'Resident', status: 'Active', joinDate: '1 week ago' }
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'Alice Brown', time: '5 minutes ago', type: 'user' },
    { action: 'Community created', user: 'Admin', time: '1 hour ago', type: 'community' },
    { action: 'Event published', user: 'Mike Chen', time: '2 hours ago', type: 'event' },
    { action: 'Report submitted', user: 'Emily Rodriguez', time: '3 hours ago', type: 'report' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'communities', label: 'Communities', icon: Building2 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
                <p className="text-xs text-gray-500">Real Estate Community Management</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
                >
                  <Avatar className="w-9 h-9 border-2 border-indigo-500">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Admin</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Admin User</p>
                      <p className="text-sm text-gray-500">admin@gmail.com</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-full">
        {/* LEFT SIDEBAR - Admin Menu */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="w-4 h-4" />
                User Dashboard
              </Button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, Admin! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Recent Users
                  </h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentUsers.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className={`bg-gradient-to-br ${
                                  index % 3 === 0 ? 'from-blue-500 to-cyan-500' :
                                  index % 3 === 1 ? 'from-purple-500 to-pink-500' :
                                  'from-green-500 to-emerald-500'
                                } text-white font-semibold`}>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{user.role}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="border-b border-gray-100">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Recent Activities
                </h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                        activity.type === 'user' ? 'bg-blue-100' :
                        activity.type === 'community' ? 'bg-purple-100' :
                        activity.type === 'event' ? 'bg-green-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'community' && <Building2 className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'event' && <Calendar className="w-5 h-5 text-green-600" />}
                        {activity.type === 'report' && <FileText className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">by {activity.user}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-1">78%</h3>
                <p className="text-white/80 text-sm">Platform Engagement</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-1">342</h3>
                <p className="text-white/80 text-sm">Active Discussions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-1">23</h3>
                <p className="text-white/80 text-sm">Upcoming Events</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
