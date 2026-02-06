import { BookOpen, Clock, TrendingUp, Flame } from 'lucide-react';
import type { CalendarTask, Assignment } from '@/types';

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
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Clock,
      label: 'Study Hours',
      value: totalStudyHours.toFixed(1) + 'h',
      sub: 'planned',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: completionRate + '%',
      sub: `${completedAssignments}/${assignments.length} done`,
      color: 'bg-success/10 text-success',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: streak + ' days',
      sub: streak > 0 ? 'Keep it up!' : 'Start today',
      color: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
