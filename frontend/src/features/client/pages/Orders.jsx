import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Orders() {
  const { t } = useUiPreferences();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await api.get("/orders/mine");
        if (active) {
          setOrders(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || t("clientOrders.failedLoadOrders"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, [t]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [order.id, order.status, order.school?.name, order.payment_method]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(order.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="dashboard-container">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">{t("clientOrders.eyebrow")}</span>
          <h1 className="page-shell-title">{t("clientOrders.title")}</h1>
          <p className="page-shell-subtitle">{t("clientOrders.subtitle")}</p>
        </div>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="client-order-search">{t("clientOrders.search")}</label>
          <input
            id="client-order-search"
            type="search"
            placeholder={t("clientOrders.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="client-order-status">{t("clientOrders.status")}</label>
          <select id="client-order-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("common.allStatuses")}</option>
            <option value="pending">{t("pages.pending")}</option>
            <option value="processing">{t("pages.processing")}</option>
            <option value="shipped">{t("pages.shipped")}</option>
            <option value="delivered">{t("pages.delivered")}</option>
            <option value="cancelled">{t("pages.cancelled")}</option>
          </select>
        </div>
        <Link to="/checkout" className="btn-elegant">
          {t("clientOrders.newCheckout")}
        </Link>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t("clientOrders.id")}</th>
                <th>{t("clientOrders.school")}</th>
                <th>{t("clientOrders.payment")}</th>
                <th>{t("clientOrders.status")}</th>
                <th>{t("clientOrders.total")}</th>
                <th>{t("clientOrders.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.school?.name || "-"}</td>
                      <td>{order.payment_status || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{formatMoney(order.total_price || 0)}</td>
                      <td>
                        <Link to={`/order-detail?id=${order.id}`} className="action-link">
                          {t("clientOrders.view")}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">{t("clientOrders.noOrdersMatch")}</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="6">{t("clientOrders.loadingOrders")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Orders;
