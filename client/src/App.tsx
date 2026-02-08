/* src/App.tsx */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './components/layout/MainLayout';

// Componente para proteger rutas (Guardian)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isChecking } = useAuthStore();

  if (isChecking) {
    // Spinner de carga mientras verificamos la sesión
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Intentar recuperar la sesión al cargar la app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas envueltas en el Layout */}
        <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
        }>
            {/* Dashboard (Ruta Index) */}
            <Route index element={
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard General</h1>
                  <p className="text-gray-500 mt-2">Bienvenido al panel de control.</p>
              </div>
            } />
            
            {/* Futuras Rutas */}
            <Route path="inventory" element={<div>Página de Inventario (Próximamente)</div>} />
            <Route path="users" element={<div>Gestión de Usuarios</div>} />
            <Route path="settings" element={<div className="p-6">Panel de Configuración</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;