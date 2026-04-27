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

function OrderDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const endpoint = id ? `/orders/mine/${id}` : "/orders/mine";
        const response = await api.get(endpoint);
        const data = response.data?.data;
        const nextOrder = Array.isArray(data) ? data[0] || null : data;
        if (active) {
          setOrder(nextOrder);
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

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  const items = useMemo(() => order?.order_items || order?.orderItems || [], [order]);

  return (
    <div className="dashboard-container">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">CLIENT / ORDERS</span>
          <h1 className="page-shell-title">Order Details</h1>
          <p className="page-shell-subtitle">Follow the products, payment, and delivery state of your order.</p>
        </div>
        <Link to="/orders" className="btn-archive">
          Back to orders
        </Link>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-card">
        {!loading ? (
          order ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", marginBottom: "8px" }}>
                    Order #{order.id}
                  </h2>
                  <p>{order.school?.name || "No school selected"}</p>
                </div>
                <div className="status-pill status-pending" style={{ height: "fit-content" }}>
                  {order.status || "pending"}
                </div>
              </div>

              <div className="admin-stats-strip">
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
                  <strong>{formatMoney(order.total_price || 0)}</strong>
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
                      <th>Unit</th>
                      <th>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length ? (
                      items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product?.name || item.item_name || "-"}</td>
                          <td>{item.quantity || 1}</td>
                          <td>{formatMoney(item.price || 0)}</td>
                          <td>{formatMoney((item.price || 0) * (item.quantity || 1))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No order selected.</p>
          )
        ) : (
          <p>Loading order details...</p>
        )}
      </section>
    </div>
  );
}

export default OrderDetail;
