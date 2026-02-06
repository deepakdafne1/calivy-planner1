import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signin'>('login');

  const openAuth = (mode: 'login' | 'signin') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 gradient-primary shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-primary-foreground tracking-wide">CALIVY</h1>
              <p className="text-[10px] text-primary-foreground/70 tracking-widest uppercase">Turning Chaos Into Clarity</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#why" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">
              Why Calivy?
            </a>
            <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">
              Highlights
            </a>
            <Button variant="heroOutline" size="sm" onClick={() => openAuth('login')}>
              Login
            </Button>
            <Button
              variant="hero"
              size="sm"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0"
              onClick={() => openAuth('signin')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
    </>
  );
}
