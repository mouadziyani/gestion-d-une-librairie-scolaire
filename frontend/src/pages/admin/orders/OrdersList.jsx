import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../../services/api";

function OrdersList() {
  const location = useLocation();
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
          setError(err?.response?.data?.message || "Failed to load orders.");
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
          <span className="eyebrow-label">{isModeratorRoute ? "MODERATOR" : "ADMIN"} / ORDERS</span>
          <h2>Orders List</h2>
        </div>
        <Link to={isModeratorRoute ? "/moderator/reports" : "/admin/reports/sales"} className="btn-add-role">
          View Sales Report
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="order-search">Search</label>
          <input id="order-search" type="search" placeholder="Search by customer, school, or id..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="order-status">Status</label>
          <select id="order-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {managePath ? (
          <Link to={managePath} className="btn-elegant">
            Manage orders
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
                  <th>Customer</th>
                  <th>School</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Actions</th>
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
                          View
                        </Link>
                        {managePath ? (
                          <Link to={`${managePath}?id=${order.id}`} className="action-link">
                            Manage
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No orders match your filters.</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default OrdersList;
