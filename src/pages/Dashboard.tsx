import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import WeeklyCalendar from '@/components/dashboard/WeeklyCalendar';
import TaskModal from '@/components/dashboard/TaskModal';
import AssignmentPanel from '@/components/dashboard/AssignmentPanel';
import StatsCards from '@/components/dashboard/StatsCards';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { useAssignments } from '@/hooks/useAssignments';
import type { DashboardView } from '@/types';
import { Bell, Bot, Users, ListTodo, BarChart3, Trophy, Construction } from 'lucide-react';

function PlaceholderView({ title, icon: Icon, description }: { title: string; icon: typeof Bot; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <Construction className="w-4 h-4" />
        <span>Coming soon</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<DashboardView>('calendar');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState(0);

  const { tasks, subjects, addTask, addSubject } = useCalendarTasks();
  const {
    assignments,
    addAssignment,
    toggleComplete,
    removeAssignment,
    getDaysUntilDeadline,
    getUrgencyColor,
  } = useAssignments();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleCellClick = (date: string, hour: number) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Parameters<typeof addTask>[0]) => {
    addTask(taskData);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'calendar':
        return (
          <>
            <StatsCards tasks={tasks} assignments={assignments} />
            <WeeklyCalendar
              tasks={tasks}
              assignments={assignments}
              onCellClick={handleCellClick}
            />
          </>
        );
      case 'assignments':
        return (
          <AssignmentPanel
            assignments={assignments}
            onAdd={addAssignment}
            onToggle={toggleComplete}
            onRemove={removeAssignment}
            getDaysUntil={getDaysUntilDeadline}
            getUrgencyColor={getUrgencyColor}
          />
        );
      case 'aibot':
        return <PlaceholderView title="AI Study Bot" icon={Bot} description="Get personalized study advice powered by AI. Manage your cognitive load and optimize your schedule." />;
      case 'peer':
        return <PlaceholderView title="Peer Learning" icon={Users} description="Form study groups with up to 5 classmates and track each other's progress." />;
      case 'notifications':
        return <PlaceholderView title="Notifications" icon={Bell} description="Smart reminders that escalate as deadlines approach. Never miss a submission." />;
      case 'todo':
        return <PlaceholderView title="To-Do List" icon={ListTodo} description="Daily task planner auto-updated by AI. Incomplete tasks intelligently roll over." />;
      case 'analysis':
        return <PlaceholderView title="Analysis" icon={BarChart3} description="Deep insights into your study patterns, completion rates, and subject performance." />;
      case 'achievements':
        return <PlaceholderView title="Achievements" icon={Trophy} description="Earn daily streaks and weekly badges. Gamification that builds real discipline." />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        date={selectedDate}
        hour={selectedHour}
        subjects={subjects}
        onAddSubject={addSubject}
        onSave={handleSaveTask}
      />
    </div>
  );
}
