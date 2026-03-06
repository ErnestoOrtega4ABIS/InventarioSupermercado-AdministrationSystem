/* src/App.tsx */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './store/authStore';

import { MainLayout } from './components/layout/MainLayout'; // Ensure the path is correct
import { UsersPage } from './pages/UserPage';
import { LoginPage } from './pages/LoginPage';
import { SupermarketsPage } from './pages/SupermarketsPage'; 
import { InventoryPage } from './pages/InventoryPage'; 
import Dashboard  from './pages/DashboardPage'; 
import MovementHistory from './pages/MovementHistoryPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Route Guard Component (Guardian)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isChecking } = useAuthStore();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                {/* Redirect any other URL to Login if not authenticated */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
  }

  return <>{children}</>;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes wrapped in MainLayout */}
        <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
        }>
            {/* Dashboard (Index Route) */}
            <Route index element={<Dashboard/>} />
            
            {/* System Routes */}
            <Route path="supermarkets" element={<SupermarketsPage />} />
            <Route path="inventory" element={<InventoryPage/>} />
            <Route path="users" element={<UsersPage />} />
            <Route path="history" element={<MovementHistory />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;