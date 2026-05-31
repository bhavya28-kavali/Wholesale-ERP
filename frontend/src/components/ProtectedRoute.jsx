import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { canAccess } from '../utils/roles';

const ProtectedRoute = ({ children, page }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-8 text-sm text-slate-500">Checking session...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (page && !canAccess(user.role, page)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
