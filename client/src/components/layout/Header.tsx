/* src/components/layout/Header.tsx */

import { useAuthStore } from '../../store/authStore';
import { Bell, Search } from 'lucide-react';

export const Header = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Barra de Búsqueda Global (Visual por ahora) */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar productos, SKU..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
            </div>

            {/* Perfil y Notificaciones */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                    {/* Puntito rojo de notificaciones (Hardcodeado por ahora) */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    {/* Avatar con iniciales */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                        {user?.firstName?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};