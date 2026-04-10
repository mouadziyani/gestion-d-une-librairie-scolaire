import React, { useState } from "react";
import { Link } from "react-router-dom";

function RouteTester() {
  const [isOpen, setIsOpen] = useState(false);

  const routes = {
    guest: [
      { path: "/", label: "🏠 Home" },
      { path: "/products", label: "🛍️ Products" },
      { path: "/ProductDetail", label: "🔍 Product Detail" },
      { path: "/SpecialOrder", label: "📝 Special Order" },
      { path: "/About", label: "📖 About" },
      { path: "/Contact", label: "📞 Contact" },
      { path: "/FAQ", label: "❓ FAQ" },
    ],
    auth: [
      { path: "/login", label: "🔑 Login" },
      { path: "/register", label: "📝 Register" },
      { path: "/forgot-password", label: "❓ Forgot Password" },
      { path: "/reset-password", label: "🔄 Reset Password" },
    ],
    admin: [
      { path: "/dashboard", label: "📊 Dashboard" },
      { path: "/ProductsListAdmin", label: "📋 Products List (Admin)" },
      { path: "/AddProductAdmin", label: "➕ Add Product" },
      { path: "/EditProductAdmin", label: "✏️ Edit Product" },
      { path: "/ProductDetailsAdmin", label: "👁️ Product Details (Admin)" },
      { path: "/CategoriesAdmin", label: "📁 Categories" },
      { path: "/StockList", label: "📦 Stock List" },
      { path: "/UpdateStock", label: "🔄 Update Stock" },
      { path: "/StockHistory", label: "📜 Stock History" },
    ],
  };

  return (
    <div className="route-tester-container">
      <button className="tester-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖ Close Tester" : "🚀 Test Routes"}
      </button>

      {isOpen && (
        <div className="tester-menu">
          <h2 style={{ fontSize: "16px", marginBottom: "15px" }}>Dev Route Navigator</h2>
          
          <h4>Guest Pages</h4>
          <div className="tester-grid">
            {routes.guest.map((r) => (
              <Link key={r.path} to={r.path} className="tester-link" onClick={() => setIsOpen(false)}>
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Auth Pages</h4>
          <div className="tester-grid">
            {routes.auth.map((r) => (
              <Link key={r.path} to={r.path} className="tester-link" onClick={() => setIsOpen(false)}>
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Admin Area</h4>
          <div className="tester-grid">
            {routes.admin.map((r) => (
              <Link key={r.path} to={r.path} className="tester-link admin-link-test" onClick={() => setIsOpen(false)}>
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteTester;