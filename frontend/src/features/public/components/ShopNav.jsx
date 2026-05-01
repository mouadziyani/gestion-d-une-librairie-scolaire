import React from "react";
import { NavLink } from "react-router-dom";
import { useUiPreferences } from "@/shared/context/UIContext";

function Shopnav() {
  const { t } = useUiPreferences();
  return (
    <div className="shop-nav-wrapper">
      <nav aria-label={t("navbar.pages")}>
        <ul className="shop-nav-list">
          <li className="shop-nav-item">
            <NavLink to="/shop-home" className={({ isActive }) => isActive ? "active" : ""}>
              {t("common.brandName")}
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
              {t("footer.allProducts")}
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
              {t("clientOrders.title")}
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
              {t("sidebar.settings")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Shopnav;
