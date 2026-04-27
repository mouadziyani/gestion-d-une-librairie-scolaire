import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { deleteStockEntry, getStockHistory } from "@/shared/services/stockService";

function StockHistory() {
  const location = useLocation();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const updatePath = isModeratorRoute ? "/moderator/update-stock" : "/admin/stock/update";
  const areaLabel = isModeratorRoute ? "MODERATOR / LOGS" : "ADMIN / LOGS";
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product_id") || "";
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [date, setDate] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        setLoading(true);
        const data = await getStockHistory({ product_id: productId });
        if (!active) {
          return;
        }

        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load stock history.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, [productId]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch = [log.item, log.action, log.user, log.note]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
      const matchesAction = action === "all" || log.action === action;
      const matchesDate = !date || log.date === date;

      return matchesSearch && matchesAction && matchesDate;
    });
  }, [logs, search, action, date]);

  const shownLogs = filteredLogs.slice(0, visibleCount);

  async function handleDelete(logId) {
    const confirmed = window.confirm("Delete this stock movement?");

    if (!confirmed) {
      return;
    }

    setDeletingId(logId);

    try {
      await deleteStockEntry(logId);
      const data = await getStockHistory({ product_id: productId });
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete stock movement.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="history-wrapper">
      <header style={{ marginBottom: "40px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#888", fontWeight: "bold" }}>
          {areaLabel}
        </span>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "2.5rem", marginTop: "10px" }}>
          Stock Activity History
        </h1>
        <p style={{ color: "#666" }}>Track every change made to your library inventory.</p>
      </header>

      <section className="history-filters">
        <input
          type="text"
          className="admin-input"
          style={{ flex: 2 }}
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="admin-input" style={{ flex: 1 }} value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="restock">Restock</option>
          <option value="sale">Sales</option>
          <option value="damage">Damaged Goods</option>
          <option value="return">Returns</option>
          <option value="adjustment">Adjustments</option>
        </select>
        <input
          type="date"
          className="admin-input"
          style={{ flex: 1 }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="button"
          className="btn-base btn-primary"
          style={{ padding: "0 30px" }}
          onClick={() => setVisibleCount(10)}
        >
          Filter Logs
        </button>
      </section>

      {error && (
        <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {!loading ? (
        <section className="log-timeline">
          {shownLogs.length ? (
            shownLogs.map((log) => (
              <div className="log-item" key={log.id}>
                <div className="log-date">{log.date}</div>

                <div className="log-details">
                  <strong>{log.item}</strong>
                  <span>{log.action}</span>
                </div>

                <div className={`log-change ${String(log.change).startsWith("+") ? "change-positive" : "change-negative"}`}>
                  {log.change} Units
                </div>

                <div className="log-admin">
                  <div>by {log.user}</div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                    <Link className="action-link" to={`${updatePath}?movement_id=${log.id}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="action-link delete-link"
                      onClick={() => handleDelete(log.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", marginRight: 0 }}
                      disabled={deletingId === log.id}
                    >
                      {deletingId === log.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="log-item" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
              No stock logs found.
            </div>
          )}
        </section>
      ) : null}

      {filteredLogs.length > visibleCount && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button className="btn-outline" style={{ fontSize: "12px" }} onClick={() => setVisibleCount((count) => count + 10)}>
            Load More History
          </button>
        </div>
      )}
    </div>
  );
}

export default StockHistory;
