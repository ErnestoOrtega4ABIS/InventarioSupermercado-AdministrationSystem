import { create } from 'zustand';
import { AxiosError } from 'axios';
import api from '../api/axios';
import type { Product } from '../types';
import Swal from 'sweetalert2';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    
    // Acciones
    fetchProducts: (supermarketId: string) => Promise<void>;
    addProduct: (productData: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,

    fetchProducts: async (supermarketId: string) => {
        if (!supermarketId) return; // Prevención de errores si no hay ID

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
            
            set((state) => ({ 
                products: [...state.products, data] 
            }));
            
            Swal.fire({
                icon: 'success',
                title: '¡Producto Registrado!',
                text: 'El producto se ha añadido al inventario.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
                icon: 'error',
                title: 'Error de Inventario',
                text: axiosError.response?.data?.message || 'No se pudo crear el producto'
            });
            throw error; // Lanzamos el error para que la Modal no se cierre si falla (ej. SKU duplicado)
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const { data } = await api.put(`/products/${id}`, productData);
            
            set((state) => ({
                products: state.products.map(p => p._id === id ? data : p)
            }));

            // Tu backend manda un flag 'alert' si el stock es crítico. ¡Lo aprovechamos!
            if (data.alert) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Stock Crítico!',
                    text: data.alertMessage,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: axiosError.response?.data?.message || 'No se pudo actualizar el producto'
            });
            throw error;
        }
    },

    deleteProduct: async (id) => {
        const result = await Swal.fire({
            title: '¿Retirar producto?',
            text: "El producto ya no estará disponible para esta sucursal.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, retirar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/products/${id}`);
                
                // Filtramos el producto retirado de la vista
                set((state) => ({
                    products: state.products.filter(p => p._id !== id)
                }));

                Swal.fire('¡Retirado!', 'El producto fue dado de baja.', 'success');
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                Swal.fire('Error', axiosError.response?.data?.message || 'No se pudo eliminar.', 'error');
            }
        }
    }
}));