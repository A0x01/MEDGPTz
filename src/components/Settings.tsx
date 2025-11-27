import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Sun,
  Moon,
  Laptop,
  Volume2,
  Mail,
  MessageSquare,
  Calendar,
  Download,
  Trash2
} from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function Settings({ theme, onThemeChange }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    weeklyReports: true,
    achievementAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    autoPlayExplanations: false,
    soundEffects: true,
    defaultQuizMode: 'timed',
    cardsPerSession: 20,
    dailyGoal: 50,
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-primary)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[var(--text-primary)] mb-1">Settings</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage your account preferences and application settings
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <TabsTrigger value="appearance" className="data-[state=active]:bg-[var(--bg-primary)]">
                <Palette className="size-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[var(--bg-primary)]">
                <Bell className="size-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-[var(--bg-primary)]">
                <SettingsIcon className="size-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-[var(--bg-primary)]">
                <User className="size-4 mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Theme</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Choose how MedGPT looks to you. Select a single theme, or sync with your system.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Sun className="size-4 text-[var(--text-primary)]" />
                      <span className="text-sm text-[var(--text-primary)]">Light</span>
                    </div>
                  </button>

                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="bg-[#0F0F0F] rounded-lg p-4 mb-3 border border-[#404040]">
                      <div className="space-y-2">
                        <div className="h-2 bg-[#2F2F2F] rounded w-3/4"></div>
                        <div className="h-2 bg-[#2F2F2F] rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Moon className="size-4 text-[var(--text-primary)]" />
                      <span className="text-sm text-[var(--text-primary)]">Dark</span>
                    </div>
                  </button>

                  <button
                    onClick={() => onThemeChange('system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'system'
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="rounded-lg p-4 mb-3 border border-[var(--border-primary)]" 
                         style={{ 
                           background: 'linear-gradient(135deg, white 50%, #0F0F0F 50%)'
                         }}>
                      <div className="space-y-2">
                        <div className="h-2 bg-[var(--border-primary)] rounded w-3/4"></div>
                        <div className="h-2 bg-[var(--border-primary)] rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Laptop className="size-4 text-[var(--text-primary)]" />
                      <span className="text-sm text-[var(--text-primary)]">System</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Display</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[var(--text-primary)]">Compact mode</Label>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Reduce spacing and padding for more content on screen
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[var(--text-primary)]">High contrast</Label>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Increase contrast for better readability
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Mail className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Email notifications</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Receive email updates about your study progress
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Weekly reports</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Get a summary of your weekly study activity
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyReports: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Bell className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Study reminders</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Daily reminders to keep your study streak going
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.studyReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, studyReminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Achievement alerts</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Get notified when you unlock achievements
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.achievementAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, achievementAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Study Settings</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">
                      Default quiz mode
                    </Label>
                    <Select
                      value={preferences.defaultQuizMode}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, defaultQuizMode: value })
                      }
                    >
                      <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timed">Timed Mode</SelectItem>
                        <SelectItem value="tutor">Tutor Mode</SelectItem>
                        <SelectItem value="untimed">Untimed Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">
                      Flashcards per study session
                    </Label>
                    <Select
                      value={preferences.cardsPerSession.toString()}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, cardsPerSession: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 cards</SelectItem>
                        <SelectItem value="20">20 cards</SelectItem>
                        <SelectItem value="30">30 cards</SelectItem>
                        <SelectItem value="50">50 cards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">
                      Daily question goal
                    </Label>
                    <Input
                      type="number"
                      value={preferences.dailyGoal}
                      onChange={(e) =>
                        setPreferences({ ...preferences, dailyGoal: parseInt(e.target.value) })
                      }
                      className="bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Audio & Effects</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Volume2 className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Sound effects</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Play sounds for correct/incorrect answers
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, soundEffects: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="size-5 text-[var(--text-tertiary)] mt-0.5" />
                      <div>
                        <Label className="text-[var(--text-primary)]">Auto-play explanations</Label>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Automatically show explanations after answering
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.autoPlayExplanations}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, autoPlayExplanations: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">Email</Label>
                    <Input
                      type="email"
                      defaultValue="sarah.chen@medschool.edu"
                      className="bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">Password</Label>
                    <Button variant="outline" className="text-[var(--text-primary)]">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-lg text-[var(--text-primary)] mb-4">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-[var(--text-primary)]">
                    <Download className="size-4 mr-2" />
                    Export all data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[var(--text-primary)]">
                    <Database className="size-4 mr-2" />
                    Clear cache
                  </Button>
                </div>
              </div>

              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
                <h3 className="text-lg text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="size-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
