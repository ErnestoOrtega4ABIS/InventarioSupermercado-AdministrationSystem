import { create } from 'zustand';
import api from '../api/axios'; // Tu instancia configurada de axios

interface INotification {
    _id: string;
    type: 'STOCK_ALERT' | 'SYSTEM_MSG';
    message: string;
    supermarket: string;
    product?: {
        _id: string;
        name: string;
        sku: string;
    };
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: INotification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Acciones
    fetchNotifications: (supermarketId: string) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async (supermarketId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get(`/notifications/${supermarketId}`);
            set({ 
                notifications: data, 
                unreadCount: data.filter((n: INotification) => !n.read).length,
                isLoading: false 
            });
        } catch (error: unknown) {
            set({ 
                error: error instanceof Error ? error.message : 'Error al cargar notificaciones', 
                isLoading: false 
            });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            
            // Actualizamos el estado localmente para que sea instantáneo
            const updatedNotifications = get().notifications.map((n) =>
                n._id === id ? { ...n, read: true } : n
            );

            set({
                notifications: updatedNotifications,
                unreadCount: updatedNotifications.filter((n) => !n.read).length,
            });
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await api.delete(`/notifications/${id}`);
            
            const remainingNotifications = get().notifications.filter((n) => n._id !== id);
            
            set({
                notifications: remainingNotifications,
                unreadCount: remainingNotifications.filter((n) => !n.read).length,
            });
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    },

    clearAll: () => set({ notifications: [], unreadCount: 0, error: null })
}));