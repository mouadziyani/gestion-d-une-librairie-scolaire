import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function AdminDashboard() {
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

  const stats = dashboard?.stats ?? {};
  const recentOrders = dashboard?.recent_orders ?? [];
  const recentProducts = dashboard?.recent_products ?? [];
  const lowStockProducts = dashboard?.low_stock_products ?? [];
  const recentSpecialOrders = dashboard?.recent_special_orders ?? [];

  const statCards = [
    { label: "Total Users", value: stats.total_users ?? 0 },
    { label: "Total Products", value: stats.total_products ?? 0 },
    { label: "Total Orders", value: stats.total_orders ?? 0 },
    { label: "Pending Orders", value: stats.pending_orders ?? 0 },
    { label: "Low Stock", value: stats.low_stock ?? 0 },
    { label: "Total Revenue", value: formatMoney(stats.total_revenue ?? 0) },
  ];

  if (loading) {
    return null;
  }

  if (error) {
    return <div style={{ padding: "32px", color: "#b91c1c" }}>{error}</div>;
  }

  return (
    <>
      <header className="dashboard-header">
        <h1>Library BOUGDIM</h1>
        <p>Admin Overview & Analytics {user?.name ? `- ${user.name}` : ""}</p>
      </header>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <h4>{card.label}</h4>
            <div className="value" style={{ color: card.label === "Low Stock" ? "#ff5e78" : undefined }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <section className="table-container">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>School</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length ? recentOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name || "-"}</td>
                <td>{order.school?.name || "-"}</td>
                <td>{order.status}</td>
                <td>{formatMoney(order.total_price)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No recent orders.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <section className="table-container">
          <h3>Recent Products</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length ? recentProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category?.name || "-"}</td>
                  <td>{product.stock}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No products found.</td>
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
                  <td colSpan="3">Stock is healthy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className="table-container" style={{ marginTop: "24px" }}>
        <h3>Recent Special Orders</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>School</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSpecialOrders.length ? recentSpecialOrders.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.item_name}</td>
                <td>{item.school?.name || "-"}</td>
                <td>{item.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4">No special orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default AdminDashboard;
