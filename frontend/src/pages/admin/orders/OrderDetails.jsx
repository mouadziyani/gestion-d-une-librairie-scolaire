import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";

function OrderDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const response = await api.get(`/orders/${id}`);
        if (active) {
          setOrder(response.data?.data ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load the order.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!id) {
      setError("Missing order id.");
      setLoading(false);
      return () => {};
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / ORDERS</span>
          <h1 className="page-shell-title">Order Details</h1>
          <p className="page-shell-subtitle">Inspect one order, its items, and payment flow.</p>
        </div>
        <Link to="/admin/orders" className="btn-archive">
          Back to list
        </Link>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-card">
        {!loading ? (
          order ? (
          <>
            <div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", marginBottom: "8px" }}>
                Order #{order.id}
              </h2>
              <p>{order.user?.name || "Unknown customer"} - {order.school?.name || "No school"}</p>
            </div>

              <div className="admin-stats-strip">
                <div className="stat-item">
                  <span>Status</span>
                  <strong>{order.status || "-"}</strong>
                </div>
                <div className="stat-item">
                  <span>Payment</span>
                  <strong>{order.payment_status || "-"}</strong>
                </div>
                <div className="stat-item">
                  <span>Method</span>
                  <strong>{order.payment_method || "-"}</strong>
                </div>
                <div className="stat-item">
                  <span>Total</span>
                  <strong>{Number(order.total_price || 0).toFixed(2)} MAD</strong>
                </div>
                <div className="stat-item">
                <span>Created</span>
                <strong>{order.created_at || "-"}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.order_items || order.orderItems || []).length ? (
                    (order.order_items || order.orderItems || []).map((item) => (
                      <tr key={item.id}>
                        <td>{item.product?.name || item.item_name || "-"}</td>
                        <td>{item.quantity || 1}</td>
                        <td>{Number(item.price || item.total || 0).toFixed(2)} MAD</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No items found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null) : null}
      </section>
    </div>
  );
}

export default OrderDetails;
