import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Sparkles, Target, BookOpen, TrendingUp } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode: 'login' | 'signin';
}

export default function AuthModal({ open, onOpenChange, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signin'>(initialMode);
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sync mode when initialMode changes
  useState(() => {
    setMode(initialMode);
  });

  const reset = () => {
    setUsername('');
    setAge('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'login') {
      if (!age.trim() || isNaN(Number(age)) || Number(age) < 5 || Number(age) > 100) {
        setError('Please enter a valid age (5-100)');
        return;
      }
      try {
        const user = login(username.trim(), Number(age), password);
        toast({
          title: 'Welcome to Calivy!',
          description: `Your Student ID is ${user.studentId}. Keep it safe!`,
        });
        reset();
        onOpenChange(false);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      }
    } else {
      const result = signin(username.trim(), password);
      if (result.success) {
        toast({ title: result.message });
        reset();
        onOpenChange(false);
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signin' : 'login');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 border-0 shadow-glow">
        <DialogTitle className="sr-only">
          {mode === 'login' ? 'Create Account' : 'Sign In'}
        </DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Left panel - branding */}
          <div className="hidden md:flex gradient-primary p-10 flex-col justify-center items-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-primary-foreground"
                  style={{
                    width: 60 + i * 30,
                    height: 60 + i * 30,
                    top: `${15 + i * 14}%`,
                    left: `${10 + (i % 3) * 30}%`,
                    opacity: 0.1 + i * 0.03,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold mb-1">CALIVY</h2>
              <p className="text-sm text-primary-foreground/70 mb-8">Turning Chaos Into Clarity</p>

              <div className="space-y-3 text-left text-sm">
                {[
                  { icon: Sparkles, text: 'AI-powered study planning' },
                  { icon: Target, text: 'Track goals & streaks' },
                  { icon: BookOpen, text: 'Smart assignment management' },
                  { icon: TrendingUp, text: 'Progress analytics' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-primary-foreground/80">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - form */}
          <div className="p-8 md:p-10 bg-card">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {mode === 'login' ? 'Join Calivy Today!' : 'Welcome Back!'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {mode === 'login'
                ? 'Create your account and start learning smarter'
                : 'Sign in to continue your journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>

              {mode === 'login' && (
                <div>
                  <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={5}
                    max={100}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={mode === 'login' ? 'Create a strong password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}

              <Button type="submit" variant="gradient" className="w-full" size="lg">
                {mode === 'login' ? '✦ Create Account' : 'Sign In'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={toggleMode}
              >
                {mode === 'login'
                  ? 'Already have an account? Sign In'
                  : 'New user? → Login'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
