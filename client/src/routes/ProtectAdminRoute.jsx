import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenManager } from "../api/tokenManager";

import myIcon from "../assets/loader.svg";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const user = tokenManager.getUser();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <img src={myIcon} alt="description" className="my-icon" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
