import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function BasicReports() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const response = await api.get("/dashboard");
        if (active) {
          setDashboard(response.data?.data ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load moderator reports.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats || {};
  const reportCards = useMemo(
    () => [
      { label: "Pending orders", value: stats.pending_orders || 0, tone: "neutral" },
      { label: "Processed orders", value: stats.processed_orders || 0, tone: "positive" },
      { label: "Low stock alerts", value: stats.low_stock || 0, tone: "warning" },
      { label: "Pending special orders", value: stats.pending_special_orders || 0, tone: "neutral" },
      { label: "Pending payments", value: stats.pending_payments || 0, tone: "warning" },
    ],
    [stats],
  );

  const recentOrders = dashboard?.recent_orders || [];
  const recentSpecialOrders = dashboard?.recent_special_orders || [];
  const lowStockProducts = dashboard?.low_stock_products || [];

  return (
    <div className="admin-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">MODERATOR / REPORTS</span>
          <h1 className="page-shell-title">Moderator Reports</h1>
          <p className="page-shell-subtitle">Operational snapshot for orders, stock, and special requests.</p>
        </div>
        <Link to="/moderator/orders" className="btn-add-role">
          Review orders
        </Link>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      {!loading ? (
        <>
          <div className="admin-stats-row">
            {reportCards.map((item) => (
              <div key={item.label} className="summary-box light">
                <div>
                  <span className="eyebrow-label">{item.label}</span>
                  <h3
                    className="page-shell-title"
                    style={{
                      fontSize: "1.9rem",
                      margin: "8px 0 0",
                      color: item.tone === "warning" ? "#b45309" : item.tone === "positive" ? "#047857" : "inherit",
                    }}
                  >
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
                      <th>School</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length ? (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.user?.name || "-"}</td>
                          <td>{order.school?.name || "-"}</td>
                          <td>{order.status || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No recent orders.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="invoice-paper">
              <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Recent Special Orders</h2>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>School</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSpecialOrders.length ? (
                      recentSpecialOrders.map((item) => (
                        <tr key={item.id}>
                          <td>{item.item_name || "-"}</td>
                          <td>{item.school?.name || "-"}</td>
                          <td>{item.status || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No special orders available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="admin-detail-container" style={{ padding: 0, gridTemplateColumns: "1fr" }}>
            <section className="invoice-paper">
              <div className="section-title">
                <span>Low Stock Products</span>
                <span>{lowStockProducts.length} items</span>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock</th>
                      <th>Min</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.length ? (
                      lowStockProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name || "-"}</td>
                          <td>{product.stock ?? 0}</td>
                          <td>{product.min_stock ?? 0}</td>
                          <td>{formatMoney(product.price || 0)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No low stock products.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default BasicReports;
