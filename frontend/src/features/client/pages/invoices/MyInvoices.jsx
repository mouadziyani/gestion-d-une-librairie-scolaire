import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

function MyInvoices() {
  const { t } = useUiPreferences();
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
          setError(err?.response?.data?.message || t("clientInvoices.failedLoadInvoices"));
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
  }, [t]);

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
      [t("clientOrders.id"), t("clientInvoices.invoiceNumber"), t("clientOrders.school"), t("clientOrders.status"), t("clientOrders.total"), t("pages.date")],
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
          <p style={{ color: "#888", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{t("clientInvoices.clientArea")}</p>
          <h2>{t("clientInvoices.title")}</h2>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="button" className="btn-export" onClick={handleExport}>
            {t("clientInvoices.exportCsv")}
          </button>
          <button type="button" className="btn-base btn-primary" onClick={handlePrint}>
            {t("clientInvoices.print")}
          </button>
        </div>
      </header>

      <section className="filters-bar">
        <div className="filter-item">
          <label htmlFor="invoice-search">{t("clientInvoices.search")}</label>
          <input
            id="invoice-search"
            type="text"
            placeholder={t("clientInvoices.searchPlaceholder")}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="invoice-status">{t("clientOrders.status")}</label>
          <select id="invoice-status" className="search-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("clientInvoices.allStatus")}</option>
            <option value="unpaid">{t("pages.unpaid")}</option>
            <option value="paid">{t("pages.paid")}</option>
            <option value="pending">{t("pages.pending")}</option>
          </select>
        </div>

        <div style={{ paddingBottom: "2px" }}>
          <Link to="/orders" className="btn-base btn-outline" style={{ textDecoration: "none" }}>
            {t("clientInvoices.goToOrders")}
          </Link>
        </div>
      </section>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="table-wrapper">
        {!loading ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t("clientOrders.id")}</th>
                <th>{t("clientInvoices.invoiceNumber")}</th>
                <th>{t("clientOrders.school")}</th>
                <th>{t("clientOrders.status")}</th>
                <th>{t("clientOrders.total")}</th>
                <th>{t("clientOrders.actions")}</th>
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
                      <Link to={`/invoice-detail?id=${invoice.id}`} className="action-link">
                        {t("clientOrders.view")}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">{t("clientInvoices.noInvoicesMatch")}</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: "20px", color: "#888" }}>{t("clientInvoices.loadingInvoices")}</p>
        )}
      </section>
    </div>
  );
}

export default MyInvoices;
