import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, CreditCard, FileText, ShoppingBag } from "lucide-react";
import { AuthContext } from "@/features/auth/authContext";
import { api } from "@/shared/services/api";

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function DashboardClient() {
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
  const recentInvoices = dashboard?.recent_invoices ?? [];
  const recentSpecialOrders = dashboard?.recent_special_orders ?? [];

  const clientStats = [
    { title: "Current Orders", value: stats.current_orders ?? 0, icon: <Box size={20} />, color: "#1a1a1a" },
    { title: "Pending Invoices", value: stats.pending_invoices ?? 0, icon: <FileText size={20} />, color: "#ff4757" },
    { title: "Total Spent", value: formatMoney(stats.total_spent ?? 0), icon: <CreditCard size={20} />, color: "#2ecc71" },
    { title: "Special Orders", value: stats.pending_special_orders ?? 0, icon: <ShoppingBag size={20} />, color: "#e67e22" },
  ];

  return (
    <>
      <header style={{ marginBottom: "40px" }}>
        <p style={{ color: "#888", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
          Welcome back, {user?.name || "Client"}
        </p>
        <h1 style={{ fontFamily: "Fraunces", fontSize: "2.5rem" }}>Client Space.</h1>
      </header>

      <section className="stats-grid">
        {clientStats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div style={{ marginBottom: "15px", color: stat.color }}>{stat.icon}</div>
            <h4>{stat.title}</h4>
            <div className="number">{stat.value}</div>
          </div>
        ))}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
        <section>
          <div className="section-title">
            My Recent Orders
            <Link to="/products" style={{ fontSize: "13px", textDecoration: "none" }}>
              Continue Shopping
            </Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>School</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length ? recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.school?.name || "-"}</td>
                    <td>{order.status}</td>
                    <td>{formatMoney(order.total_price)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="section-title">Support & Help</div>
          <div className="stat-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <ShoppingBag size={40} color="#eee" style={{ marginBottom: "15px" }} />
            <h3 style={{ marginBottom: "10px" }}>Need help with an order?</h3>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
              Our team in El Aaioun is available from 09:00 to 19:00.
            </p>
            <Link to="/Contact" className="btn-update-profile" style={{ display: "inline-block", textDecoration: "none", width: "100%" }}>
              Contact Library
            </Link>
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "30px" }}>
        <section className="table-container">
          <h3>Recent Invoices</h3>
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length ? recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.status}</td>
                  <td>{formatMoney(invoice.total_amount)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No invoices yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="table-container">
          <h3>Special Orders</h3>
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
      </div>
    </>
  );
}

export default DashboardClient;
