/* src/store/userStore.ts */ 

import { create } from 'zustand';
import api from '../api/axios';
import type { User } from '../types';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';

interface ErrorResponse {
    message: string;
}

interface UserState {
    users: User[];
    isLoading: boolean;
    // Actions
    fetchUsers: () => Promise<void>;
    addUser: (data: Partial<User>) => Promise<void>;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    isLoading: false,

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            // Assuming the backend provides the GET /api/users route
            const { data } = await api.get('/users');
            set({ users: data, isLoading: false });
        } catch (error) {
            console.error('Error fetching users:', error);
            set({ isLoading: false });
        }
    },

    addUser: async (userData) => {
        try {
            const { data } = await api.post('/users', userData);
            
            set((state) => ({ 
                users: [...state.users, data] 
            }));
            
            Swal.fire({
                icon: 'success',
                title: 'User Created!',
                text: 'The access has been generated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response?.data?.message || 'Could not create the user'
            });
            throw error; // Throwing error in case the modal needs to handle the failure
        }
    },

    updateUser: async (id, updatedData) => {
        try {
            const { data } = await api.put(`/users/${id}`, updatedData);
            
            set((state) => ({
                users: state.users.map(u => u._id === id ? data : u)
            }));

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'User data has been successfully modified.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response?.data?.message || 'Could not update the user'
            });
            throw error;
        }
    },

    deleteUser: async (id) => {
        const result = await Swal.fire({
            title: 'Deactivate user?',
            text: "The user will lose access to the system (Soft Delete).",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`);
                
                set((state) => ({
                    users: state.users.filter(u => u._id !== id)
                }));

                Swal.fire('Deactivation successful!', 'The user has been deactivated.', 'success');
            } catch (error: unknown) {
                const axiosError = error as AxiosError<ErrorResponse>;
                Swal.fire('Error', axiosError.response?.data?.message || 'Could not deactivate user.', 'error');
            }
        }
    }
}));