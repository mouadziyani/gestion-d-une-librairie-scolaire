import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function OrderDetail() {
  const { t } = useUiPreferences();
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
          setError(err?.response?.data?.message || t("clientOrders.failedLoadOrder"));
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
  }, [id, t]);

  const items = useMemo(() => order?.order_items || order?.orderItems || [], [order]);

  return (
    <div className="dashboard-container">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">{t("clientOrders.eyebrow")}</span>
          <h1 className="page-shell-title">{t("clientOrders.detailsTitle")}</h1>
          <p className="page-shell-subtitle">{t("clientOrders.detailsSubtitle")}</p>
        </div>
        <Link to="/orders" className="btn-archive">
          {t("clientOrders.backToOrders")}
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
                  <p>{order.school?.name || t("clientOrders.noSchoolSelected")}</p>
                </div>
                <div className="status-pill status-pending" style={{ height: "fit-content" }}>
                  {order.status ? t(`pages.${String(order.status).toLowerCase()}`) : t("pages.pending")}
                </div>
              </div>

              <div className="admin-stats-strip">
                <div className="stat-item">
                  <span>{t("clientOrders.payment")}</span>
                  <strong>{order.payment_status || "-"}</strong>
                </div>
                <div className="stat-item">
                  <span>{t("clientOrders.method")}</span>
                  <strong>{order.payment_method || "-"}</strong>
                </div>
                <div className="stat-item">
                  <span>{t("clientOrders.total")}</span>
                  <strong>{formatMoney(order.total_price || 0)}</strong>
                </div>
                <div className="stat-item">
                  <span>{t("clientOrders.created")}</span>
                  <strong>{order.created_at || "-"}</strong>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>{t("clientOrders.item")}</th>
                      <th>{t("clientOrders.qty")}</th>
                      <th>{t("clientOrders.unit")}</th>
                      <th>{t("clientOrders.lineTotal")}</th>
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
                        <td colSpan="4">{t("clientOrders.noItemsFound")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>{t("clientOrders.noOrderSelected")}</p>
          )
        ) : (
          <p>{t("clientOrders.loadingOrderDetails")}</p>
        )}
      </section>
    </div>
  );
}

export default OrderDetail;
