import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenManager } from "../api/tokenManager";
import myIcon from "../assets/loader.svg";

const ProtectedAdminOnlyRoute = ({ children }) => {
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
        <img src={myIcon} alt="Loading" className="my-icon" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminOnlyRoute;
