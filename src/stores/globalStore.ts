
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface GlobalState {
  notifications: Notification[];
  isOnline: boolean;
  lastSync: string | null;
  loading: boolean;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setOnlineStatus: (status: boolean) => void;
  updateLastSync: () => void;
  setLoading: (loading: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  notifications: [],
  isOnline: true,
  lastSync: null,
  loading: false,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications.slice(0, 49)] // Manter apenas 50 notificações
    }));
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setOnlineStatus: (status) => {
    set({ isOnline: status });
  },

  updateLastSync: () => {
    set({ lastSync: new Date().toISOString() });
  },

  setLoading: (loading) => {
    set({ loading });
  }
}));

// Hook para monitorar conectividade
export const useConnectivityMonitor = () => {
  const { setOnlineStatus, addNotification } = useGlobalStore();

  React.useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      addNotification({
        title: 'Conexão restaurada',
        message: 'Você está online novamente',
        type: 'success'
      });
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      addNotification({
        title: 'Sem conexão',
        message: 'Você está trabalhando offline',
        type: 'warning'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus, addNotification]);
};
