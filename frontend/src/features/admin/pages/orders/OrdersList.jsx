import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function OrdersList() {
  const location = useLocation();
  const { t } = useUiPreferences();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/orders" : "/admin/orders";
  const detailsPath = isModeratorRoute ? "/moderator/order-details" : "/admin/orders/details";
  const managePath = isModeratorRoute ? null : "/admin/orders/manage";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const response = await api.get("/orders", { params: { page } });
        if (active) {
          const ordersData = response.data?.data;
          setOrders(Array.isArray(ordersData?.data) ? ordersData.data : []);
          setLastPage(ordersData?.last_page || 1);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || t("pages.failedLoadOrders"));
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
  }, [page]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [order.user?.name, order.school?.name, order.status, order.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(order.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? t("pages.moderatorArea") : t("pages.adminArea")} / {t("sidebar.orders")}</span>
          <h2>{t("pages.ordersList")}</h2>
        </div>
        <Link to={isModeratorRoute ? "/moderator/reports" : "/admin/reports/sales"} className="btn-add-role">
          {t("pages.viewSalesReport")}
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="order-search">{t("common.search")}</label>
          <input id="order-search" type="search" placeholder={t("pages.searchOrdersPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="order-status">{t("common.status")}</label>
          <select id="order-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("common.allStatuses")}</option>
            <option value="pending">{t("pages.pending")}</option>
            <option value="processing">{t("pages.processing")}</option>
            <option value="shipped">{t("pages.shipped")}</option>
            <option value="delivered">{t("pages.delivered")}</option>
            <option value="cancelled">{t("pages.cancelled")}</option>
          </select>
        </div>
        {managePath ? (
          <Link to={managePath} className="btn-elegant">
            {t("pages.manageOrders")}
          </Link>
        ) : null}
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("pages.customer")}</th>
                  <th>{t("pages.school")}</th>
                  <th>{t("common.status")}</th>
                  <th>{t("pages.payment")}</th>
                  <th>{t("cart.total")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
            <tbody>
              {!loading ? (
                filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.name || "-"}</td>
                      <td>{order.school?.name || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{order.payment_status || "-"}</td>
                      <td>{Number(order.total_price || 0).toFixed(2)} MAD</td>
                      <td>
                        <Link to={`${detailsPath}?id=${order.id}`} className="action-link">
                          {t("common.view")}
                        </Link>
                        {managePath ? (
                          <Link to={`${managePath}?id=${order.id}`} className="action-link">
                            {t("pages.manageOrders")}
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">{t("pages.noOrdersMatch")}</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <div className="pagination-row pagination-row-top">
        <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {t("common.previous")}
        </button>
        <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}

export default OrdersList;
