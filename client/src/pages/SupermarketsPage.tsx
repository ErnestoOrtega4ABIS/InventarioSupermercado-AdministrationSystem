import { useEffect } from 'react';
import { useSupermarketStore } from '../store/supermarketStore';
import { Plus, MapPin, Phone, Trash2, Store } from 'lucide-react';

export const SupermarketsPage = () => {
    const { supermarkets, fetchSupermarkets, deleteSupermarket, isLoading } = useSupermarketStore();

    useEffect(() => {
        fetchSupermarkets();
    }, [fetchSupermarkets]);

    return (
        <div className="space-y-6">
            {/* Encabezado de la Sección */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Supermercados</h1>
                    <p className="text-gray-500">Gestiona las sucursales y sus ubicaciones.</p>
                </div>
                <button 
                    onClick={() => alert('Aquí abriremos el Modal de Crear')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    Nuevo Supermercado
                </button>
            </div>

            {/* Estado de Carga */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Estado Vacío */}
            {!isLoading && supermarkets.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Store className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay supermercados</h3>
                    <p className="text-gray-500 mt-1">Comienza registrando tu primera sucursal.</p>
                </div>
            )}

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supermarkets.map((supermarket) => (
                    <div key={supermarket._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                        {/* Imagen (Placeholder o Real) */}
                        <div className="h-40 bg-gray-200 relative">
                            {supermarket.image ? (
                                <img 
                                    src={supermarket.image} // Nota: Si es URL local, asegúrate que el backend sirva estáticos
                                    alt={supermarket.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000' }} // Fallback elegante
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Store size={48} />
                                </div>
                            )}
                            
                            {/* Badge de Estado */}
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${supermarket.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {supermarket.active ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{supermarket.name}</h3>
                            
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

                            {/* Acciones */}
                            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                <button 
                                    onClick={() => deleteSupermarket(supermarket._id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                                {/* Aquí agregaremos el botón de editar luego */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};