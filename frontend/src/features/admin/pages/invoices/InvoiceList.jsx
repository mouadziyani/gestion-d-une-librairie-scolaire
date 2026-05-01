import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function getInvoiceFromOrder(order) {
  return order.invoice || order.payments?.[0]?.invoice || null;
}

function AdminInvoiceList() {
  const location = useLocation();
  const { t } = useUiPreferences();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const detailPath = isModeratorRoute ? "/moderator/invoice-detail" : "/admin/invoices/details";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadInvoices() {
      try {
        setLoading(true);
        const response = await api.get("/orders", { params: { page } });
        const ordersData = response.data?.data;
        if (active) {
          setOrders(Array.isArray(ordersData?.data) ? ordersData.data : []);
          setLastPage(ordersData?.last_page || 1);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || t("pages.failedLoadInvoices"));
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
  }, [page]);

  const invoiceRows = useMemo(
    () =>
      orders.map((order) => {
        const invoice = getInvoiceFromOrder(order);
        return {
          order,
          invoice,
          id: invoice?.id || order.id,
          number: invoice?.invoice_number || `ORDER-${order.id}`,
          client: order.user?.name || "-",
          school: order.school?.name || "-",
          date: invoice?.issued_at || invoice?.created_at || order.created_at || "-",
          status: invoice?.status || order.payment_status || "-",
          amount: invoice?.total_amount || order.total_price || 0,
        };
      }),
    [orders],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return invoiceRows.filter((row) => {
      const matchesSearch =
        !query ||
        [row.number, row.client, row.school, row.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(row.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [invoiceRows, search, status]);

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? t("pages.moderatorArea") : t("pages.adminArea")} / {t("sidebar.invoices")}</span>
          <h2>{t("pages.invoiceArchive")}</h2>
        </div>
        {!isModeratorRoute ? (
          <Link to="/admin/invoices/create" className="btn-add-role">
            + {t("pages.newInvoice")}
          </Link>
        ) : null}
      </header>

      <section className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="invoice-search">{t("common.search")}</label>
          <input
            id="invoice-search"
            type="search"
            placeholder={t("pages.searchInvoicesPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="invoice-status">{t("common.status")}</label>
          <select id="invoice-status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">{t("common.allStatuses")}</option>
            <option value="paid">{t("pages.paid")}</option>
            <option value="unpaid">{t("pages.unpaid")}</option>
            <option value="pending">{t("pages.pending")}</option>
          </select>
        </div>
      </section>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t("pages.invoice")}</th>
                <th>{t("pages.customer")}</th>
                <th>{t("pages.school")}</th>
                <th>{t("pages.date")}</th>
                <th>{t("common.status")}</th>
                <th>{t("cart.total")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredRows.length ? (
                  filteredRows.map((row) => (
                    <tr key={`${row.order.id}-${row.id}`}>
                      <td>{row.number}</td>
                      <td>{row.client}</td>
                      <td>{row.school}</td>
                      <td>{row.date}</td>
                      <td>{row.status}</td>
                      <td>{formatMoney(row.amount)}</td>
                      <td>
                        <Link to={`${detailPath}?id=${row.order.id}`} className="action-link">
                          {t("common.view")}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">{t("pages.noInvoicesMatch")}</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <div className="pagination-row pagination-row-top">
        <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {t("common.previous")}
        </button>
        <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}

export default AdminInvoiceList;
