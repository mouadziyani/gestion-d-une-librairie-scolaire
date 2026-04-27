import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { api } from "@/shared/services/api";

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
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "Fraunces", fontSize: "2rem", margin: 0 }}>Library BOUGDIM</h1>
            <p style={{ color: "#888" }}>Invoice #{invoice?.invoice_number || invoice?.id || "-"}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
              <section style={{ marginBottom: "40px" }}>
                <h3 style={{ fontFamily: "Fraunces", fontSize: "1.2rem", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                  Billing Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}>CLIENT</p>
                    <p>{order.user?.name || "-"}</p>
                    <p>{order.user?.email || "-"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}>DATE</p>
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

                <div style={{ marginTop: "30px", textAlign: "right", borderTop: "2px solid #1a1a1a", paddingTop: "20px" }}>
                  <p style={{ fontSize: "14px", color: "#888" }}>Total Amount</p>
                  <h2 style={{ fontFamily: "Fraunces", fontSize: "2rem" }}>{formatMoney(total)}</h2>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
