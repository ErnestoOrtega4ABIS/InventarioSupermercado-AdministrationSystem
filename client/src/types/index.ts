// src/types/index.ts

// Interfaz de Usuario (Lo que viene del Backend al loguearse)
export interface User {
    id: string;      // Ojo: MongoDB a veces manda '_id', ajustaremos si es necesario
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'employee';
    supermarket?: string; // ID del super (si aplica)
}

// Interfaz de Producto (Para los listados)
export interface Product {
    _id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    minStock: number;
    category: string;
    active: boolean;
    alert?: boolean; // Flag para saber si tiene stock bajo
}

// Interfaz de Supermercado
export interface Supermarket {
    _id: string;
    name: string;
    address: string;
    managerName: string;
    phone: string;
    active: boolean;
}

// Respuesta del Login (NUEVO: Lo que agregamos para el Store)
export interface LoginResponse {
    message: string;
    user: User;
    // No incluimos 'token' porque lo manejamos vía Cookies HttpOnly
}