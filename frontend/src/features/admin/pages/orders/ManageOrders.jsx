import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/shared/services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function ManageOrders() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [form, setForm] = useState({
    status: "pending",
    payment_status: "unpaid",
  });

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

  const selectedOrder = useMemo(() => orders.find((order) => String(order.id) === String(orderId)), [orders, orderId]);

  useEffect(() => {
    if (selectedOrder) {
      setForm({
        status: selectedOrder.status || "pending",
        payment_status: selectedOrder.payment_status || "unpaid",
      });
    }
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [order.id, order.user?.name, order.school?.name, order.status, order.payment_status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(order.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  async function handleSave(event) {
    event.preventDefault();
    if (!selectedOrder) {
      return;
    }

    setSaving(true);
    setActionMessage("");
    setError("");

    try {
      const response = await api.patch(`/orders/${selectedOrder.id}/status`, form);
      const updatedOrder = response.data?.data;
      setOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      setActionMessage("Order status updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update the order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">ADMIN / ORDERS</span>
          <h2>Manage Orders</h2>
        </div>
        <Link to="/admin/orders" className="btn-add-role">
          Back to orders
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="order-search">Search</label>
          <input
            id="order-search"
            type="search"
            placeholder="Search by customer, school, or id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        <Link to="/admin/reports/sales" className="btn-elegant">
          View Sales Report
        </Link>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}
      {actionMessage ? <p className="form-alert form-alert-success">{actionMessage}</p> : null}

      <div className="admin-card" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        <div className="admin-stats-strip">
          <div className="stat-item">
            <span>Selected order</span>
            <strong>{selectedOrder ? `#${selectedOrder.id}` : "None selected"}</strong>
          </div>
          <div className="stat-item">
            <span>Status</span>
            <strong>{selectedOrder?.status || "-"}</strong>
          </div>
          <div className="stat-item">
            <span>Customer</span>
            <strong>{selectedOrder?.user?.name || "-"}</strong>
          </div>
          <div className="stat-item">
            <span>Total</span>
            <strong>{selectedOrder ? formatMoney(selectedOrder.total_price || 0) : "-"}</strong>
          </div>
        </div>

        {selectedOrder ? (
          <form onSubmit={handleSave} className="create-card" style={{ padding: "24px" }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="status-select">Order Status</label>
                <select id="status-select" value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="payment-status-select">Payment Status</label>
                <select
                  id="payment-status-select"
                  value={form.payment_status}
                  onChange={(e) => setForm((current) => ({ ...current, payment_status: e.target.value }))}
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button type="submit" className="btn-elegant" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <Link to={`/admin/orders/details?id=${selectedOrder.id}`} className="btn-archive">
                Open details
              </Link>
            </div>
          </form>
        ) : null}

        {!loading ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.name || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{order.payment_status || "-"}</td>
                      <td>{formatMoney(order.total_price || 0)}</td>
                      <td>
                        <Link to={`/admin/orders/manage?id=${order.id}`} className="action-link">
                          Edit
                        </Link>
                        <Link to={`/admin/orders/details?id=${order.id}`} className="action-link">
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
