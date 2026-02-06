import { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarTask, Assignment } from '@/types';
import { cn } from '@/lib/utils';
import { useCalendarDrag } from '@/hooks/useCalendarDrag';

interface WeeklyCalendarProps {
  tasks: CalendarTask[];
  assignments: Assignment[];
  onCellClick: (date: string, hour: number) => void;
  onUpdateTask: (id: string, updates: Partial<Omit<CalendarTask, 'id'>>) => void;
}

const HOUR_HEIGHT = 60;
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

function CurrentTimeIndicator() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = (minutes / 60) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-30 pointer-events-none"
      style={{ top }}
    >
      <div className="relative flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive -ml-1.5 shadow-lg" />
        <div className="flex-1 h-[2px] bg-destructive shadow-sm" />
      </div>
    </div>
  );
}

export default function WeeklyCalendar({ tasks, assignments, onCellClick, onUpdateTask }: WeeklyCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

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
  const weekDates = useMemo(() => weekDays.map(formatDate), [weekDays]);
  const isCurrentWeek = weekDates.includes(today);

  const handleMoveTask = (taskId: string, newDate: string, startH: number, startM: number, endH: number, endM: number) => {
    onUpdateTask(taskId, { date: newDate, startHour: startH, startMinute: startM, endHour: endH, endMinute: endM });
  };

  const handleResizeTask = (taskId: string, endH: number, endM: number) => {
    onUpdateTask(taskId, { endHour: endH, endMinute: endM });
  };

  const handleCreateRange = (date: string, startH: number, endH: number) => {
    onCellClick(date, startH);
  };

  const { dragState, isDragging, handleTaskMouseDown, handleCellMouseDown, setColumnRef, setDateMap } = useCalendarDrag({
    hourHeight: HOUR_HEIGHT,
    tasks,
    onMoveTask: handleMoveTask,
    onResizeTask: handleResizeTask,
    onCreateRange: handleCreateRange,
  });

  useEffect(() => {
    setDateMap(weekDates);
  }, [weekDates, setDateMap]);

  const getTasksForDate = (date: string) => tasks.filter(t => t.date === date);

  const getAssignmentDeadlinesForDate = (date: string) =>
    assignments.filter(a => a.deadlineDate === date);

  const monthYear = weekDays[3].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get the container top for mouse calculations
  const getContainerTop = () => {
    if (!gridRef.current) return 0;
    return gridRef.current.getBoundingClientRect().top;
  };

  // Determine if a task should show as ghost (being dragged)
  const isTaskBeingDragged = (taskId: string) => {
    return dragState?.taskId === taskId && (dragState.mode === 'move' || dragState.mode === 'resize');
  };

  // Get ghost task position
  const getGhostTask = () => {
    if (!dragState || !dragState.taskId) return null;
    const task = tasks.find(t => t.id === dragState.taskId);
    if (!task) return null;
    return {
      ...task,
      date: dragState.currentDate,
      startHour: dragState.currentStartHour,
      startMinute: dragState.currentStartMinute,
      endHour: dragState.currentEndHour,
      endMinute: dragState.currentEndMinute,
    };
  };

  // Get create preview
  const getCreatePreview = () => {
    if (!dragState || dragState.mode !== 'create') return null;
    return {
      date: dragState.currentDate,
      startHour: dragState.currentStartHour,
      endHour: dragState.currentEndHour,
    };
  };

  const ghostTask = getGhostTask();
  const createPreview = getCreatePreview();

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-gradient-to-r from-card to-muted/30">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setWeekOffset(o => o - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setWeekOffset(o => o + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant={isCurrentWeek ? 'default' : 'ghost'}
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold ml-1"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </Button>
        </div>
        <h3 className="text-base font-bold text-foreground tracking-tight">{monthYear}</h3>
        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5 border border-border/40">
          <span className="px-3 py-1 text-xs font-semibold rounded-md gradient-primary text-primary-foreground shadow-sm">
            Week
          </span>
        </div>
      </div>

      {/* Day headers */}
      <div className="flex border-b border-border/50">
        <div className="w-[60px] flex-shrink-0" />
        {weekDays.map((day, i) => {
          const dateStr = weekDates[i];
          const isToday = dateStr === today;
          return (
            <div
              key={i}
              className={cn(
                'flex-1 text-center py-2.5 border-l border-border/30 transition-colors',
                isToday && 'bg-primary/[0.06]'
              )}
            >
              <p className={cn(
                'text-[11px] font-semibold uppercase tracking-wider',
                isToday ? 'text-primary' : 'text-muted-foreground'
              )}>{DAY_NAMES[day.getDay()]}</p>
              <div className={cn(
                'inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-bold mt-0.5 transition-colors',
                isToday
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-foreground'
              )}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div
        className={cn(
          'overflow-y-auto select-none',
          isDragging && 'cursor-grabbing'
        )}
        style={{ maxHeight: 'calc(100vh - 320px)' }}
      >
        <div className="flex" ref={gridRef}>
          {/* Time labels */}
          <div className="w-[60px] flex-shrink-0">
            {HOURS.map(h => (
              <div
                key={h}
                className="text-right pr-3 text-[11px] text-muted-foreground/70 font-medium flex items-start justify-end pt-1"
                style={{ height: HOUR_HEIGHT }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dateStr = weekDates[dayIndex];
            const isToday = dateStr === today;
            const dayTasks = getTasksForDate(dateStr);
            const dayDeadlines = getAssignmentDeadlinesForDate(dateStr);

            // Ghost task for this day
            const showGhost = ghostTask && ghostTask.date === dateStr;
            const showCreate = createPreview && createPreview.date === dateStr;

            return (
              <div
                key={dayIndex}
                ref={(el) => setColumnRef(dayIndex, el)}
                className={cn(
                  'flex-1 relative border-l border-border/30',
                  isToday && 'bg-primary/[0.02]'
                )}
              >
                {/* Hour cells */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    className={cn(
                      'border-b border-border/30 transition-colors',
                      !isDragging && 'cursor-pointer hover:bg-primary/[0.04]'
                    )}
                    style={{ height: HOUR_HEIGHT }}
                    onMouseDown={(e) => {
                      if (isDragging) return;
                      handleCellMouseDown(e, dateStr, getContainerTop());
                    }}
                  />
                ))}

                {/* Current time indicator */}
                {isToday && isCurrentWeek && <CurrentTimeIndicator />}

                {/* Create preview */}
                {showCreate && createPreview && (
                  <div
                    className="absolute left-1 right-1 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 z-20 pointer-events-none"
                    style={{
                      top: createPreview.startHour * HOUR_HEIGHT,
                      height: (createPreview.endHour - createPreview.startHour) * HOUR_HEIGHT,
                    }}
                  />
                )}

                {/* Task blocks */}
                {dayTasks.map(task => {
                  const beingDragged = isTaskBeingDragged(task.id);
                  const top = (task.startHour + task.startMinute / 60) * HOUR_HEIGHT;
                  const endPos = (task.endHour + task.endMinute / 60) * HOUR_HEIGHT;
                  const height = Math.max(endPos - top, 22);

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden cursor-grab z-10 group transition-shadow',
                        'hover:shadow-lg hover:z-20',
                        beingDragged && 'opacity-30 pointer-events-none'
                      )}
                      style={{
                        top,
                        height,
                        background: `linear-gradient(135deg, ${task.color}, ${task.color}dd)`,
                        boxShadow: `0 2px 8px ${task.color}40`,
                      }}
                      title={`${task.subject} (Difficulty: ${task.difficulty}/5)`}
                      onMouseDown={(e) => handleTaskMouseDown(e, task, getContainerTop())}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-[11px] font-bold text-primary-foreground truncate leading-tight">
                          {task.subject}
                        </p>
                        <GripVertical className="w-3 h-3 text-primary-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>
                      {height > 36 && (
                        <p className="text-[10px] text-primary-foreground/70 mt-0.5">
                          {task.startHour}:{String(task.startMinute).padStart(2, '0')} – {task.endHour}:{String(task.endMinute).padStart(2, '0')}
                        </p>
                      )}
                      {height > 52 && (
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                i < task.difficulty
                                  ? 'bg-primary-foreground/80'
                                  : 'bg-primary-foreground/20'
                              )}
                            />
                          ))}
                        </div>
                      )}
                      {/* Resize handle */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/20 to-transparent rounded-b-lg"
                      />
                    </div>
                  );
                })}

                {/* Ghost task (drag preview) */}
                {showGhost && ghostTask && (
                  <div
                    className="absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden z-30 pointer-events-none border-2 border-primary-foreground/30"
                    style={{
                      top: (ghostTask.startHour + ghostTask.startMinute / 60) * HOUR_HEIGHT,
                      height: Math.max(
                        ((ghostTask.endHour + ghostTask.endMinute / 60) - (ghostTask.startHour + ghostTask.startMinute / 60)) * HOUR_HEIGHT,
                        22
                      ),
                      background: `linear-gradient(135deg, ${ghostTask.color}cc, ${ghostTask.color}99)`,
                      boxShadow: `0 4px 20px ${ghostTask.color}50`,
                    }}
                  >
                    <p className="text-[11px] font-bold text-primary-foreground truncate">
                      {ghostTask.subject}
                    </p>
                    <p className="text-[10px] text-primary-foreground/70">
                      {ghostTask.startHour}:{String(ghostTask.startMinute).padStart(2, '0')} – {ghostTask.endHour}:{String(ghostTask.endMinute).padStart(2, '0')}
                    </p>
                  </div>
                )}

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
                        'absolute left-0.5 right-0.5 rounded-lg mx-0.5 px-2 py-1 z-20 border-2 transition-colors',
                        assignment.completed
                          ? 'border-success bg-success/10 shadow-[0_2px_8px_hsl(var(--success)/0.15)]'
                          : 'border-destructive bg-destructive/10 shadow-[0_2px_8px_hsl(var(--destructive)/0.15)]'
                      )}
                      style={{ top, height: HOUR_HEIGHT - 4 }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[10px]">⏰</span>
                        <p className="text-[11px] font-semibold text-foreground truncate">
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
