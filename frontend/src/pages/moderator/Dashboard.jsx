import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get("/dashboard");
        if (!active) {
          return;
        }

        setDashboard(response.data?.data ?? null);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(err?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return null;
  }

  if (error) {
    return <div style={{ padding: "32px", color: "#b91c1c" }}>{error}</div>;
  }

  const stats = dashboard?.stats ?? {};
  const recentOrders = dashboard?.recent_orders ?? [];
  const recentSpecialOrders = dashboard?.recent_special_orders ?? [];
  const lowStockProducts = dashboard?.low_stock_products ?? [];

  return (
    <>
      <header style={{ marginBottom: "28px" }}>
        <p style={{ color: "#888", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
          Welcome back, {user?.name || "Moderator"}
        </p>
        <h1 style={{ fontFamily: "Fraunces", fontSize: "2.2rem" }}>Moderator Area</h1>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h4>Pending Orders</h4>
          <div className="number">{stats.pending_orders ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>Processed Orders</h4>
          <div className="number">{stats.processed_orders ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>Low Stock</h4>
          <div className="number" style={{ color: "#ff5e78" }}>{stats.low_stock ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>Pending Special Orders</h4>
          <div className="number">{stats.pending_special_orders ?? 0}</div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
        <section className="table-container">
          <div className="section-title">
            Recent Orders
            <Link to="/moderator/orders" style={{ fontSize: "13px", textDecoration: "none" }}>
              View all
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>School</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user?.name || "-"}</td>
                  <td>{order.school?.name || "-"}</td>
                  <td>{order.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="table-container">
          <div className="section-title">
            Quick Links
            <Link to="/moderator/reports" style={{ fontSize: "13px", textDecoration: "none" }}>
              Reports
            </Link>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <Link to="/moderator/products" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              Manage Products
            </Link>
            <Link to="/moderator/stock" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              Review Stock
            </Link>
            <Link to="/moderator/special-orders" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              Special Orders
            </Link>
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <section className="table-container">
          <h3>Recent Special Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>School</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSpecialOrders.length ? recentSpecialOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.school?.name || "-"}</td>
                  <td>{item.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No special orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="table-container">
          <h3>Low Stock Products</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Min</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length ? lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.min_stock}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No stock alerts.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
