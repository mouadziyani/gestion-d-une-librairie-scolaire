import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";

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

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoices() {
      try {
        const [dashboardResponse, ordersResponse] = await Promise.all([api.get("/dashboard"), api.get("/orders/mine")]);
        if (!active) {
          return;
        }

        setInvoices(Array.isArray(dashboardResponse.data?.data?.recent_invoices) ? dashboardResponse.data.data.recent_invoices : []);
        setOrders(Array.isArray(ordersResponse.data?.data) ? ordersResponse.data.data : []);
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load invoices.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInvoices();

    return () => {
      active = false;
    };
  }, []);

  const invoiceRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return invoices
      .map((invoice) => {
        const relatedOrder = orders.find((order) => String(order.id) === String(invoice.order_id));

        return {
          ...invoice,
          relatedOrder,
        };
      })
      .filter((invoice) => {
        const matchesSearch =
          !query ||
          [invoice.invoice_number, invoice.status, invoice.id, invoice.relatedOrder?.school?.name, invoice.relatedOrder?.payment_status]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query));
        const matchesStatus = status === "all" || String(invoice.status).toLowerCase() === status.toLowerCase();
        return matchesSearch && matchesStatus;
      });
  }, [invoices, orders, searchTerm, status]);

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const rows = [
      ["ID", "Invoice Number", "School", "Status", "Total", "Issued At"],
      ...invoiceRows.map((invoice) => [
        invoice.id,
        invoice.invoice_number || `INV-${invoice.id}`,
        invoice.relatedOrder?.school?.name || "-",
        invoice.status || "-",
        Number(invoice.total_amount || invoice.relatedOrder?.total_price || 0).toFixed(2),
        invoice.issued_at || invoice.created_at || "-",
      ]),
    ];

    downloadCsv("my-invoices.csv", rows);
  }

  return (
    <div className="invoices-container">
      <header className="page-header">
        <div>
          <p style={{ color: "#888", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Client Area</p>
          <h2>My Invoices</h2>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="button" className="btn-export" onClick={handleExport}>
            Export CSV
          </button>
          <button type="button" className="btn-base btn-primary" onClick={handlePrint}>
            Print
          </button>
        </div>
      </header>

      <section className="filters-bar">
        <div className="filter-item">
          <label htmlFor="invoice-search">Search Invoices</label>
          <input
            id="invoice-search"
            type="text"
            placeholder="Search by invoice, school, or status..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="invoice-status">Status</label>
          <select id="invoice-status" className="search-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div style={{ paddingBottom: "2px" }}>
          <Link to="/Orders" className="btn-base btn-outline" style={{ textDecoration: "none" }}>
            Go to Orders
          </Link>
        </div>
      </section>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="table-wrapper">
        {!loading ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice Number</th>
                <th>School</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceRows.length ? (
                invoiceRows.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>#{invoice.id}</td>
                    <td>{invoice.invoice_number || `INV-${invoice.id}`}</td>
                    <td>{invoice.relatedOrder?.school?.name || "-"}</td>
                    <td>{invoice.status || "-"}</td>
                    <td>{formatMoney(invoice.total_amount || invoice.relatedOrder?.total_price || 0)}</td>
                    <td>
                      <Link to={`/InvoiceDetail?id=${invoice.id}`} className="action-link">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No invoices match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: "20px", color: "#888" }}>Loading invoices...</p>
        )}
      </section>
    </div>
  );
}

export default MyInvoices;
