import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedUserRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  console.log(isAuthenticated, "auth");
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedUserRoute;
