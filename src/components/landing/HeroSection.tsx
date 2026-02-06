import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onLoginClick: () => void;
}

export default function HeroSection({ onLoginClick }: HeroSectionProps) {
  return (
    <section className="min-h-screen gradient-hero-bg flex items-center pt-20">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Students don't fail because they are weak.{' '}
            <span className="text-gradient">They fail because planning systems are broken.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            Calivy is not just a timetable. It is a{' '}
            <strong className="text-foreground">student execution engine</strong>{' '}
            that forces consistency, removes confusion, and builds discipline.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button variant="gradient" size="lg" onClick={onLoginClick} className="text-base px-8">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Learn More
            </Button>
          </div>

          <div className="flex items-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>AI-Powered Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Peer Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span>Smart Deadlines</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
