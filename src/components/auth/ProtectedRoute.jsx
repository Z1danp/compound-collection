import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
