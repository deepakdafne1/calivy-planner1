import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, StoredUser } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, age: number, password: string) => User;
  signin: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function generateStudentId(): string {
  return 'STU' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('calivy_current_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, age: number, password: string): User => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('calivy_users') || '[]');
    const existing = users.find(u => u.username === username);
    if (existing) {
      throw new Error('Username already exists');
    }
    const studentId = generateStudentId();
    const newUser: StoredUser = { username, age, password, studentId };
    users.push(newUser);
    localStorage.setItem('calivy_users', JSON.stringify(users));

    const userData: User = { username, age, studentId };
    localStorage.setItem('calivy_current_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signin = (username: string, password: string): { success: boolean; message: string } => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('calivy_users') || '[]');
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      const userData: User = { username: found.username, age: found.age, studentId: found.studentId };
      localStorage.setItem('calivy_current_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, message: 'Signed in successfully!' };
    }
    return { success: false, message: 'Incorrect username or password' };
  };

  const logout = () => {
    localStorage.removeItem('calivy_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
