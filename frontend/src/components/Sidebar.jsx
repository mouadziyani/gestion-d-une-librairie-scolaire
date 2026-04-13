import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Settings, 
  LogOut,
  PackageSearch
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { title: "Inventory", path: "/StockList", icon: <PackageSearch size={18} /> },
    { title: "Orders", path: "/orders", icon: <ShoppingCart size={18} /> },
    { title: "Customers", path: "/users", icon: <Users size={18} /> },
  ];

  return (
    <aside className="main-sidebar">
      <div className="sidebar-logo">
        <strong>BOUGDIM</strong>.lab
      </div>

      <nav className="sidebar-nav">
        <p className="nav-group-title">Main Menu</p>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}

        <p className="nav-group-title">System</p>
        <NavLink to="/GeneralSettings" className="sidebar-link">
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar; 