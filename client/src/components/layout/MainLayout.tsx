/* src/components/layout/MainLayout.tsx */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Importamos el ícono del menú
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
    // Estado para controlar si el sidebar está abierto en móviles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            
            {/* Sidebar con paso de props para controlarlo */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Contenido Principal */}
            {/* Cambiamos ml-64 a lg:ml-64 para que el margen solo aplique en PC */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
                
                {/* Barra superior Mobile (Solo visible en pantallas pequeñas) */}
                <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-1 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg text-slate-800">StockMaster</span>
                    </div>
                </div>

                {/* Tu Header original (si tiene un buscador o perfil, se adaptará solo) */}
                <Header />
                
                {/* Ajustamos el padding en móviles (p-4) y en PC (sm:p-8) */}
                <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};