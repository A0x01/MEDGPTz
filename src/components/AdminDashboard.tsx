import { useState } from 'react';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  FileText,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Shield,
  Database,
  Zap,
  Target,
  Brain,
  Sparkles,
  Globe,
  Calendar,
  Ban,
  Key,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  X
} from 'lucide-react';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { UserDetailDialog, ManageTextbooksDialog, ResetPasswordDialog } from './UserManagementModals';
import { AddContentDialog } from './AddContentDialog';

type AdminView = 'dashboard' | 'users' | 'content' | 'analytics' | 'settings';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  plan: 'free' | 'premium';
  studyHours: number;
  questionsCompleted: number;
  joined: string;
  lastActive: string;
}

interface ContentItem {
  id: string;
  type: 'textbook' | 'question' | 'deck';
  title: string;
  author?: string;
  status: 'active' | 'pending' | 'archived';
  views: number;
  rating: number;
  dateAdded: string;
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isManageTextbooksOpen, setIsManageTextbooksOpen] = useState(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  // Mock data
  const stats = {
    totalUsers: 12847,
    activeUsers: 3421,
    totalSessions: 45678,
    totalQuestions: 234567,
    totalStudyHours: 89234,
    avgSessionTime: 42,
    userGrowth: 12.5,
    engagementRate: 68.3,
    premiumUsers: 2341,
    conversionRate: 18.2
  };

  const usageData = [
    { date: 'Mon', users: 2400, sessions: 4200, questions: 8900 },
    { date: 'Tue', users: 3200, sessions: 5100, questions: 10200 },
    { date: 'Wed', users: 2800, sessions: 4800, questions: 9400 },
    { date: 'Thu', users: 3600, sessions: 6200, questions: 11800 },
    { date: 'Fri', users: 4100, sessions: 7100, questions: 13200 },
    { date: 'Sat', users: 3800, sessions: 6400, questions: 12100 },
    { date: 'Sun', users: 3200, sessions: 5600, questions: 10800 }
  ];

  const topicDistribution = [
    { name: 'Cardiology', value: 18, color: '#EF4444' },
    { name: 'Neurology', value: 15, color: '#8B5CF6' },
    { name: 'Respiratory', value: 12, color: '#3B82F6' },
    { name: 'Gastro', value: 14, color: '#10B981' },
    { name: 'Endocrine', value: 11, color: '#F59E0B' },
    { name: 'Other', value: 30, color: '#6B7280' }
  ];

  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@medschool.edu',
      status: 'active',
      plan: 'premium',
      studyHours: 142,
      questionsCompleted: 2341,
      joined: '2024-09-15',
      lastActive: '2 min ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mchen@hospital.org',
      status: 'active',
      plan: 'free',
      studyHours: 67,
      questionsCompleted: 892,
      joined: '2024-10-03',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'e.rodriguez@med.edu',
      status: 'active',
      plan: 'premium',
      studyHours: 198,
      questionsCompleted: 3102,
      joined: '2024-08-22',
      lastActive: '5 min ago'
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'jwilson@student.edu',
      status: 'inactive',
      plan: 'free',
      studyHours: 23,
      questionsCompleted: 234,
      joined: '2024-11-01',
      lastActive: '3 days ago'
    },
    {
      id: '5',
      name: 'Priya Patel',
      email: 'ppatel@medcenter.org',
      status: 'active',
      plan: 'premium',
      studyHours: 176,
      questionsCompleted: 2789,
      joined: '2024-09-05',
      lastActive: '12 min ago'
    }
  ];

  const contentItems: ContentItem[] = [
    {
      id: '1',
      type: 'textbook',
      title: 'Step Up to Medicine (4th Edition)',
      author: 'Mehta et al.',
      status: 'active',
      views: 8934,
      rating: 4.8,
      dateAdded: '2024-08-15'
    },
    {
      id: '2',
      type: 'textbook',
      title: 'First Aid for Step 2 CK',
      author: 'Le & Bhushan',
      status: 'active',
      views: 12456,
      rating: 4.9,
      dateAdded: '2024-08-10'
    },
    {
      id: '3',
      type: 'question',
      title: 'Cardiology MCQ Bank - 500 Questions',
      status: 'active',
      views: 5623,
      rating: 4.6,
      dateAdded: '2024-09-20'
    },
    {
      id: '4',
      type: 'deck',
      title: 'Neurology Essentials Flashcards',
      author: 'Admin Team',
      status: 'active',
      views: 3421,
      rating: 4.7,
      dateAdded: '2024-10-05'
    },
    {
      id: '5',
      type: 'textbook',
      title: 'Harrison\'s Internal Medicine',
      author: 'Jameson et al.',
      status: 'pending',
      views: 0,
      rating: 0,
      dateAdded: '2024-11-12'
    }
  ];

  const recentActivity = [
    { id: '1', type: 'user_signup', user: 'John Doe', action: 'New user registration', time: '2 min ago', status: 'success' },
    { id: '2', type: 'content_upload', user: 'Admin', action: 'Uploaded "Respiratory Medicine Chapter"', time: '15 min ago', status: 'success' },
    { id: '3', type: 'error', user: 'System', action: 'AI response timeout (resolved)', time: '1 hour ago', status: 'warning' },
    { id: '4', type: 'feedback', user: 'Sarah Johnson', action: 'Rated AI response 5 stars', time: '2 hours ago', status: 'success' },
    { id: '5', type: 'content_flag', user: 'Michael Chen', action: 'Flagged question #2341 for review', time: '3 hours ago', status: 'pending' }
  ];

  const systemHealth = [
    { service: 'API Server', status: 'operational', uptime: '99.98%', responseTime: '145ms' },
    { service: 'Database', status: 'operational', uptime: '99.99%', responseTime: '23ms' },
    { service: 'AI Model (GPT-4)', status: 'operational', uptime: '99.95%', responseTime: '2.3s' },
    { service: 'Vector DB', status: 'operational', uptime: '99.97%', responseTime: '89ms' },
    { service: 'CDN', status: 'degraded', uptime: '98.12%', responseTime: '320ms' }
  ];

  // Render different views
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-primary)]">Dashboard Overview</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor platform performance and key metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-[var(--bg-secondary)] border-[var(--border-primary)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--text-secondary)]">Total Users</CardDescription>
            <CardTitle className="text-3xl text-[var(--text-primary)]">
              {stats.totalUsers.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              <span className="text-sm text-green-500">+{stats.userGrowth}%</span>
              <span className="text-xs text-[var(--text-tertiary)]">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--text-secondary)]">Active Today</CardDescription>
            <CardTitle className="text-3xl text-[var(--text-primary)]">
              {stats.activeUsers.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[#2563EB]" />
              <span className="text-sm text-[var(--text-primary)]">{stats.engagementRate}%</span>
              <span className="text-xs text-[var(--text-tertiary)]">engagement rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--text-secondary)]">Study Hours</CardDescription>
            <CardTitle className="text-3xl text-[var(--text-primary)]">
              {(stats.totalStudyHours / 1000).toFixed(1)}K
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-orange-500" />
              <span className="text-sm text-[var(--text-primary)]">{stats.avgSessionTime}m</span>
              <span className="text-xs text-[var(--text-tertiary)]">avg session</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--text-secondary)]">Premium Users</CardDescription>
            <CardTitle className="text-3xl text-[var(--text-primary)]">
              {stats.premiumUsers.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="size-4 text-purple-500" />
              <span className="text-sm text-[var(--text-primary)]">{stats.conversionRate}%</span>
              <span className="text-xs text-[var(--text-tertiary)]">conversion</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Usage Trends</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Daily active users and sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#2563EB" fillOpacity={1} fill="url(#colorUsers)" name="Active Users" />
                <Area type="monotone" dataKey="sessions" stroke="#10B981" fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Study Topic Distribution</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Most studied medical specialties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="size-5" />
              System Health
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Real-time service status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    {service.status === 'operational' ? (
                      <CheckCircle className="size-5 text-green-500" />
                    ) : service.status === 'degraded' ? (
                      <AlertCircle className="size-5 text-orange-500" />
                    ) : (
                      <XCircle className="size-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{service.service}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{service.responseTime}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={service.status === 'operational' ? 'default' : 'destructive'}
                    className={service.status === 'operational' ? 'bg-green-500/10 text-green-500' : ''}
                  >
                    {service.uptime}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="size-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Latest platform events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                  <div className={`size-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    activity.status === 'pending' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)]">{activity.action}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      {activity.user} • {activity.time}
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

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-primary)]">User Management</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage and monitor user accounts
          </p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#3B82F6] text-white">
          <Plus className="size-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search users by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
          />
        </div>
        <Button variant="outline" className="border-[var(--border-primary)]">
          <Filter className="size-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-[var(--border-primary)]">
          <Download className="size-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Users Table */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--border-primary)]">
              <TableHead className="text-[var(--text-secondary)]">User</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Status</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Plan</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Study Hours</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Questions</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Last Active</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-[var(--border-primary)]">
                <TableCell>
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.plan === 'premium' ? 'default' : 'secondary'}
                    className={user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500' : ''}
                  >
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-[var(--text-primary)]">{user.studyHours}h</TableCell>
                <TableCell className="text-[var(--text-primary)]">{user.questionsCompleted.toLocaleString()}</TableCell>
                <TableCell className="text-[var(--text-tertiary)] text-sm">{user.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[var(--bg-tertiary)] border-[var(--border-primary)]">
                      <DropdownMenuItem className="text-[var(--text-primary)]" onClick={() => { setSelectedUser(user); setIsUserDetailOpen(true); }}>
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--text-primary)]">
                        <Mail className="size-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--text-primary)]">
                        <Edit className="size-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="size-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-primary)]">Content Management</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage textbooks, questions, and flashcard decks
          </p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#3B82F6] text-white" onClick={() => setIsAddContentOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/10 border border-[#93C5FD] dark:border-[#1E40AF]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                <BookOpen className="size-5 text-[#2563EB]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#1E40AF] dark:text-[#93C5FD]">24</CardTitle>
                <CardDescription className="text-[#1E40AF] dark:text-[#DBEAFE]">Textbooks</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] dark:from-[#14532D]/20 dark:to-[#166534]/10 border border-[#86EFAC] dark:border-[#166534]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                <FileText className="size-5 text-[#10B981]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#166534] dark:text-[#86EFAC]">5.2K</CardTitle>
                <CardDescription className="text-[#166534] dark:text-[#DCFCE7]">Questions</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] dark:from-[#78350F]/20 dark:to-[#92400E]/10 border border-[#FCD34D] dark:border-[#92400E]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                <Sparkles className="size-5 text-[#F59E0B]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#92400E] dark:text-[#FCD34D]">342</CardTitle>
                <CardDescription className="text-[#92400E] dark:text-[#FDE68A]">Flashcard Decks</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Content Table */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--border-primary)]">
              <TableHead className="text-[var(--text-secondary)]">Content</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Type</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Status</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Views</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Rating</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Date Added</TableHead>
              <TableHead className="text-[var(--text-secondary)]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentItems.map((item) => (
              <TableRow key={item.id} className="border-[var(--border-primary)]">
                <TableCell>
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{item.title}</p>
                    {item.author && (
                      <p className="text-xs text-[var(--text-tertiary)]">{item.author}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {item.type === 'textbook' && <BookOpen className="size-3 mr-1" />}
                    {item.type === 'question' && <FileText className="size-3 mr-1" />}
                    {item.type === 'deck' && <Brain className="size-3 mr-1" />}
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'active' ? 'default' : item.status === 'pending' ? 'secondary' : 'outline'}
                    className={
                      item.status === 'active' ? 'bg-green-500/10 text-green-500' :
                      item.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-gray-500/10 text-gray-500'
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[var(--text-primary)]">{item.views.toLocaleString()}</TableCell>
                <TableCell>
                  {item.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <Award className="size-4 text-yellow-500" />
                      <span className="text-sm text-[var(--text-primary)]">{item.rating}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--text-tertiary)]">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-[var(--text-tertiary)] text-sm">{item.dateAdded}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[var(--bg-tertiary)] border-[var(--border-primary)]">
                      <DropdownMenuItem className="text-[var(--text-primary)]">
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--text-primary)]">
                        <Edit className="size-4 mr-2" />
                        Edit Content
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[var(--text-primary)]">
                        <Download className="size-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[var(--text-primary)]">Analytics & Insights</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Deep dive into platform usage and performance metrics
        </p>
      </div>

      {/* Questions Answered Over Time */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Questions Answered</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Daily question completion trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="date" stroke="var(--text-tertiary)" />
              <YAxis stroke="var(--text-tertiary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="questions" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-[#2563EB]" />
              <CardDescription className="text-[var(--text-secondary)]">Avg Question Accuracy</CardDescription>
            </div>
            <CardTitle className="text-3xl text-[var(--text-primary)]">74.3%</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-[#F59E0B]" />
              <CardDescription className="text-[var(--text-secondary)]">AI Response Time</CardDescription>
            </div>
            <CardTitle className="text-3xl text-[var(--text-primary)]">2.1s</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-[#10B981]" />
              <CardDescription className="text-[var(--text-secondary)]">Chat Sessions</CardDescription>
            </div>
            <CardTitle className="text-3xl text-[var(--text-primary)]">45.6K</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-[#8B5CF6]" />
              <CardDescription className="text-[var(--text-secondary)]">User Satisfaction</CardDescription>
            </div>
            <CardTitle className="text-3xl text-[var(--text-primary)]">4.7/5</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Top Users by Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.sort((a, b) => b.studyHours - a.studyHours).slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                  </div>
                  <Badge className="bg-[#2563EB]/10 text-[#2563EB]">
                    {user.studyHours}h
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Most Accessed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentItems.sort((a, b) => b.views - a.views).slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{item.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{item.type}</p>
                  </div>
                  <Badge className="bg-[#10B981]/10 text-[#10B981]">
                    {item.views.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[var(--text-primary)]">Settings & Configuration</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage platform settings and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Settings */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Settings className="size-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Maintenance Mode</p>
                <p className="text-xs text-[var(--text-tertiary)]">Disable user access for updates</p>
              </div>
              <Button variant="outline" size="sm">
                Off
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">New User Registration</p>
                <p className="text-xs text-[var(--text-tertiary)]">Allow new sign-ups</p>
              </div>
              <Button variant="outline" size="sm" className="bg-green-500/10 text-green-500">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Email Notifications</p>
                <p className="text-xs text-[var(--text-tertiary)]">Send system emails</p>
              </div>
              <Button variant="outline" size="sm" className="bg-green-500/10 text-green-500">
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Brain className="size-5" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-primary)]">AI Model</label>
              <Select defaultValue="gpt4">
                <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-primary)]">Temperature</label>
              <Input 
                type="number" 
                defaultValue="0.7" 
                step="0.1"
                min="0"
                max="1"
                className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-primary)]">Max Tokens</label>
              <Input 
                type="number" 
                defaultValue="2048"
                className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Shield className="size-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Two-Factor Authentication</p>
                <p className="text-xs text-[var(--text-tertiary)]">Require 2FA for admins</p>
              </div>
              <Button variant="outline" size="sm" className="bg-green-500/10 text-green-500">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">API Rate Limiting</p>
                <p className="text-xs text-[var(--text-tertiary)]">100 requests/min per user</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Session Timeout</p>
                <p className="text-xs text-[var(--text-tertiary)]">Auto logout after inactivity</p>
              </div>
              <Button variant="outline" size="sm">
                30 min
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Database className="size-5" />
              Database Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Last Backup</p>
                <p className="text-xs text-[var(--text-tertiary)]">2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">
                Backup Now
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Database Size</p>
                <p className="text-xs text-[var(--text-tertiary)]">2.4 GB</p>
              </div>
              <Button variant="outline" size="sm">
                Optimize
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Re-index Vector DB</p>
                <p className="text-xs text-[var(--text-tertiary)]">Update embeddings</p>
              </div>
              <Button variant="outline" size="sm">
                Re-index
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border-primary)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border-primary)]">
          <h1 className="text-xl text-[var(--text-primary)] flex items-center gap-2">
            <Shield className="size-6 text-[#2563EB]" />
            MedGPT Admin
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Administrator Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-[#2563EB] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <LayoutDashboard className="size-5" />
            <span className="text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'users'
                ? 'bg-[#2563EB] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Users className="size-5" />
            <span className="text-sm">Users</span>
          </button>

          <button
            onClick={() => setCurrentView('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'content'
                ? 'bg-[#2563EB] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <BookOpen className="size-5" />
            <span className="text-sm">Content</span>
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'analytics'
                ? 'bg-[#2563EB] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <BarChart3 className="size-5" />
            <span className="text-sm">Analytics</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'settings'
                ? 'bg-[#2563EB] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Settings className="size-5" />
            <span className="text-sm">Settings</span>
          </button>
        </nav>

        {/* Admin Info */}
        <div className="p-4 border-t border-[var(--border-primary)]">
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="size-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)] truncate">Admin User</p>
              <p className="text-xs text-[var(--text-tertiary)]">admin@medgpt.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="border-b border-[var(--border-primary)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-[var(--border-primary)]">
                <Globe className="size-4 mr-2" />
                View Live Site
              </Button>
              <Button variant="outline" size="sm" className="border-[var(--border-primary)]">
                <Calendar className="size-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'users' && renderUsers()}
          {currentView === 'content' && renderContent()}
          {currentView === 'analytics' && renderAnalytics()}
          {currentView === 'settings' && renderSettings()}
        </div>
      </div>

      {/* User Management Modals */}
      <UserDetailDialog
        user={selectedUser}
        isOpen={isUserDetailOpen}
        onClose={() => setIsUserDetailOpen(false)}
        onSuspend={(userId) => {
          console.log('Suspend user:', userId);
        }}
        onResetPassword={(userId) => {
          setIsResetPasswordOpen(true);
          setIsUserDetailOpen(false);
        }}
        onManageTextbooks={(userId) => {
          setIsManageTextbooksOpen(true);
          setIsUserDetailOpen(false);
        }}
      />

      <ManageTextbooksDialog
        user={selectedUser}
        isOpen={isManageTextbooksOpen}
        onClose={() => setIsManageTextbooksOpen(false)}
      />

      <ResetPasswordDialog
        user={selectedUser}
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />

      <AddContentDialog
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
      />
    </div>
  );
}