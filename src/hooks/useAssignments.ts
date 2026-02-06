import { useState } from 'react';
import type { Assignment } from '@/types';

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const stored = localStorage.getItem('calivy_assignments');
    return stored ? JSON.parse(stored) : [];
  });

  const saveAssignments = (updated: Assignment[]) => {
    localStorage.setItem('calivy_assignments', JSON.stringify(updated));
    setAssignments(updated);
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'completed' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveAssignments([...assignments, newAssignment]);
    return newAssignment;
  };

  const toggleComplete = (id: string) => {
    saveAssignments(
      assignments.map(a => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const removeAssignment = (id: string) => {
    saveAssignments(assignments.filter(a => a.id !== id));
  };

  const getDaysUntilDeadline = (assignment: Assignment): number => {
    const now = new Date();
    const deadline = new Date(`${assignment.deadlineDate}T${assignment.deadlineTime}`);
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (assignment: Assignment): string => {
    if (assignment.completed) return 'hsl(152, 69%, 45%)';
    const days = getDaysUntilDeadline(assignment);
    if (days <= 1) return 'hsl(0, 84%, 60%)';
    if (days <= 3) return 'hsl(38, 92%, 50%)';
    return 'hsl(152, 69%, 45%)';
  };

  return {
    assignments,
    addAssignment,
    toggleComplete,
    removeAssignment,
    getDaysUntilDeadline,
    getUrgencyColor,
  };
}
