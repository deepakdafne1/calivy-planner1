import {
  Calendar,
  BookOpen,
  Bot,
  Users,
  Bell,
  ListTodo,
  BarChart3,
  Trophy,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardView } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems: { view: DashboardView; icon: typeof Calendar; label: string }[] = [
  { view: 'calendar', icon: Calendar, label: 'Calendar' },
  { view: 'assignments', icon: BookOpen, label: 'Assignments' },
  { view: 'aibot', icon: Bot, label: 'AI Bot' },
  { view: 'peer', icon: Users, label: 'Peer Learning' },
  { view: 'notifications', icon: Bell, label: 'Notifications' },
  { view: 'todo', icon: ListTodo, label: 'To-Do List' },
  { view: 'analysis', icon: BarChart3, label: 'Analysis' },
  { view: 'achievements', icon: Trophy, label: 'Achievements' },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-card border-r border-border/50 flex flex-col flex-shrink-0 shadow-card">
      {/* Logo */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-foreground tracking-wider">CALIVY</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Turning Chaos Into Clarity</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeView === view
                ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            )}
          >
            <Icon className={cn(
              'w-[18px] h-[18px] flex-shrink-0 transition-colors',
              activeView === view && 'text-primary'
            )} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-border/50">
        {user && (
          <div className="mb-3 p-3 rounded-xl bg-muted/50 border border-border/30">
            <p className="text-sm font-semibold text-foreground">{user.username}</p>
            <p className="text-[11px] text-muted-foreground font-medium">ID: {user.studentId}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
