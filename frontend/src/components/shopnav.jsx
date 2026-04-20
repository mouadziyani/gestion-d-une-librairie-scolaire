import React from "react";
import { NavLink } from "react-router-dom";

function Shopnav() {
  return (
    <div className="shop-nav-wrapper">
      <nav aria-label="Shop Navigation">
        <ul className="shop-nav-list">
          <li className="shop-nav-item">
            <NavLink to="/shop-home" className={({ isActive }) => isActive ? "active" : ""}>
              Store Front
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
              All Books
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
              My Orders
            </NavLink>
          </li>
          <li className="shop-nav-item">
            <NavLink to="/Profile" className={({ isActive }) => isActive ? "active" : ""}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Shopnav;