/* src/components/supermarket/SuperMarketModal.tsx */ 

import { useState, useEffect } from 'react';
import { X, Save, Store, MapPin, Phone } from 'lucide-react';
import { useSupermarketStore } from '../../store/supermarketStore';
import type { Supermarket } from '../../types/index';

interface SupermarketModalProps {
    isOpen: boolean;
    onClose: () => void;
    supermarketToEdit?: Supermarket | null; 
}

export const SupermarketModal = ({ isOpen, onClose, supermarketToEdit }: SupermarketModalProps) => {
    const { addSupermarket, updateSupermarket } = useSupermarketStore();
    const [isLoading, setIsLoading] = useState(false);

    // Inicialization 
    const [formData, setFormData] = useState<Partial<Supermarket>>({
        name: '',
        address: '',
        phone: '',
        active: true
    });

    // Controlled effect: We only fill in data when the modal OPENS.
    useEffect(() => {
        if (isOpen) {
            if (supermarketToEdit) {
                setFormData(supermarketToEdit); // Modo Editar
            } else {
                setFormData({ name: '', address: '', phone: '', active: true }); // Create Mode
            }
        }
    }, [isOpen, supermarketToEdit]); // We depend on isOpen and supermarketToEdit

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // We decide which function to call based on whether there is a super to edit.
        if (supermarketToEdit) {
            await updateSupermarket(supermarketToEdit._id, formData);
        } else {
            await addSupermarket(formData);
        }
        
        setIsLoading(false);
        onClose(); 
    };

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Dinamic Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Store className="text-rose-600" size={24} />
                        {supermarketToEdit ? 'Editar Supermercado' : 'Nuevo Supermercado'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sucursal</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 outline-none transition-all"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="tel"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 outline-none transition-all"
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Status checkbox (Only visible when editing) */}
                    {supermarketToEdit && (
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-600"
                            />
                            <label htmlFor="active" className="text-sm text-gray-700">Sucursal Activa</label>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2">
                            {isLoading ? 'Guardando...' : <><Save size={18} />Guardar</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};