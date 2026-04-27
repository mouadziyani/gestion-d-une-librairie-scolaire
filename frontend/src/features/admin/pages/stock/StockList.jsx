import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteStockEntry, getStockOverview } from "@/shared/services/stockService";

function StockList() {
  const location = useLocation();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const updatePath = isModeratorRoute ? "/moderator/update-stock" : "/admin/stock/update";
  const historyPath = isModeratorRoute ? "/moderator/stock-history" : "/admin/stock/history";
  const areaLabel = isModeratorRoute ? "MODERATOR AREA" : "ADMIN AREA";
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
      setError(err?.response?.data?.message || "Failed to load stock data.");
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

    const confirmed = window.confirm(`Delete last stock movement for "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteStockEntry(item.latest_stock_id);
      await loadStock();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete stock movement.");
    }
  }

  return (
    <div className="stock-list-wrapper">
      <header className="admin-header">
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#888" }}>{areaLabel}</span>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2.5rem" }}>Stock Inventory</h2>
        </div>
        <Link to={updatePath} className="btn-base btn-primary" style={{ textDecoration: "none" }}>
          + New Adjustment
        </Link>
      </header>

      <section className="stock-stats-row">
        <div className="stock-card-mini">
          <span>Total Items</span>
          <strong>{stats.total_items}</strong>
        </div>
        <div className="stock-card-mini">
          <span>Low Stock Alerts</span>
          <strong style={{ color: "#e67e22" }}>{stats.low_stock_alerts}</strong>
        </div>
        <div className="stock-card-mini">
          <span>Out of Stock</span>
          <strong style={{ color: "#ff6b6b" }}>{stats.out_of_stock}</strong>
        </div>
      </section>

      <section className="filter-bar-admin">
        <div className="filter-field" style={{ flex: 3 }}>
          <label htmlFor="search">Search by name or code</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or code..."
            className="admin-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status">Status</label>
          <select className="admin-input" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="button" className="btn-elegant" style={{ padding: "0 30px" }} onClick={loadStock}>
          Apply
        </button>
      </section>

      {error && (
        <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <section className="admin-table-wrapper">
        {!loading ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID / Code</th>
                <th>Stock Item Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.length ? (
                visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: "700" }}>#{item.id}</div>
                      <div style={{ fontSize: "10px", color: "#aaa" }}>{item.code}</div>
                    </td>
                    <td style={{ fontWeight: "600" }}>{item.name}</td>
                    <td>
                      {item.quantity} units
                      {item.low_stock && <span className="low-stock-warning">Low Stock</span>}
                    </td>
                    <td>
                      <span className={`badge ${item.status === "active" ? "badge-active" : "badge-inactive"}`}>
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link to={`${historyPath}?product_id=${item.product_id}`} className="action-link">
                        View
                      </Link>
                      <Link to={`${updatePath}?id=${item.product_id}`} className="action-link">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="action-link delete-link"
                        onClick={() => handleDelete(item)}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        disabled={!item.latest_stock_id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#888" }}>
                    No stock items found.
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
