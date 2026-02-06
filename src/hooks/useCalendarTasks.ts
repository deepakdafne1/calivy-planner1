import { useState, useCallback } from 'react';
import type { CalendarTask, Subject } from '@/types';

export const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1',
];

export function useCalendarTasks() {
  const [tasks, setTasks] = useState<CalendarTask[]>(() => {
    const stored = localStorage.getItem('calivy_tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem('calivy_subjects');
    return stored ? JSON.parse(stored) : [];
  });

  const saveTasks = (newTasks: CalendarTask[]) => {
    localStorage.setItem('calivy_tasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const saveSubjects = (newSubjects: Subject[]) => {
    localStorage.setItem('calivy_subjects', JSON.stringify(newSubjects));
    setSubjects(newSubjects);
  };

  const addTask = (task: Omit<CalendarTask, 'id'>) => {
    const newTask: CalendarTask = { ...task, id: crypto.randomUUID() };
    saveTasks([...tasks, newTask]);
    return newTask;
  };

  const removeTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Omit<CalendarTask, 'id'>>) => {
    saveTasks(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addSubject = (name: string, color?: string) => {
    const existing = subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const newColor = color || DEFAULT_COLORS[subjects.length % DEFAULT_COLORS.length];
    const newSubject: Subject = { name, color: newColor };
    saveSubjects([...subjects, newSubject]);
    return newSubject;
  };

  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  return {
    tasks,
    subjects,
    addTask,
    updateTask,
    removeTask,
    addSubject,
    getTasksForDate,
  };
}
