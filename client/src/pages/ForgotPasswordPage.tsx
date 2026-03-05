import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, AlertCircle, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import type { AxiosError } from 'axios';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message || 'Se ha enviado un enlace a tu correo.');
            setEmail(''); // Limpiamos el input
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden p-4">
            {/* Formas Degradadas de Fondo (Blobs) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-rose-400 to-rose-900 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-gradient-to-tl from-rose-950 via-rose-800 to-red-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none"></div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden p-8">
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-rose-800 to-rose-900 rounded-2xl shadow-lg shadow-rose-900/30 mb-5">
                            <KeyRound className="text-white h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recuperar Acceso</h2>
                        <p className="text-gray-500 font-medium mt-2 text-sm">
                            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50/90 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm border border-red-100 shadow-sm">
                                <AlertCircle className="flex-shrink-0" size={18} />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-50/90 text-green-700 p-4 rounded-xl flex items-center gap-3 text-sm border border-green-100 shadow-sm">
                                <CheckCircle className="flex-shrink-0" size={18} />
                                <span className="font-medium">{message}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400 group-focus-within:text-rose-700 transition-colors" size={20} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 outline-none transition-all placeholder-gray-400 text-gray-800 font-medium"
                                    placeholder="joedoe@example.com"
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || !!message}
                            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
                                ${isLoading || !!message
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-rose-800 to-rose-950 hover:from-rose-700 hover:to-rose-900 shadow-lg shadow-rose-900/30 hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-rose-700 hover:text-rose-800 transition-colors">
                            <ArrowLeft size={16} />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};