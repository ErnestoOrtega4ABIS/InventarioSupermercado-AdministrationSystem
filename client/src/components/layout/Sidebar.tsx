/* src/components/layout/Sidebar.tsx */

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Store, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx'; // Utilidad para clases condicionales

export const Sidebar = () => {
    const { user, logout } = useAuthStore();

    // Definimos los enlaces. Podríamos ocultar algunos según el rol del usuario.
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/inventory', icon: Package, label: 'Inventario' },
        // Solo Admin ve Supermercados y Usuarios
        ...(user?.role === 'admin' ? [
            { to: '/supermarkets', icon: Store, label: 'Supermercados' },
            { to: '/users', icon: Users, label: 'Usuarios' },
        ] : []),
        { to: '/settings', icon: Settings, label: 'Configuración' },
    ];

    const handleLogout = () => {
        const confirm = window.confirm("¿Estás seguro que deseas cerrar sesión?");
        if (confirm) {
            logout();
        }
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