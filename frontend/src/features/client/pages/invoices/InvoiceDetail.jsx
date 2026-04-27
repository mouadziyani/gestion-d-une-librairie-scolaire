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

function InvoiceDetail() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoice() {
      try {
        const [dashboardResponse, ordersResponse] = await Promise.all([api.get("/dashboard"), api.get("/orders/mine")]);
        const dashboardData = dashboardResponse.data?.data || {};
        const invoices = Array.isArray(dashboardData.recent_invoices) ? dashboardData.recent_invoices : [];
        const orders = Array.isArray(ordersResponse.data?.data) ? ordersResponse.data.data : [];
        const matchedInvoice = invoices.find((item) => String(item.id) === String(invoiceId)) || invoices[0] || null;

        if (!matchedInvoice) {
          if (active) {
            setError("Invoice not found.");
            setLoading(false);
          }
          return;
        }

        const matchedOrder =
          orders.find((item) => String(item.id) === String(matchedInvoice.order_id)) ||
          orders.find((item) => String(item.id) === String(invoiceId)) ||
          null;

        if (active) {
          setInvoice(matchedInvoice);
          setOrder(matchedOrder);
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
  }, [invoiceId]);

  const items = useMemo(() => order?.orderItems || order?.order_items || [], [order]);
  const subtotal = Number(invoice?.total_amount || order?.total_price || 0);

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
      ["Item", "Quantity", "Price", "Line Total"],
      ...items.map((item) => [
        item.product?.name || item.item_name || "-",
        item.quantity || 0,
        Number(item.price || 0).toFixed(2),
        Number((item.price || 0) * (item.quantity || 0)).toFixed(2),
      ]),
    ];

    downloadCsv(`invoice-${invoice?.id || "detail"}.csv`, rows);
  }

  return (
    <div className="invoice-wrapper">
      <div className="invoice-header">
        <div className="brand-info">
          <h1>Library BOUGDIM</h1>
          <p>Client Area / Invoicing</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="button" className="btn-base btn-outline btn-sm" onClick={handlePrint}>
            Print Invoice
          </button>
          <button type="button" className="btn-base btn-primary btn-sm" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      {!loading ? (
        invoice ? (
          <>
            <section className="invoice-meta-grid">
              <div className="meta-item">
                <dt>Invoice ID</dt>
                <dd>#{invoice.id}</dd>
              </div>
              <div className="meta-item">
                <dt>Invoice Number</dt>
                <dd>{invoice.invoice_number || `INV-${invoice.id}`}</dd>
              </div>
              <div className="meta-item">
                <dt>Status</dt>
                <dd>
                  <span className="badge-active">{invoice.status || order?.payment_status || "unpaid"}</span>
                </dd>
              </div>
              <div className="meta-item">
                <dt>Client Name</dt>
                <dd>{order?.user?.name || "-"}</dd>
              </div>
              <div className="meta-item">
                <dt>School</dt>
                <dd>{order?.school?.name || "-"}</dd>
              </div>
              <div className="meta-item">
                <dt>Issued Date</dt>
                <dd>{invoice.issued_at || invoice.created_at || "-"}</dd>
              </div>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h3 style={{ marginBottom: "20px", fontFamily: "Fraunces" }}>Invoice Lines</h3>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length ? (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product?.name || item.item_name || "-"}</td>
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
            </section>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", maxWidth: "300px", borderTop: "2px solid #1a1a1a", paddingTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span>
                  <strong>{formatMoney(subtotal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <span style={{ color: "#888" }}>Payment</span>
                  <strong>{order?.payment_status || "-"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "Fraunces" }}>{formatMoney(subtotal)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No invoice selected.</p>
        )
      ) : (
        <p>Loading invoice...</p>
      )}
    </div>
  );
}

export default InvoiceDetail;
