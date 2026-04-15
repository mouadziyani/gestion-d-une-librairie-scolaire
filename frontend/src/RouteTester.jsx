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
      { path: "/Cart", label: "🛒 Shopping Cart" },
    ],

    auth: [
      { path: "/login", label: "🔑 Login" },
      { path: "/register", label: "📝 Register" },
      { path: "/forgot-password", label: "❓ Forgot Password" },
      { path: "/reset-password", label: "🔄 Reset Password" },
      { path: "/Profile", label: "👤 Profile" },
    ],

    admin: [
      { path: "/dashboard", label: "📊 Dashboard" },
      { path: "/ProductsListAdmin", label: "📋 Products List" },
      { path: "/AddProductAdmin", label: "➕ Add Product" },
      { path: "/EditProductAdmin", label: "✏️ Edit Product" },
      { path: "/ProductDetailsAdmin", label: "👁️ Product Details" },
      { path: "/CategoriesAdmin", label: "📁 Categories" },
      { path: "/StockList", label: "📦 Stock List" },
      { path: "/UpdateStock", label: "🔄 Update Stock" },
      { path: "/StockHistory", label: "📜 Stock History" },
      { path: "/SystemConfig", label: "🛠️ System Config" },
      { path: "/RolesPermissions", label: "🔐 Roles & Permissions" },
      { path: "/GeneralSettings", label: "⚙️ General Settings" },
    ],

    client: [
      { path: "/MyInvoices", label: "🧾 My Invoices" },
      { path: "/InvoiceDetail", label: "📄 Invoice Detail" },
    ],

    system: [
      { path: "/Notifications", label: "🔔 Notifications" },
      { path: "/Header", label: "🧩 Header (Test)" },
    ],

    error: [
      { path: "/Unauthorized", label: "🔒 Unauthorized (403)" },
      { path: "/ServerError", label: "⚙️ Server Error (500)" },
      { path: "/NotFound", label: "🚫 Not Found (404)" },
    ],
  };

  return (
    <div className="route-tester-container">
      <button className="tester-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖ Close" : "🚀 Navigator"}
      </button>

      {isOpen && (
        <div className="tester-menu">
          <h2
            style={{
              fontSize: "16px",
              marginBottom: "15px",
              borderBottom: "2px solid #ff4757",
              paddingBottom: "10px",
            }}
          >
            Dev Route Navigator
          </h2>

          <h4>Guest</h4>
          <div className="tester-grid">
            {routes.guest.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link"
                onClick={() => setIsOpen(false)}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Auth</h4>
          <div className="tester-grid">
            {routes.auth.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link"
                onClick={() => setIsOpen(false)}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Admin</h4>
          <div className="tester-grid">
            {routes.admin.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link admin-link-test"
                onClick={() => setIsOpen(false)}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Client</h4>
          <div className="tester-grid">
            {routes.client.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link"
                onClick={() => setIsOpen(false)}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <h4>System</h4>
          <div className="tester-grid">
            {routes.system.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link"
                onClick={() => setIsOpen(false)}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <h4>Errors</h4>
          <div className="tester-grid">
            {routes.error.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="tester-link"
                style={{ color: "#ff6b6b" }}
                onClick={() => setIsOpen(false)}
              >
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