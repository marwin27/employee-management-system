import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

const AdminRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoutes;
