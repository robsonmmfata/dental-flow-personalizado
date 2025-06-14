
import React from 'react';
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface GlobalState {
  isLoading: boolean;
  notifications: Notification[];
  user: any;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setUser: (user: any) => void;
  checkAuthStatus: () => Promise<void>;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  isLoading: false,
  notifications: [],
  user: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id, timestamp: new Date() };
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  setUser: (user: any) => set({ user }),

  checkAuthStatus: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null });
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      set({ user: null });
    }
  }
}));

// Hook para notificações React
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification } = useGlobalStore();

  const showSuccess = (title: string, message: string) => {
    addNotification({ title, message, type: 'success' });
  };

  const showError = (title: string, message: string) => {
    addNotification({ title, message, type: 'error' });
  };

  const showWarning = (title: string, message: string) => {
    addNotification({ title, message, type: 'warning' });
  };

  const showInfo = (title: string, message: string) => {
    addNotification({ title, message, type: 'info' });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };
};

// Component de notificações
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{notification.title}</h4>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-white opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
