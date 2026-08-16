import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/auth-store';

export function ProtectedRoute() {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}