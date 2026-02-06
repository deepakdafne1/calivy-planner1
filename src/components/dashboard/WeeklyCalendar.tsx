import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarTask, Assignment } from '@/types';
import { cn } from '@/lib/utils';

interface WeeklyCalendarProps {
  tasks: CalendarTask[];
  assignments: Assignment[];
  onCellClick: (date: string, hour: number) => void;
}

const HOUR_HEIGHT = 56;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export default function WeeklyCalendar({ tasks, assignments, onCellClick }: WeeklyCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const today = new Date();
    const ws = getWeekStart(today);
    ws.setDate(ws.getDate() + weekOffset * 7);
    return ws;
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const today = formatDate(new Date());

  const getTasksForDate = (date: string) => tasks.filter(t => t.date === date);

  const getAssignmentDeadlinesForDate = (date: string) =>
    assignments.filter(a => a.deadlineDate === date);

  const monthYear = weekDays[3].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(o => o - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset(o => o + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
            Today
          </Button>
        </div>
        <h3 className="text-lg font-bold text-foreground">{monthYear}</h3>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <span className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground">
            Week
          </span>
        </div>
      </div>

      {/* Day headers */}
      <div className="flex border-b border-border">
        <div className="w-16 flex-shrink-0" />
        {weekDays.map((day, i) => {
          const dateStr = formatDate(day);
          const isToday = dateStr === today;
          return (
            <div
              key={i}
              className={cn(
                'flex-1 text-center py-2 border-l border-border',
                isToday && 'bg-primary/5'
              )}
            >
              <p className="text-xs text-muted-foreground font-medium">{DAY_NAMES[day.getDay()]}</p>
              <p className={cn(
                'text-lg font-bold',
                isToday ? 'text-primary' : 'text-foreground'
              )}>
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {HOURS.map(h => (
              <div
                key={h}
                className="text-right pr-2 text-[11px] text-muted-foreground font-medium"
                style={{ height: HOUR_HEIGHT }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dateStr = formatDate(day);
            const isToday = dateStr === today;
            const dayTasks = getTasksForDate(dateStr);
            const dayDeadlines = getAssignmentDeadlinesForDate(dateStr);

            return (
              <div
                key={dayIndex}
                className={cn(
                  'flex-1 relative border-l border-border',
                  isToday && 'bg-primary/[0.02]'
                )}
              >
                {/* Hour cells */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    className="border-b border-border/50 cursor-pointer hover:bg-primary/5 transition-colors"
                    style={{ height: HOUR_HEIGHT }}
                    onClick={() => onCellClick(dateStr, h)}
                  />
                ))}

                {/* Task blocks */}
                {dayTasks.map(task => {
                  const top = (task.startHour + task.startMinute / 60) * HOUR_HEIGHT;
                  const endPos = (task.endHour + task.endMinute / 60) * HOUR_HEIGHT;
                  const height = Math.max(endPos - top, 20);

                  return (
                    <div
                      key={task.id}
                      className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-0.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity z-10"
                      style={{
                        top,
                        height,
                        backgroundColor: task.color,
                      }}
                      title={`${task.subject} (Difficulty: ${task.difficulty}/5)`}
                    >
                      <p className="text-[10px] font-semibold text-primary-foreground truncate">
                        {task.subject}
                      </p>
                      {height > 30 && (
                        <p className="text-[9px] text-primary-foreground/70">
                          {task.startHour}:{String(task.startMinute).padStart(2, '0')} - {task.endHour}:{String(task.endMinute).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Assignment deadline markers */}
                {dayDeadlines.map(assignment => {
                  const [hStr, mStr] = assignment.deadlineTime.split(':');
                  const h = parseInt(hStr);
                  const m = parseInt(mStr);
                  const top = (h + m / 60) * HOUR_HEIGHT;

                  return (
                    <div
                      key={assignment.id}
                      className={cn(
                        'absolute left-0 right-0 rounded-md mx-0.5 px-1.5 py-0.5 z-20 border-2',
                        assignment.completed ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'
                      )}
                      style={{ top, height: HOUR_HEIGHT - 4 }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[9px]">⏰</span>
                        <p className="text-[10px] font-semibold text-foreground truncate">
                          {assignment.subject}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
