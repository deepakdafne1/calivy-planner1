import { useState } from 'react';
import { Plus, Clock, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Assignment } from '@/types';

interface AssignmentPanelProps {
  assignments: Assignment[];
  onAdd: (assignment: Omit<Assignment, 'id' | 'completed' | 'createdAt'>) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  getDaysUntil: (assignment: Assignment) => number;
  getUrgencyColor: (assignment: Assignment) => string;
}

export default function AssignmentPanel({
  assignments,
  onAdd,
  onToggle,
  onRemove,
  getDaysUntil,
  getUrgencyColor,
}: AssignmentPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [durationHours, setDurationHours] = useState('2');

  const handleAdd = () => {
    if (!subject.trim() || !deadlineDate) return;
    onAdd({
      subject: subject.trim(),
      deadlineDate,
      deadlineTime,
      durationHours: Number(durationHours) || 1,
    });
    setSubject('');
    setDeadlineDate('');
    setDeadlineTime('23:59');
    setDurationHours('2');
    setShowAdd(false);
  };

  const pending = assignments.filter(a => !a.completed);
  const completed = assignments.filter(a => a.completed);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
          <p className="text-sm text-muted-foreground">
            {pending.length} pending · {completed.length} completed
          </p>
        </div>
      </div>

      {/* Assignment list */}
      <div className="space-y-3 mb-20">
        {pending.length === 0 && completed.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No assignments yet</p>
            <p className="text-sm mt-1">Click the + button to add your first assignment</p>
          </div>
        )}

        {pending.map(assignment => {
          const daysLeft = getDaysUntil(assignment);
          const urgencyColor = getUrgencyColor(assignment);

          return (
            <div
              key={assignment.id}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 animate-fadeInUp"
            >
              <button
                onClick={() => onToggle(assignment.id)}
                className="w-6 h-6 rounded-full border-2 border-border hover:border-success transition-colors flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{assignment.subject}</h4>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(assignment.deadlineDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {assignment.deadlineTime}
                  {' · '}{assignment.durationHours}h estimated
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" style={{ color: urgencyColor }} />
                  <span className="text-xs font-medium" style={{ color: urgencyColor }}>
                    {daysLeft > 0 ? `${daysLeft}d` : 'Due!'}
                  </span>
                </div>
                <button
                  onClick={() => onRemove(assignment.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {completed.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-muted-foreground pt-4">Completed</h3>
            {completed.map(assignment => (
              <div
                key={assignment.id}
                className="bg-card/50 rounded-xl p-4 shadow-sm flex items-center gap-4 opacity-70"
              >
                <button
                  onClick={() => onToggle(assignment.id)}
                  className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-success-foreground" />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground line-through">{assignment.subject}</h4>
                </div>
                <button
                  onClick={() => onRemove(assignment.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform z-30"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogDescription>Track a new assignment deadline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="e.g., Physics Lab Report"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deadline Date</Label>
                <Input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Deadline Time</Label>
                <Input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Estimated Duration (hours)</Label>
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button variant="gradient" className="w-full" onClick={handleAdd}>
              Add Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
