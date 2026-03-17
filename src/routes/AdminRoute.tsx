import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const userRole = localStorage.getItem("userRole") || "consultor";

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return userRole === "admin" ? <Outlet /> : <Navigate to="/consultant-dashboard" replace />;
};

export default AdminRoute;