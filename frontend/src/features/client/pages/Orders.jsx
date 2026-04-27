import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/shared/services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Orders() {
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
          setError(err?.response?.data?.message || "Failed to load your orders.");
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
  }, []);

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
          <span className="eyebrow-label">CLIENT / ORDERS</span>
          <h1 className="page-shell-title">My Orders</h1>
          <p className="page-shell-subtitle">Track your orders, delivery status, and payment state.</p>
        </div>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="client-order-search">Search</label>
          <input
            id="client-order-search"
            type="search"
            placeholder="Search by id, status, or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="client-order-status">Status</label>
          <select id="client-order-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Link to="/checkout" className="btn-elegant">
          New checkout
        </Link>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>School</th>
                <th>Payment</th>
                <th>Status</th>
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
                      <td>{order.school?.name || "-"}</td>
                      <td>{order.payment_status || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{formatMoney(order.total_price || 0)}</td>
                      <td>
                        <Link to={`/order-detail?id=${order.id}`} className="action-link">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No orders match your filters.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="6">Loading your orders...</td>
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
