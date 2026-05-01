import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/features/auth/authContext";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

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
  const { t } = useUiPreferences();
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

        setError(err?.response?.data?.message || t("pages.failedLoadDashboard"));
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
    { label: t("dashboard.totalUsers"), value: stats.total_users ?? 0 },
    { label: t("dashboard.totalProducts"), value: stats.total_products ?? 0 },
    { label: t("dashboard.totalOrders"), value: stats.total_orders ?? 0 },
    { label: t("dashboard.pendingOrders"), value: stats.pending_orders ?? 0 },
    { label: t("dashboard.lowStock"), value: stats.low_stock ?? 0 },
    { label: t("dashboard.totalRevenue"), value: formatMoney(stats.total_revenue ?? 0) },
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
        <h1>{t("dashboard.adminTitle")}</h1>
        <p>{t("dashboard.adminSubtitle")} {user?.name ? `- ${user.name}` : ""}</p>
      </header>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <h4>{card.label}</h4>
            <div className="value" style={{ color: card.label === t("dashboard.lowStock") ? "#ff5e78" : undefined }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <section className="table-container">
        <h3>{t("dashboard.recentOrders")}</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("pages.customer")}</th>
              <th>{t("pages.school")}</th>
              <th>{t("common.status")}</th>
              <th>{t("cart.total")}</th>
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
                <td colSpan="5">{t("dashboard.noRecentOrders")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <section className="table-container">
          <h3>{t("dashboard.recentProducts")}</h3>
          <table>
            <thead>
              <tr>
                <th>{t("pages.name")}</th>
                <th>{t("navbar.categories")}</th>
                <th>{t("pages.stock")}</th>
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
                  <td colSpan="3">{t("dashboard.noProducts")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="table-container">
          <h3>{t("dashboard.lowStockProducts")}</h3>
          <table>
            <thead>
              <tr>
                <th>{t("pages.name")}</th>
                <th>{t("pages.stock")}</th>
                <th>{t("pages.min")}</th>
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
                  <td colSpan="3">{t("dashboard.stockHealthy")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className="table-container" style={{ marginTop: "24px" }}>
        <h3>{t("dashboard.recentSpecialOrders")}</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("pages.item")}</th>
              <th>{t("pages.school")}</th>
              <th>{t("common.status")}</th>
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
                <td colSpan="4">{t("dashboard.noSpecialOrders")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default AdminDashboard;
