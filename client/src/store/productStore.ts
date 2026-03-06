/* src/store/productStore.ts */

import { create } from 'zustand';
import { AxiosError } from 'axios';
import api from '../api/axios';
import type { Product } from '../types';
import Swal from 'sweetalert2';

import { useNotificationStore } from './notificationStore';

// Interface for Dashboard data
export interface DashboardData {
    kpis: {
        totalProducts: number;
        totalValue: number;
        totalCategories: number;
        lowStockAlerts: number;
    };
    charts: {
        productsByCategory: { name: string; value: number }[];
    };
    tables: {
        lowestStock: Product[]; 
        recentlyAdded: Product[];
    };
}

interface ProductState {
    products: Product[];
    isLoading: boolean;
    
    // State variables for the Dashboard
    dashboardStats: DashboardData | null;
    error: string | null;
    
    // Original Actions
    fetchProducts: (supermarketId: string) => Promise<void>;
    addProduct: (productData: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    
    // Dashboard Action
    fetchDashboardStats: (supermarketId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,
    
    // Initializing new states
    dashboardStats: null,
    error: null,

    // --- DASHBOARD FUNCTION ---
    fetchDashboardStats: async (supermarketId: string) => {
        if (!supermarketId) return;

        set({ isLoading: true, error: null });
        try {
            // Ensure this route matches the one created in Express
            const { data } = await api.get(`/dashboard/stats/${supermarketId}`);
            set({ dashboardStats: data, isLoading: false });
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message: string }>;
            console.error('[Error fetching dashboard stats]:', err);
            set({ 
                error: axiosError.response?.data?.message || 'Error loading statistics', 
                isLoading: false 
            });
        }
    },

    // --- PRODUCT CRUD FUNCTIONS ---
    fetchProducts: async (supermarketId: string) => {
        if (!supermarketId) return;
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/products/supermarket/${supermarketId}`);
            set({ products: data, isLoading: false });
        } catch (error) {
            console.error('[Error fetching products]:', error);
            set({ isLoading: false });
        }
    },

    addProduct: async (productData) => {
        try {
            const { data } = await api.post('/products', productData);
            set((state) => ({ products: [...state.products, data] }));
            Swal.fire({
                icon: 'success',
                title: 'Product Registered!',
                text: 'The product has been added to the inventory.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
                icon: 'error',
                title: 'Inventory Error',
                text: axiosError.response?.data?.message || 'Could not create the product'
            });
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const { data } = await api.put(`/products/${id}`, productData);
            set((state) => ({ products: state.products.map(p => p._id === id ? data : p) }));
            if (data.alert) {
                Swal.fire({ icon: 'warning', title: 'Critical Stock!', text: data.alertMessage });
                useNotificationStore.getState().fetchNotifications(data.supermarket);
            } else {
                Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({ icon: 'error', title: 'Error', text: axiosError.response?.data?.message || 'Could not update the product' });
            throw error;
        }
    },

    deleteProduct: async (id) => {
        const result = await Swal.fire({
            title: 'Remove product?',
            text: "The product will no longer be available for this branch.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/products/${id}`);
                set((state) => ({ products: state.products.filter(p => p._id !== id) }));
                Swal.fire('Removed!', 'The product was deactivated.', 'success');
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                Swal.fire('Error', axiosError.response?.data?.message || 'Could not delete.', 'error');
            }
        }
    }
}));