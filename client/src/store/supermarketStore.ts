/* src/store/supermarketStore.ts */ 

import { create } from 'zustand';
import api from '../api/axios';
import type { Supermarket } from '../types';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2'; // Importing the alerts library

interface SupermarketState {
    activeSupermarketId: string | null;
    supermarkets: Supermarket[];
    isLoading: boolean;
    // Actions
    fetchSupermarkets: () => Promise<void>;
    addSupermarket: (data: Partial<Supermarket>) => Promise<void>;
    deleteSupermarket: (id: string) => Promise<void>;
    updateSupermarket: (id: string, data: Partial<Supermarket>) => Promise<void>;
    setActiveSupermarket: (id: string) => void;
}

export const useSupermarketStore = create<SupermarketState>((set) => ({
    activeSupermarketId: "6986313f49879bc2029f7f62",
    setActiveSupermarket: (id) => set({ activeSupermarketId: id }),
    supermarkets: [],
    isLoading: false,

    fetchSupermarkets: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/supermarkets');
            set({ supermarkets: data, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },

    addSupermarket: async (newSupermarket) => {
        try {
            const { data } = await api.post('/supermarkets', newSupermarket);
            // Update local state by adding the new supermarket to the array
            set((state) => ({ 
                supermarkets: [...state.supermarkets, data] 
            }));
            
            Swal.fire({
                icon: 'success',
                title: 'Created!',
                text: 'The supermarket has been successfully registered.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response?.data?.message || 'Could not create the supermarket'
            });
        }
    },

    deleteSupermarket: async (id) => {
        // Visual confirmation with SweetAlert2
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/supermarkets/${id}`);
                
                // Update local state (filter out the deleted one)
                set((state) => ({
                    supermarkets: state.supermarkets.filter(s => s._id !== id)
                }));

                Swal.fire('Deleted!', 'The supermarket has been deactivated.', 'success');
            } catch {
                Swal.fire('Error', 'Could not delete the record.', 'error');
            }
        }
    },

    updateSupermarket: async (id, updatedData) => {
        try {
            // Assuming your backend has the PUT /supermarkets/:id route
            const { data } = await api.put(`/supermarkets/${id}`, updatedData);
            
            // Update the specific card in the React state
            set((state) => ({
                supermarkets: state.supermarkets.map(s => s._id === id ? data : s)
            }));

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The supermarket has been successfully modified.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response?.data?.message || 'Could not update the supermarket'
            });
        }
    }

}));