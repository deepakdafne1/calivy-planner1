export interface User {
  username: string;
  age: number;
  studentId: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface CalendarTask {
  id: string;
  subject: string;
  color: string;
  date: string; // YYYY-MM-DD
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  difficulty: number; // 1-5
}

export interface Assignment {
  id: string;
  subject: string;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:MM
  durationHours: number;
  completed: boolean;
  createdAt: string;
}

export interface Subject {
  name: string;
  color: string;
}

export type DashboardView =
  | 'calendar'
  | 'assignments'
  | 'aibot'
  | 'peer'
  | 'notifications'
  | 'todo'
  | 'analysis'
  | 'achievements';
