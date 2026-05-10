import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/features/auth/authContext";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function Dashboard() {
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
          {t("dashboard.welcomeBack")}, {user?.name || t("dashboard.moderatorTitle")}
        </p>
        <h1 style={{ fontFamily: "Fraunces", fontSize: "2.2rem" }}>{t("dashboard.moderatorTitle")}</h1>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h4>{t("dashboard.pendingOrders")}</h4>
          <div className="number">{stats.pending_orders ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>{t("dashboard.processedOrders")}</h4>
          <div className="number">{stats.processed_orders ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>{t("dashboard.lowStock")}</h4>
          <div className="number" style={{ color: "#ff5e78" }}>{stats.low_stock ?? 0}</div>
        </div>
        <div className="stat-card">
          <h4>{t("dashboard.pendingSpecialOrders")}</h4>
          <div className="number">{stats.pending_special_orders ?? 0}</div>
        </div>
      </section>

      <div className="dashboard-split-grid dashboard-split-grid-wide">
        <section className="table-container">
          <div className="section-title">
            {t("dashboard.recentOrders")}
            <Link to="/moderator/orders" style={{ fontSize: "13px", textDecoration: "none" }}>
              {t("dashboard.viewAll")}
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("pages.customer")}</th>
                <th>{t("pages.school")}</th>
                <th>{t("common.status")}</th>
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
                    <td colSpan="4">{t("dashboard.noRecentOrders")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

        <section className="table-container">
          <div className="section-title">
            {t("dashboard.quickLinks")}
            <Link to="/moderator/reports" style={{ fontSize: "13px", textDecoration: "none" }}>
              {t("dashboard.reports")}
            </Link>
          </div>
          <div className="dashboard-link-stack">
            <Link to="/moderator/products" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              {t("dashboard.manageProducts")}
            </Link>
            <Link to="/moderator/stock" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              {t("dashboard.reviewStock")}
            </Link>
            <Link to="/moderator/special-orders" className="btn-update-profile" style={{ textDecoration: "none", textAlign: "center" }}>
              {t("dashboard.specialOrders")}
            </Link>
          </div>
        </section>
      </div>

      <div className="dashboard-split-grid dashboard-split-grid-tight">
        <section className="table-container">
          <h3>{t("dashboard.recentSpecialOrders")}</h3>
          <table>
            <thead>
              <tr>
                <th>{t("pages.item")}</th>
                <th>{t("pages.school")}</th>
                <th>{t("common.status")}</th>
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
                    <td colSpan="3">{t("dashboard.noSpecialOrders")}</td>
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
                    <td colSpan="3">{t("dashboard.noStockAlerts")}</td>
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
