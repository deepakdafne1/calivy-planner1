import {
  Calendar,
  BookOpen,
  Bot,
  Users,
  Bell,
  ListTodo,
  BarChart3,
  Trophy,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Weekly Calendar',
    description: 'Plan every hour of your week with color-coded subjects and drag-to-schedule blocks.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: BookOpen,
    title: 'Assignment Tracker',
    description: 'Track deadlines with smart color-coded alerts. Never miss a submission again.',
    color: 'bg-destructive/10 text-destructive',
  },
  {
    icon: Bot,
    title: 'AI Study Bot',
    description: 'Get personalized advice on managing your day based on cognitive weight analysis.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Users,
    title: 'Peer Learning',
    description: 'Form study groups with classmates and track each other\'s progress.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Timely reminders that escalate from green to red as deadlines approach.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: ListTodo,
    title: 'To-Do Planner',
    description: 'Daily task lists auto-updated by AI. Incomplete tasks roll over intelligently.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: BarChart3,
    title: 'Progress Analysis',
    description: 'Deep insights into completion rates, subject performance, and study patterns.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Trophy,
    title: 'Achievements & Streaks',
    description: 'Earn daily streaks and weekly badges. Gamification that builds real habits.',
    color: 'bg-warning/10 text-warning',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Everything You Need to <span className="text-gradient">Execute</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for students who want results, not just plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
