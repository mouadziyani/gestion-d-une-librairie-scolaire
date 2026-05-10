import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "@/layouts/components/Sidebar";
import { AuthContext } from "@/features/auth/authContext";
import { hasAllowedRole } from "@/shared/utils/common/helpers";
import { useUiPreferences } from "@/shared/context/UIContext";

function RoleRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useUiPreferences();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="dashboard-wrapper">
      {sidebarOpen ? (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          aria-label={t("common.close")}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main">
        <div className="dashboard-mobile-toolbar">
          <button
            type="button"
            className="dashboard-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("navbar.openMenu")}
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
            <span>{t("sidebar.mainMenu")}</span>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

export default RoleRoute;
