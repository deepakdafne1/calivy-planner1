import { BookOpen, Clock, TrendingUp, Flame } from 'lucide-react';
import type { CalendarTask, Assignment } from '@/types';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  tasks: CalendarTask[];
  assignments: Assignment[];
}

export default function StatsCards({ tasks, assignments }: StatsCardsProps) {
  const completedAssignments = assignments.filter(a => a.completed).length;
  const totalStudyHours = tasks.reduce((acc, t) => {
    const duration = (t.endHour + t.endMinute / 60) - (t.startHour + t.startMinute / 60);
    return acc + Math.max(0, duration);
  }, 0);

  const completionRate = assignments.length > 0
    ? Math.round((completedAssignments / assignments.length) * 100)
    : 0;

  // Simple streak (count of consecutive days with tasks from today backwards)
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (tasks.some(t => t.date === dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const stats = [
    {
      icon: BookOpen,
      label: 'Tasks Scheduled',
      value: tasks.length.toString(),
      sub: 'this week',
      gradient: 'from-primary/15 to-primary/5',
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
      ring: 'ring-primary/10',
    },
    {
      icon: Clock,
      label: 'Study Hours',
      value: totalStudyHours.toFixed(1) + 'h',
      sub: 'planned',
      gradient: 'from-accent/15 to-accent/5',
      iconBg: 'bg-accent/15',
      iconColor: 'text-accent',
      ring: 'ring-accent/10',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: completionRate + '%',
      sub: `${completedAssignments}/${assignments.length} done`,
      gradient: 'from-success/15 to-success/5',
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
      ring: 'ring-success/10',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: streak + ' days',
      sub: streak > 0 ? 'Keep it up!' : 'Start today',
      gradient: 'from-warning/15 to-warning/5',
      iconBg: 'bg-warning/15',
      iconColor: 'text-warning',
      ring: 'ring-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'bg-card rounded-2xl p-4 shadow-card border border-border/30 ring-1 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
            stat.ring
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
            <div className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              stat.iconBg
            )}>
              <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
