/**
 * Register Form Component
 *
 * Handles new user registration.
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Mail, Lock, Eye, EyeOff, User, Building, Stethoscope, AlertCircle, Check } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    specialty: '',
    institution: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0,
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name || undefined,
        specialty: formData.specialty || undefined,
        institution: formData.institution || undefined,
      });
    } catch (err: any) {
      setError(err.message || err.detail || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
        <p className="text-text-secondary">Start your medical learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <AlertCircle className="size-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-text-primary">Username *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="Choose a username"
              className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary"
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-text-primary">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange('full_name')}
              placeholder="Your full name"
              className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Two columns for specialty and institution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-text-primary">Specialty</Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
              <Input
                id="specialty"
                type="text"
                value={formData.specialty}
                onChange={handleChange('specialty')}
                placeholder="e.g., Internal Medicine"
                className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution" className="text-text-primary">Institution</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
              <Input
                id="institution"
                type="text"
                value={formData.institution}
                onChange={handleChange('institution')}
                placeholder="Your school/hospital"
                className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Create a strong password"
              className="pl-10 pr-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-text-primary">Confirm Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              className="pl-10 bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Requirements */}
        {formData.password.length > 0 && (
          <div className="space-y-2 p-4 bg-bg-secondary rounded-lg border border-border-primary">
            <p className="text-xs text-text-secondary mb-2">Password requirements:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-500' : 'text-text-tertiary'}`}>
                <Check className="size-3" />
                <span>8+ characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-green-500' : 'text-text-tertiary'}`}>
                <Check className="size-3" />
                <span>Uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-green-500' : 'text-text-tertiary'}`}>
                <Check className="size-3" />
                <span>Lowercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-green-500' : 'text-text-tertiary'}`}>
                <Check className="size-3" />
                <span>Number</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.match ? 'text-green-500' : 'text-text-tertiary'}`}>
                <Check className="size-3" />
                <span>Passwords match</span>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !isPasswordValid}
          className="w-full bg-blue-primary hover:bg-blue-hover text-white py-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-primary hover:text-blue-hover font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
