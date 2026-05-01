import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteStockEntry, getStockOverview } from "@/shared/services/stockService";
import { useUiPreferences } from "@/shared/context/UIContext";

function StockList() {
  const location = useLocation();
  const { t } = useUiPreferences();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const updatePath = isModeratorRoute ? "/moderator/update-stock" : "/admin/stock/update";
  const historyPath = isModeratorRoute ? "/moderator/stock-history" : "/admin/stock/history";
  const areaLabel = isModeratorRoute ? t("pages.moderatorArea") : t("pages.adminArea");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total_items: 0, low_stock_alerts: 0, out_of_stock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  async function loadStock() {
    try {
      setLoading(true);
      const data = await getStockOverview({ search, status });
      setItems(Array.isArray(data.items) ? data.items : []);
      setStats(data.stats || { total_items: 0, low_stock_alerts: 0, out_of_stock: 0 });
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || t("pages.failedLoadStock"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch = [item.name, item.code, item.category]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
      const matchesStatus = status === "all" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  async function handleDelete(item) {
    if (!item.latest_stock_id) {
      return;
    }

    const confirmed = window.confirm(t("pages.deleteStockConfirm", { name: item.name }));

    if (!confirmed) {
      return;
    }

    try {
      await deleteStockEntry(item.latest_stock_id);
      await loadStock();
    } catch (err) {
      setError(err?.response?.data?.message || t("pages.failedDeleteStock"));
    }
  }

  return (
    <div className="stock-list-wrapper">
      <header className="admin-header">
        <div>
          <span className="eyebrow-label">{areaLabel}</span>
          <h2>{t("pages.stockInventory")}</h2>
        </div>
        <Link to={updatePath} className="btn-base btn-primary" style={{ textDecoration: "none" }}>
          + {t("pages.newAdjustment")}
        </Link>
      </header>

      <section className="stock-stats-row">
        <div className="stock-card-mini">
          <span>{t("pages.totalItems")}</span>
          <strong>{stats.total_items}</strong>
        </div>
        <div className="stock-card-mini">
          <span>{t("pages.lowStockAlerts")}</span>
          <strong className="warning-text">{stats.low_stock_alerts}</strong>
        </div>
        <div className="stock-card-mini">
          <span>{t("pages.outOfStock")}</span>
          <strong className="danger-text">{stats.out_of_stock}</strong>
        </div>
      </section>

      <section className="filter-bar-admin">
        <div className="filter-field" style={{ flex: 3 }}>
          <label htmlFor="search">{t("pages.searchByNameOrCode")}</label>
          <input
            type="text"
            id="search"
            placeholder={t("pages.searchByNameOrCodePlaceholder")}
            className="admin-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status">{t("common.status")}</label>
          <select className="admin-input" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("pages.allStatus")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="inactive">{t("common.inactive")}</option>
          </select>
        </div>

        <button type="button" className="btn-elegant" style={{ padding: "0 30px" }} onClick={loadStock}>
          {t("common.apply")}
        </button>
      </section>

      {error && <div className="form-alert form-alert-error">{error}</div>}

      <section className="admin-table-wrapper">
        {!loading ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("pages.idCode")}</th>
                <th>{t("pages.stockItemName")}</th>
                <th>{t("pages.quantity")}</th>
                <th>{t("common.status")}</th>
                <th className="table-align-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.length ? (
                visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-strong-cell">#{item.id}</div>
                      <div className="table-meta-cell table-meta-cell-small">{item.code}</div>
                    </td>
                    <td className="table-strong-cell">{item.name}</td>
                    <td>
                      {item.quantity} {t("pages.units")}
                      {item.low_stock && <span className="low-stock-warning">{t("pages.lowStockLabel")}</span>}
                    </td>
                    <td>
                      <span className={`badge ${item.status === "active" ? "badge-active" : "badge-inactive"}`}>
                        {item.status === "active" ? t("common.active") : t("common.inactive")}
                      </span>
                    </td>
                    <td className="table-align-end">
                      <Link to={`${historyPath}?product_id=${item.product_id}`} className="action-link">
                        {t("common.view")}
                      </Link>
                      <Link to={`${updatePath}?id=${item.product_id}`} className="action-link">
                        {t("common.edit")}
                      </Link>
                      <button
                        type="button"
                        className="action-link delete-link"
                        onClick={() => handleDelete(item)}
                        disabled={!item.latest_stock_id}
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="table-empty-cell table-empty-cell-compact">
                    {t("pages.noStockItems")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : null}
      </section>
    </div>
  );
}

export default StockList;
