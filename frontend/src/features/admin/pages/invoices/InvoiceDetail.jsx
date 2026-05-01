import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell == null ? "" : String(cell);
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function parsePaymentNoteItems(order, invoiceTotal) {
  const note = order?.payments?.find((payment) => payment.note)?.note || "";

  if (!note) {
    return [];
  }

  const parsedItems = note
    .split(",")
    .map((part, index) => {
      const match = part.trim().match(/^(.*)\s+x\s+(\d+)$/i);

      if (!match) {
        return null;
      }

      return {
        id: `note-${index}`,
        name: match[1].trim(),
        quantity: Number(match[2] || 0),
        price: 0,
      };
    })
    .filter(Boolean);

  if (parsedItems.length === 1 && parsedItems[0].quantity > 0) {
    parsedItems[0].price = Number(invoiceTotal || 0) / parsedItems[0].quantity;
  }

  return parsedItems;
}

function AdminInvoiceDetail() {
  const { t } = useUiPreferences();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/invoices" : "/admin/invoices";
  const reportPath = isModeratorRoute ? "/moderator/reports" : "/admin/reports/sales";
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoice() {
      try {
        const response = await api.get(id ? `/orders/${id}` : "/dashboard");
        const data = response.data?.data;

        if (response.config?.url === "/dashboard") {
          const recentOrder = Array.isArray(data?.recent_orders) ? data.recent_orders[0] || null : null;
          const recentInvoice = Array.isArray(data?.recent_invoices) ? data.recent_invoices[0] || null : null;
          if (active) {
            setOrder(recentOrder);
            setInvoice(recentInvoice);
          }
        } else {
          const matchedOrder = data || null;
          const matchedInvoice = matchedOrder?.payments?.[0]?.invoice || matchedOrder?.invoice || null;
          if (active) {
            setOrder(matchedOrder);
            setInvoice(matchedInvoice);
          }
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load invoice details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInvoice();

    return () => {
      active = false;
    };
  }, [id]);

  const total = Number(invoice?.total_amount || order?.total_price || 0);
  const items = useMemo(() => {
    const invoiceItems = invoice?.items || invoice?.invoice_items || [];
    const orderItems = order?.orderItems || order?.order_items || [];

    if (invoiceItems.length) {
      return invoiceItems;
    }

    if (orderItems.length) {
      return orderItems;
    }

    return parsePaymentNoteItems(order, total);
  }, [invoice, order, total]);

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const rows = [
      ["Invoice ID", invoice?.id || "-"],
      ["Invoice Number", invoice?.invoice_number || `INV-${invoice?.id || "-"}`],
      ["Customer", order?.user?.name || "-"],
      ["School", order?.school?.name || "-"],
      ["Status", invoice?.status || order?.payment_status || "-"],
      ["Issued At", invoice?.issued_at || invoice?.created_at || "-"],
      [],
      ["Item", "Quantity", "Unit Price", "Line Total"],
      ...items.map((item) => [
        item.name || item.product?.name || item.item_name || "-",
        item.quantity || 0,
        Number(item.price || 0).toFixed(2),
        Number((item.price || 0) * (item.quantity || 0)).toFixed(2),
      ]),
    ];

    downloadCsv(`admin-invoice-${invoice?.id || "detail"}.csv`, rows);
  }

  return (
    <div className="admin-detail-container">
      <main className="invoice-paper">
        <header className="invoice-paper-header">
          <div>
            <h1 className="invoice-paper-title">{t("common.brandName")}</h1>
            <p className="invoice-paper-subtitle">Invoice #{invoice?.invoice_number || invoice?.id || "-"}</p>
          </div>
          <div className="invoice-paper-actions">
            <button type="button" className="btn-base btn-outline btn-sm" onClick={handlePrint}>
              Print Invoice
            </button>
            <button type="button" className="btn-base btn-primary btn-sm" onClick={handleExport}>
              Export CSV
            </button>
          </div>
        </header>

        {error ? <p className="form-alert form-alert-error">{error}</p> : null}

        {!loading ? (
          order ? (
            <>
              <section className="invoice-paper-section">
                <h3 className="invoice-paper-section-title">
                  Billing Details
                </h3>
                <div className="invoice-paper-meta-grid">
                  <div>
                    <p className="invoice-paper-label">CLIENT</p>
                    <p>{order.user?.name || "-"}</p>
                    <p>{order.user?.email || "-"}</p>
                  </div>
                  <div className="invoice-paper-meta-end">
                    <p className="invoice-paper-label">DATE</p>
                    <p>{invoice?.issued_at || invoice?.created_at || order?.created_at || "-"}</p>
                  </div>
                </div>
              </section>

              <section>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length ? (
                      items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name || item.product?.name || item.item_name || "-"}</td>
                          <td>{item.quantity || 0}</td>
                          <td>{formatMoney(item.price || 0)}</td>
                          <td>{formatMoney((item.price || 0) * (item.quantity || 0))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No invoice items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="invoice-paper-total">
                  <p className="invoice-paper-total-label">Total Amount</p>
                  <h2 className="invoice-paper-total-value">{formatMoney(total)}</h2>
                </div>
              </section>
            </>
          ) : (
            <p>No invoice selected.</p>
          )
        ) : (
          <p>Loading invoice...</p>
        )}
      </main>

      <aside className="admin-action-sidebar">
        <div className="sidebar-card">
          <h4>Quick Actions</h4>
          <div className="invoice-sidebar-actions">
            <Link to={listPath} className="btn-archive" style={{ textDecoration: "none", textAlign: "center" }}>
              Back to invoices
            </Link>
            <Link to={reportPath} className="btn-elegant" style={{ textDecoration: "none", textAlign: "center" }}>
              Open sales report
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AdminInvoiceDetail;
