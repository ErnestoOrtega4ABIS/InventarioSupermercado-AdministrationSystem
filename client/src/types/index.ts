// src/types/index.ts

// USUARIO (Basado en UserSchema)
export interface User {
    _id: string;
    firstName: string;       // Antes teníamos 'name', ahora son dos campos
    lastName: string;
    email: string;
    role: 'admin' | 'worker' | 'provider' | 'manager'; // Roles exactos del Backend
    supermarket?: string | { _id: string; name: string };
    status: boolean;         
    googleId?: string;
    image?: string;          
}

// SUPERMERCADO (Basado en SupermarketSchema)
export interface Supermarket {
    _id: string;
    name: string;
    address: string;
    phone?: string;          // En el modelo SÍ existe (opcional)
    image?: string;          // En el modelo SÍ existe (default: 'default-store.jpg')
    active: boolean;
    createdBy?: string;      // ID del usuario que lo creó
}

// PRODUCTO (Basado en ProductSchema)
export interface Product {
    _id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    minStock: number;
    image?: string;          
    category?: string;       
    supermarket: string;     // ID del Supermercado
    active: boolean;
    
    alert?: boolean;         
    alertMessage?: string;
}

// NOTIFICACIÓN (Basado en NotificationSchema)
export interface Notification {
    _id: string;
    type: 'STOCK_ALERT' | 'SYSTEM_MSG';
    message: string;
    supermarket: string;
    product?: Product | string; // Puede venir el objeto poblado o solo el ID
    read: boolean;
    createdAt: string;       // Las fechas viajan como string en JSON
}

// RESPUESTA LOGIN
export interface LoginResponse {
    message: string;
    user: User;
}