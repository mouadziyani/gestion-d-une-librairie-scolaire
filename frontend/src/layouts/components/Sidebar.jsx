import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, PackageSearch, ShoppingCart, BookOpen, ChartColumn, ShieldCheck } from "lucide-react";
import { AuthContext } from "@/features/auth/authContext";
import { getSidebarLinks } from "@/shared/utils/common/helpers";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const roleSlug = user?.role?.slug;
  const menuItems = getSidebarLinks(roleSlug);

  const iconByTitle = (title) => {
    const normalized = (title || "").toLowerCase();

    if (normalized.includes("dashboard")) return <LayoutDashboard size={18} />;
    if (normalized.includes("analytic") || normalized.includes("report")) return <ChartColumn size={18} />;
    if (normalized.includes("product") || normalized.includes("category")) return <BookOpen size={18} />;
    if (normalized.includes("stock")) return <PackageSearch size={18} />;
    if (normalized.includes("order") || normalized.includes("checkout")) return <ShoppingCart size={18} />;
    if (normalized.includes("user") || normalized.includes("customer")) return <Users size={18} />;
    if (normalized.includes("setting") || normalized.includes("config")) return <Settings size={18} />;
    if (normalized.includes("role") || normalized.includes("permission")) return <ShieldCheck size={18} />;

    return <LayoutDashboard size={18} />;
  };

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error?.response?.data || error);
    }
  }

  if (!roleSlug) {
    return null;
  }

  return (
    <aside className="main-sidebar">
      <div className="sidebar-logo">
        <strong>BOUGDIM</strong>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-group-title">Main Menu</p>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            {iconByTitle(item.title || item.label)}
            <span>{item.label}</span>
          </NavLink>
        ))}

        <p className="nav-group-title">System</p>
        {(roleSlug === "admin" || roleSlug === "moderator") && (
          <NavLink to="/GeneralSettings" className="sidebar-link">
            <Settings size={18} />
            <span>Home Settings</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar; 
