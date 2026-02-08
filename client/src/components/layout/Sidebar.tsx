/* src/components/layout/Sidebar.tsx */

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Store, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx'; // Utilidad para clases condicionales
import Swal from 'sweetalert2';
export const Sidebar = () => {
    const { user, logout } = useAuthStore();

    // Definimos los enlaces. Podríamos ocultar algunos según el rol del usuario.
const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    
    { to: '/inventory', icon: Package, label: 'Inventario' },

    ...((user?.role === 'admin' || user?.role === 'provider') ? [
        { to: '/supermarkets', icon: Store, label: 'Supermercados' },
    ] : []),

    ...(user?.role === 'admin' ? [
        { to: '/users', icon: Users, label: 'Usuarios' },
    ] : []),

    { to: '/settings', icon: Settings, label: 'Configuración' },
];

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro que deseas salir del sistema?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    };

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
            {/* Logo / Título */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Store className="text-blue-500 mr-2" size={24} />
                <span className="font-bold text-lg tracking-wide">StockMaster</span>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 py-6 space-y-1 px-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => clsx(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium',
                            isActive 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Pie del Sidebar: Botón Salir */}
            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};