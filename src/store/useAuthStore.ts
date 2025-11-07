import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  provider?: 'google' | 'microsoft' | 'apple' | 'email';
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, email: string, provider?: User['provider'], token?: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (name, email, provider = 'email', token) => {
    const user: User = { 
      name, 
      email, 
      provider,
      token: token || `token_${Date.now()}`
    };
    set({ user, isAuthenticated: true });
    localStorage.setItem('keystroke_user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('keystroke_user');
  },

  checkAuth: () => {
    const stored = localStorage.getItem('keystroke_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
  },
}));
