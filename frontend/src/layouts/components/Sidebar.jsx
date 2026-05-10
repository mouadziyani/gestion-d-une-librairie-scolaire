import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, ChartColumn, LayoutDashboard, LogOut, PackageSearch, Settings, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import { AuthContext } from "@/features/auth/authContext";
import { getSidebarLinks } from "@/shared/utils/common/helpers";
import { useUiPreferences } from "@/shared/context/UIContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { i18n, language, t } = useUiPreferences();
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

  function translateSidebarLabel(label) {
    const keyByLabel = {
      Dashboard: "sidebar.dashboard",
      Analytics: "sidebar.analytics",
      Products: "sidebar.products",
      "Add Product": "sidebar.addProduct",
      Categories: "sidebar.categories",
      Stock: "sidebar.stock",
      Orders: "sidebar.orders",
      Users: "sidebar.users",
      "Add User": "sidebar.addUser",
      Schools: "sidebar.schools",
      Suppliers: "sidebar.suppliers",
      Invoices: "sidebar.invoices",
      "Special Orders": "sidebar.specialOrders",
      Reports: "sidebar.reports",
      "Roles & Permissions": "sidebar.rolesPermissions",
      Settings: "sidebar.settings",
      "System Config": "sidebar.systemConfig",
      Shop: "sidebar.shop",
      Cart: "sidebar.cart",
      Checkout: "sidebar.checkout",
      Wishlist: "sidebar.wishlist",
      Profile: "sidebar.profile",
    };

    return t(keyByLabel[label] || label);
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
        <p className="nav-group-title">{t("sidebar.mainMenu")}</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            {iconByTitle(item.title || item.label)}
            <span>{translateSidebarLabel(item.label)}</span>
          </NavLink>
        ))}

        <p className="nav-group-title">{t("sidebar.system")}</p>
        {(roleSlug === "admin" || roleSlug === "moderator") && (
          <NavLink to="/admin/settings/general" className="sidebar-link">
            <Settings size={18} />
            <span>{t("sidebar.homeSettings")}</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-preferences">
          <div className="sidebar-language-switch">
            <label className="sidebar-language-label" htmlFor="sidebar-language-select">
              <span className="language-icon" aria-hidden="true">{t("common.languageIcon")}</span>
            </label>
            <select
              id="sidebar-language-select"
              className="sidebar-language-select"
              value={language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              aria-label={t("common.language")}
            >
              <option value="en">🇺🇸</option>
              <option value="fr">🇫🇷</option>
              <option value="ar">🇲🇦</option>
            </select>
          </div>

        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-link sidebar-logout-button"
        >
          <LogOut size={18} />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
