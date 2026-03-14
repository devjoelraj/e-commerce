import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenManager } from "../api/tokenManager";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const user = tokenManager.getUser();

  if (isLoading) {
    return <div>Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
