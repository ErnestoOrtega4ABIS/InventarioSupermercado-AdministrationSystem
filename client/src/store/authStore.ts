/* src/store/authStore.ts */

import { create } from 'zustand';
import api from '../api/axios';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isChecking: boolean; // Used to determine if we are verifying the session on initial load
    error: string | null;

    // Methods (Actions)
    login: (user: User) => void; // Receives the already logged-in user from the component
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>; // Verifies the session cookie on page refresh (F5)
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isChecking: true, 
    error: null,

    // Simple Action: Save the user in the state
    login: (user: User) => {
        set({ 
            user, 
            isAuthenticated: true, 
            error: null,
            isLoading: false
        });
    },

    // Action: Logout (Backend + Frontend)
    logout: async () => {
        set({ isLoading: true });
        try {
            await api.post('/auth/logout');
            set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false 
            });
        } catch (error) {
            console.error('Error logging out', error);
            // Clear state even if the request fails
            set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false 
            });
        }
    },

    // Action: Verify session when the page reloads
    checkAuth: async () => {
        set({ isChecking: true });
        try {
            // Request the current user from the backend based on the cookie
            const { data } = await api.get<User>('/auth/profile');
            set({ 
                user: data, 
                isAuthenticated: true, 
                isChecking: false 
            });
        } catch {
            // If it fails, the cookie has either expired or does not exist
            set({ 
                user: null, 
                isAuthenticated: false, 
                isChecking: false 
            });
        }
    }
}));