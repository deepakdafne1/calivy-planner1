import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Subject } from '@/types';
import { DEFAULT_COLORS } from '@/hooks/useCalendarTasks';
import { Plus } from 'lucide-react';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  hour: number;
  subjects: Subject[];
  onAddSubject: (name: string, color?: string) => Subject;
  onSave: (task: {
    subject: string;
    color: string;
    date: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    difficulty: number;
  }) => void;
}

export default function TaskModal({
  open,
  onOpenChange,
  date,
  hour,
  subjects,
  onAddSubject,
  onSave,
}: TaskModalProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [startHour, setStartHour] = useState(hour);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(Math.min(hour + 1, 23));
  const [endMinute, setEndMinute] = useState(0);
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    setStartHour(hour);
    setEndHour(Math.min(hour + 1, 23));
    setStartMinute(0);
    setEndMinute(0);
    setSelectedSubject('');
    setShowNewSubject(subjects.length === 0);
    setDifficulty(3);
  }, [hour, date, open, subjects.length]);

  // Update color when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const sub = subjects.find(s => s.name === selectedSubject);
      if (sub) setColor(sub.color);
    }
  }, [selectedSubject, subjects]);

  const handleAddNewSubject = () => {
    if (!newSubjectName.trim()) return;
    const sub = onAddSubject(newSubjectName.trim(), color);
    setSelectedSubject(sub.name);
    setColor(sub.color);
    setNewSubjectName('');
    setShowNewSubject(false);
  };

  const handleSave = () => {
    const subjectName = selectedSubject || newSubjectName.trim();
    if (!subjectName) return;

    // Ensure subject exists
    if (!subjects.find(s => s.name === subjectName)) {
      onAddSubject(subjectName, color);
    }

    onSave({
      subject: subjectName,
      color,
      date,
      startHour,
      startMinute,
      endHour,
      endMinute,
      difficulty,
    });

    onOpenChange(false);
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>{formattedDate}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject selection */}
          <div>
            <Label className="text-sm font-medium">Subject / Task</Label>
            {subjects.length > 0 && !showNewSubject ? (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {subjects.map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => setSelectedSubject(sub.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedSubject === sub.name
                          ? 'ring-2 ring-ring shadow-sm scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: sub.color + '20',
                        color: sub.color,
                        borderColor: sub.color,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: sub.color }} />
                      {sub.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowNewSubject(true)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                >
                  <Plus className="w-3 h-3" /> Add New Subject
                </button>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="Enter subject name (e.g., Maths)"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  <Button size="sm" variant="default" onClick={handleAddNewSubject} disabled={!newSubjectName.trim()}>
                    Add
                  </Button>
                  {subjects.length > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => setShowNewSubject(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Color picker */}
          <div>
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-ring ring-offset-2 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Time duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Start Time</Label>
              <div className="flex gap-1 mt-1">
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                  className="w-16 text-center"
                />
                <span className="self-center text-muted-foreground">:</span>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={startMinute}
                  onChange={(e) => setStartMinute(Number(e.target.value))}
                  className="w-16 text-center"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">End Time</Label>
              <div className="flex gap-1 mt-1">
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="w-16 text-center"
                />
                <span className="self-center text-muted-foreground">:</span>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={endMinute}
                  onChange={(e) => setEndMinute(Number(e.target.value))}
                  className="w-16 text-center"
                />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-sm font-medium">Difficulty (1-5)</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    difficulty === d
                      ? 'bg-primary text-primary-foreground shadow-glow scale-110'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <Button variant="gradient" className="w-full" onClick={handleSave}>
            Save Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
