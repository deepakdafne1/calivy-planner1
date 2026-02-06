import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AuthModal from '@/components/landing/AuthModal';

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onLoginClick={() => setAuthOpen(true)} />

      {/* Why Calivy section */}
      <section id="why" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              Why <span className="text-gradient">Calivy</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  emoji: '🎯',
                  title: 'Consistency',
                  desc: 'Build unbreakable study routines with structured weekly planning.',
                },
                {
                  emoji: '🧠',
                  title: 'Cognitive Weights',
                  desc: 'AI prioritizes tasks by difficulty, preventing burnout and maximizing learning.',
                },
                {
                  emoji: '🏆',
                  title: 'Gamification',
                  desc: 'Earn streaks and badges that turn discipline into a rewarding habit.',
                },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Footer */}
      <footer className="gradient-primary py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Ready to turn chaos into clarity?</h2>
          <p className="text-primary-foreground/70 mb-6">Join Calivy today and start executing.</p>
          <button
            onClick={() => setAuthOpen(true)}
            className="px-8 py-3 rounded-lg bg-primary-foreground/20 text-primary-foreground font-semibold hover:bg-primary-foreground/30 transition-colors"
          >
            Get Started — It's Free
          </button>
          <p className="text-primary-foreground/40 text-xs mt-8">© 2026 Calivy. Turning Chaos Into Clarity.</p>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode="login" />
    </div>
  );
};

export default Index;
