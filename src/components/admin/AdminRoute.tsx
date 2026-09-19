import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);

  // If no user or user is not an admin, redirect to login
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
