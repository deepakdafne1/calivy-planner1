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
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-extrabold text-sm">C</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-sidebar-foreground tracking-wide">CALIVY</h1>
            <p className="text-[9px] text-muted-foreground">Turning Chaos Into Clarity</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              activeView === view
                ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-sidebar-foreground">{user.username}</p>
            <p className="text-xs text-muted-foreground">ID: {user.studentId}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
