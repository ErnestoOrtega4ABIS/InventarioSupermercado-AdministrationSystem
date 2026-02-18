/*src/pages/SuperMarketPage.tsx */ 

import { useEffect, useState } from 'react';
import { useSupermarketStore } from '../store/supermarketStore';
import { Plus, MapPin, Phone, Trash2, Store, Edit } from 'lucide-react';
import { SupermarketModal } from '../components/supermarkets/SupermarketModal';
import type { Supermarket } from '../types/index';

export const SupermarketsPage = () => {
    // Extraemos el estado y las funciones de nuestro store (Zustand)
    const { supermarkets, fetchSupermarkets, deleteSupermarket, isLoading } = useSupermarketStore();

    // Estado local para controlar si la ventana modal está abierta o cerrada
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para saber qué supermercado vamos a editar
    const [supermarketToEdit, setSupermarketToEdit] = useState<Supermarket | null>(null);

    // Efecto secundario: Cargar la lista de supermercados al montar el componente
    useEffect(() => {
        fetchSupermarkets();
    }, [fetchSupermarkets]);
    

    const handleOpenCreate = () => {
        setSupermarketToEdit(null); // Limpiamos para que salga en blanco
        setIsModalOpen(true);
    };

    const handleOpenEdit = (supermarket: Supermarket) => {
        setSupermarketToEdit(supermarket); // Le pasamos los datos a la modal
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* --- Encabezado de la Sección --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Supermercados</h1>
                    <p className="text-gray-500">Gestiona las sucursales y sus ubicaciones.</p>
                </div>
                <button 
                    onClick={handleOpenCreate} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    Nuevo Supermercado
                </button>
            </div>

            {/* --- Estado de Carga (Spinner) --- */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* --- Estado Vacío (Sin datos) --- */}
            {!isLoading && supermarkets.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Store className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay supermercados</h3>
                    <p className="text-gray-500 mt-1">Comienza registrando tu primera sucursal.</p>
                </div>
            )}

            {/* --- Grid de Tarjetas (Lista de Supermercados) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supermarkets.map((supermarket) => (
                    <div key={supermarket._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                        
                        {/* Contenedor de la Imagen */}
                        <div className="h-40 bg-gray-200 relative">
                            {supermarket.image ? (
                                <ImageLoader
                                    src={supermarket.image}
                                    alt={supermarket.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Store size={48} />
                                </div>
                            )}
                            
                            {/* Badge flotante de Estado */}
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${supermarket.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {supermarket.active ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>

                        {/* Contenido de la Tarjeta (Info) */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{supermarket.name}</h3>
                            
                            {/* Detalles de contacto */}
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="mt-0.5 text-blue-500" />
                                    <span>{supermarket.address}</span>
                                </div>
                                {supermarket.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-blue-500" />
                                        <span>{supermarket.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Acciones de la Tarjeta (Botones) */}
                            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                
                                <button 
                                    onClick={() => handleOpenEdit(supermarket)}
                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <Edit size={18} />
                                </button>

                                {/* Botón Eliminar */}
                                <button 
                                    onClick={() => deleteSupermarket(supermarket._id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Modal Flotante --- */}
            <SupermarketModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                supermarketToEdit={supermarketToEdit} 
            />

        </div>
    );
};

const ImageLoader = ({ src, alt, className, onError }: { src: string; alt: string; className?: string; onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-full bg-gray-100">
            {/* Spinner: Se muestra mientras la imagen no haya cargado */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                </div>
            )}
            
            {/* Imagen: Invisible (opacity-0) hasta que carga, luego hace un fade-in (opacity-100) */}
            <img 
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)} // ¡La magia ocurre aquí!
                onError={(e) => { 
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000';
                    setIsLoaded(true); // Quitamos el spinner aunque falle
                    onError?.(e);
                }}
                className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
            />
        </div>
    );
};