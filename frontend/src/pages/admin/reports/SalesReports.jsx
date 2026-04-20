import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function SalesReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const response = await api.get("/reports/sales");
        if (active) {
          setReport(response.data?.data ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load sales report.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => report?.stats || {}, [report]);
  const topProducts = report?.top_products || [];
  const recentOrders = report?.recent_orders || [];

  const reportRows = useMemo(
    () => [
      { label: "Total revenue", value: formatMoney(stats.total_revenue || 0) },
      { label: "Total orders", value: stats.total_orders || 0 },
      { label: "Completed orders", value: stats.completed_orders || 0 },
      { label: "Pending orders", value: stats.pending_orders || 0 },
    ],
    [stats],
  );

  async function handleExport(format = "csv") {
    try {
      setDownloading(true);
      const response = await api.get("/reports/sales/export", {
        params: { format },
        responseType: "blob",
      });

      const extension = format === "excel" ? "xls" : "csv";
      const type = format === "excel" ? "application/vnd.ms-excel" : "text/csv;charset=utf-8;";
      const blob = new Blob([response.data], { type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sales-report.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to export sales report.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleExportPdf() {
    try {
      setDownloading(true);
      const response = await api.get("/reports/sales/pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to export sales report PDF.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="admin-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / REPORTS</span>
          <h1 className="page-shell-title">Sales Reports</h1>
          <p className="page-shell-subtitle">Track sales, top products, and export a CSV snapshot anytime.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="button" className="btn-add-role" onClick={() => handleExport("csv")} disabled={downloading}>
            {downloading ? "Exporting..." : "Export CSV"}
          </button>
          <button type="button" className="btn-elegant" onClick={() => handleExport("excel")} disabled={downloading}>
            Export Excel
          </button>
          <button type="button" className="btn-add-role" onClick={handleExportPdf} disabled={downloading}>
            Export PDF
          </button>
        </div>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      {!loading ? (
        <>
          <div className="admin-stats-row">
            {reportRows.map((item) => (
              <div key={item.label} className="summary-box light">
                <div>
                  <span className="eyebrow-label">{item.label}</span>
                  <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-detail-container" style={{ padding: 0, maxWidth: "none" }}>
            <section className="invoice-paper">
              <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Recent sales</h2>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length ? (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.user?.name || "-"}</td>
                          <td>{order.status || "-"}</td>
                          <td>{order.payment_status || "-"}</td>
                          <td>{formatMoney(order.total_price || 0)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No sales data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="admin-action-sidebar">
              <div className="sidebar-card">
                <h4>Top products</h4>
                <ul className="activity-feed">
                  {topProducts.length ? (
                    topProducts.map((item) => (
                      <li key={item.product_id} className="activity-item">
                        <strong>{item.product?.name || "Unknown product"}</strong>
                        <span>
                          {Number(item.quantity_sold || 0)} sold
                          {item.revenue ? ` - ${formatMoney(item.revenue)}` : ""}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="activity-item">No top products yet.</li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SalesReports;
