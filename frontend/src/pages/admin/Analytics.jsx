import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        const response = await api.get("/dashboard");
        if (active) {
          setDashboard(response.data?.data ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load analytics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats || {};
  const revenue = useMemo(() => [
    { label: "Revenue", value: formatMoney(stats.total_revenue || 0) },
    { label: "Total orders", value: stats.total_orders || 0 },
    { label: "Pending orders", value: stats.pending_orders || 0 },
    { label: "Low stock", value: stats.low_stock || 0 },
    { label: "Pending special orders", value: stats.pending_special_orders || 0 },
    { label: "Categories", value: stats.categories || 0 },
  ], [stats]);

  return (
    <div className="admin-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / ANALYTICS</span>
          <h1 className="page-shell-title">Analytics</h1>
          <p className="page-shell-subtitle">High-level numbers pulled from the live dashboard endpoint.</p>
        </div>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      {!loading ? (
        <>
          <div className="admin-stats-row">
            {revenue.map((item) => (
              <div key={item.label} className="summary-box light">
                <div>
                  <span className="eyebrow-label">{item.label}</span>
                  <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-detail-container" style={{ padding: 0, gridTemplateColumns: "1fr 1fr" }}>
            <section className="invoice-paper">
              <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Recent Orders</h2>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.recent_orders || []).length ? dashboard.recent_orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.user?.name || "-"}</td>
                        <td>{order.status || "-"}</td>
                        <td>{formatMoney(order.total_price || 0)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3">No recent orders.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="invoice-paper">
              <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Revenue Signals</h2>
              <div className="landing-cards-grid" style={{ gridTemplateColumns: "1fr", gap: "14px" }}>
                <div className="landing-highlight-card">
                  <h4>Pending special orders</h4>
                  <p>{stats.pending_special_orders || 0}</p>
                </div>
                <div className="landing-highlight-card">
                  <h4>Low stock products</h4>
                  <p>{stats.low_stock || 0}</p>
                </div>
                <div className="landing-highlight-card">
                  <h4>Total users</h4>
                  <p>{stats.total_users || 0}</p>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Analytics;
