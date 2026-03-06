/* src/store/movementStore.ts */

import { create } from 'zustand';
import api from '../api/axios';

// Interface definition for data received from the backend
export interface Movement {
    _id: string;
    product: {
        _id: string;
        name: string;
        sku: string;
    } | null; // null in case the product was deleted later
    supermarket: string;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    previousStock: number;
    newStock: number;
    description: string;
    createdAt: string;
}

interface MovementState {
    movements: Movement[];
    isLoading: boolean;
    error: string | null;
    fetchMovements: (supermarketId: string) => Promise<void>;
}

export const useMovementStore = create<MovementState>((set) => ({
    movements: [],
    isLoading: false,
    error: null,

    fetchMovements: async (supermarketId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get(`/movements/supermarket/${supermarketId}`);
            set({ movements: data, isLoading: false });
        } catch (error: unknown) {
            console.error('[Error fetching movements]:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Error loading history', 
                isLoading: false 
            });
        }
    }
}));