import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import myIcon from "../assets/loader.svg";

const ProtectedUserRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  console.log(isAuthenticated, "auth");
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

  return children;
};

export default ProtectedUserRoute;
