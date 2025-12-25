/**
 * AccountGateModal
 *
 * Modal that triggers when non-logged-in user tries to book.
 * Offers options: Free account, 7-day trial, or Login.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Sparkles,
  LogIn,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock
} from 'lucide-react';

const TRIAL_FEATURES = [
  'Full access to mentor marketplace',
  'Book mentoring sessions',
  'Access learning modules',
  'Track your progress',
  'Community access'
];

export default function AccountGateModal({
  open,
  onOpenChange,
  redirectPath = '/marketplace',
  mentorName = null
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('options'); // 'options', 'signup', 'login', 'trial'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual Supabase auth
      console.log('Login:', { email, password });

      // Mock success - redirect to intended path
      setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        navigate(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual Supabase auth + free account creation
      console.log('Signup:', { name, email, password });

      setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        navigate(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const handleStartTrial = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Integrate Stripe for trial subscription
      console.log('Start 7-day trial:', { name, email, password });

      setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        navigate(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to start trial. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const renderOptions = () => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl text-center">
          {mentorName
            ? `Book a Session with ${mentorName}`
            : 'Join CRNA Club to Continue'
          }
        </DialogTitle>
        <DialogDescription className="text-center">
          Create an account to access the mentor marketplace and book sessions.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 pt-4">
        {/* 7-Day Trial Option - Highlighted */}
        <button
          onClick={() => { resetForm(); setMode('trial'); }}
          className="w-full p-4 rounded-xl border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-yellow-200">
              <Sparkles className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Start 7-Day Free Trial</div>
              <div className="text-sm text-gray-600">
                Full access to everything. No credit card required.
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 mt-1" />
          </div>
        </button>

        {/* Free Account Option */}
        <button
          onClick={() => { resetForm(); setMode('signup'); }}
          className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Create Free Account</div>
              <div className="text-sm text-gray-600">
                Browse mentors, limited features
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 mt-1" />
          </div>
        </button>

        <Separator className="my-4" />

        {/* Already have account */}
        <button
          onClick={() => { resetForm(); setMode('login'); }}
          className="w-full p-3 rounded-xl text-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Already have an account? Log in</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Welcome Back</DialogTitle>
        <DialogDescription>
          Log in to your CRNA Club account
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleLogin} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>

        <button
          type="button"
          onClick={() => setMode('options')}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Back to options
        </button>
      </form>
    </div>
  );

  const renderSignup = () => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Create Free Account</DialogTitle>
        <DialogDescription>
          Join CRNA Club to browse mentors and track your journey
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSignup} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            minLength={8}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <button
          type="button"
          onClick={() => setMode('options')}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Back to options
        </button>
      </form>
    </div>
  );

  const renderTrial = () => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Start Your 7-Day Free Trial</DialogTitle>
        <DialogDescription>
          Full access to everything. Cancel anytime.
        </DialogDescription>
      </DialogHeader>

      {/* Trial benefits */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="text-sm font-medium text-yellow-800 mb-2">
          What's included:
        </div>
        <ul className="space-y-1.5">
          {TRIAL_FEATURES.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-yellow-700">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleStartTrial} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="trial-name">Full Name</Label>
          <Input
            id="trial-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trial-email">Email</Label>
          <Input
            id="trial-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trial-password">Password</Label>
          <Input
            id="trial-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            minLength={8}
          />
        </div>

        {/* Payment info placeholder - Stripe Elements would go here */}
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
          {/* TODO: Add Stripe Elements for payment method */}
          No credit card required to start
        </div>

        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950" disabled={loading}>
          {loading ? 'Starting trial...' : 'Start Free Trial'}
        </Button>

        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          Your trial will automatically convert to $27/month after 7 days unless you cancel.
        </p>

        <button
          type="button"
          onClick={() => setMode('options')}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Back to options
        </button>
      </form>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {mode === 'options' && renderOptions()}
        {mode === 'login' && renderLogin()}
        {mode === 'signup' && renderSignup()}
        {mode === 'trial' && renderTrial()}
      </DialogContent>
    </Dialog>
  );
}
