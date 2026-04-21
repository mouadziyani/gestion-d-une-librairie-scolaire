import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { hasAllowedRole } from "../utils/helpers";

function RoleRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading && !user) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleSlug = user?.role?.slug;

  if (!roleSlug) {
    return loading ? null : <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAllowedRole(roleSlug, allowedRoles)) {
    return <Navigate to="/Unauthorized" replace />;
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}

export default RoleRoute;
