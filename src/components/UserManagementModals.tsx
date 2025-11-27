import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Key,
  Ban,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface LoginHistory {
  id: string;
  date: string;
  time: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  status: 'success' | 'failed';
}

interface UserDetailDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onManageTextbooks: (userId: string) => void;
}

export function UserDetailDialog({ 
  user, 
  isOpen, 
  onClose,
  onSuspend,
  onResetPassword,
  onManageTextbooks 
}: UserDetailDialogProps) {
  if (!user) return null;

  // Mock login history data
  const loginHistory: LoginHistory[] = [
    {
      id: '1',
      date: 'Nov 15, 2024',
      time: '10:45 AM',
      ip: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      device: 'Desktop',
      browser: 'Chrome 119',
      status: 'success'
    },
    {
      id: '2',
      date: 'Nov 15, 2024',
      time: '08:30 AM',
      ip: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      device: 'Mobile',
      browser: 'Safari iOS',
      status: 'success'
    },
    {
      id: '3',
      date: 'Nov 14, 2024',
      time: '11:20 PM',
      ip: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      device: 'Desktop',
      browser: 'Chrome 119',
      status: 'success'
    },
    {
      id: '4',
      date: 'Nov 14, 2024',
      time: '09:15 AM',
      ip: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      device: 'Tablet',
      browser: 'Safari iPadOS',
      status: 'success'
    },
    {
      id: '5',
      date: 'Nov 13, 2024',
      time: '06:45 PM',
      ip: '192.168.1.101',
      location: 'Los Angeles, CA, USA',
      device: 'Desktop',
      browser: 'Chrome 119',
      status: 'failed'
    }
  ];

  const getDeviceIcon = (device: string) => {
    if (device === 'Mobile') return <Smartphone className="size-4" />;
    if (device === 'Tablet') return <Tablet className="size-4" />;
    return <Monitor className="size-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)] text-2xl">User Details</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Comprehensive user information and activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* User Info Card */}
          <Card className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)]">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[var(--text-secondary)]">Full Name</Label>
                  <p className="text-[var(--text-primary)] mt-1">{user.name}</p>
                </div>
                <div>
                  <Label className="text-[var(--text-secondary)]">Email Address</Label>
                  <p className="text-[var(--text-primary)] mt-1">{user.email}</p>
                </div>
                <div>
                  <Label className="text-[var(--text-secondary)]">Account Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                      className={user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-[var(--text-secondary)]">Subscription Plan</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={user.plan === 'premium' ? 'default' : 'secondary'}
                      className={user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500' : ''}
                    >
                      {user.plan}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-[var(--text-secondary)]">Member Since</Label>
                  <p className="text-[var(--text-primary)] mt-1">{user.joined}</p>
                </div>
                <div>
                  <Label className="text-[var(--text-secondary)]">Last Active</Label>
                  <p className="text-[var(--text-primary)] mt-1">{user.lastActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)]">Activity Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-3xl text-[#2563EB] mb-1">{user.studyHours}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Study Hours</p>
                </div>
                <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-3xl text-[#10B981] mb-1">{user.questionsCompleted.toLocaleString()}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Questions Completed</p>
                </div>
                <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-3xl text-[#F59E0B] mb-1">89%</p>
                  <p className="text-sm text-[var(--text-secondary)]">Accuracy Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login History & Devices */}
          <Card className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)]">Login History & Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div 
                    key={login.id} 
                    className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] rounded-lg"
                  >
                    <div className="flex items-center justify-center size-10 bg-[var(--bg-primary)] rounded-lg">
                      {getDeviceIcon(login.device)}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-[var(--text-primary)]">{login.date}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{login.time}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                          <MapPin className="size-3" />
                          {login.ip}
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{login.location}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                          <Chrome className="size-3" />
                          {login.browser}
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{login.device}</p>
                      </div>
                    </div>

                    <div>
                      {login.status === 'success' ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <CheckCircle className="size-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="size-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)]">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    onResetPassword(user.id);
                    toast.success('Password reset email sent successfully');
                  }}
                >
                  <Key className="size-4 mr-2" />
                  Reset Password
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    onManageTextbooks(user.id);
                  }}
                >
                  <BookOpen className="size-4 mr-2" />
                  Manage Textbooks
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    toast.success('Email sent successfully');
                  }}
                >
                  <Mail className="size-4 mr-2" />
                  Send Email
                </Button>

                <Button
                  variant="outline"
                  className="justify-start text-red-500 border-red-500/20 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
                      onSuspend(user.id);
                      toast.success('User suspended successfully');
                      onClose();
                    }
                  }}
                >
                  <Ban className="size-4 mr-2" />
                  Suspend Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ManageTextbooksDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageTextbooksDialog({ user, isOpen, onClose }: ManageTextbooksDialogProps) {
  const [selectedTextbooks, setSelectedTextbooks] = useState<string[]>([
    'step-up',
    'first-aid',
  ]);

  if (!user) return null;

  const textbooks = [
    { id: 'step-up', name: 'Step Up to Medicine (4th Edition)', author: 'Mehta et al.' },
    { id: 'first-aid', name: 'First Aid for Step 2 CK', author: 'Le & Bhushan' },
    { id: 'harrisons', name: "Harrison's Internal Medicine", author: 'Jameson et al.' },
    { id: 'robbins', name: 'Robbins Basic Pathology', author: 'Kumar et al.' },
    { id: 'nelson', name: 'Nelson Textbook of Pediatrics', author: 'Kliegman et al.' },
    { id: 'schwartz', name: 'Schwartz Principles of Surgery', author: 'Brunicardi et al.' },
    { id: 'kaplan', name: 'Kaplan USMLE Step 2 CK Lecture Notes', author: 'Kaplan Medical' },
    { id: 'uworld', name: 'UWorld Step 2 CK Question Bank', author: 'UWorld' },
  ];

  const handleToggleTextbook = (textbookId: string) => {
    setSelectedTextbooks((prev) =>
      prev.includes(textbookId)
        ? prev.filter((id) => id !== textbookId)
        : [...prev, textbookId]
    );
  };

  const handleSave = () => {
    toast.success(`Updated textbook access for ${user.name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Manage Textbook Access</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Select which textbooks {user.name} can chat with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/10 border border-[#93C5FD] dark:border-[#1E40AF] rounded-lg">
            <p className="text-sm text-[#1E40AF] dark:text-[#93C5FD]">
              <strong>Current Plan:</strong> {user.plan === 'premium' ? 'Premium' : 'Free'}
            </p>
            <p className="text-xs text-[#1E40AF] dark:text-[#DBEAFE] mt-1">
              {user.plan === 'premium' 
                ? 'Premium users have access to all textbooks by default'
                : 'Free users are limited to 2 textbooks'}
            </p>
          </div>

          <div className="space-y-2">
            {textbooks.map((textbook) => (
              <div
                key={textbook.id}
                className="flex items-start gap-3 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] hover:border-[#2563EB] transition-colors"
              >
                <Checkbox
                  id={textbook.id}
                  checked={selectedTextbooks.includes(textbook.id)}
                  onCheckedChange={() => handleToggleTextbook(textbook.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={textbook.id}
                    className="text-sm text-[var(--text-primary)] cursor-pointer"
                  >
                    {textbook.name}
                  </label>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{textbook.author}</p>
                </div>
                {selectedTextbooks.includes(textbook.id) && (
                  <Badge className="bg-green-500/10 text-green-500">
                    <CheckCircle className="size-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border-primary)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Selected Textbooks:</span>
              <span className="text-[var(--text-primary)]">{selectedTextbooks.length} / {textbooks.length}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-[#3B82F6] text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ResetPasswordDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordDialog({ user, isOpen, onClose }: ResetPasswordDialogProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [newPassword, setNewPassword] = useState('');

  if (!user) return null;

  const handleReset = () => {
    if (sendEmail) {
      toast.success(`Password reset email sent to ${user.email}`);
    } else {
      if (!newPassword) {
        toast.error('Please enter a new password');
        return;
      }
      toast.success('Password updated successfully');
    }
    onClose();
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Reset Password</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Reset password for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="send-email"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <label htmlFor="send-email" className="text-sm text-[var(--text-primary)] cursor-pointer">
                Send password reset email to user
              </label>
            </div>

            {!sendEmail && (
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[var(--text-primary)]">
                  New Password
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="new-password"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomPassword}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Password must be at least 8 characters long
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-primary)]">
              <strong>User:</strong> {user.name}
            </p>
            <p className="text-sm text-[var(--text-primary)] mt-1">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-[#3B82F6] text-white"
            onClick={handleReset}
          >
            {sendEmail ? 'Send Reset Email' : 'Update Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
