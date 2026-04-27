import { useEffect, useMemo, useState } from "react";
import { getPeriodicStockReport, getStockHistory, getStockOverview } from "@/shared/services/stockService";

function StockReports() {
  const [overview, setOverview] = useState({ items: [], stats: {} });
  const [history, setHistory] = useState([]);
  const [periodic, setPeriodic] = useState({ periods: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const [overviewData, historyData, periodicData] = await Promise.all([
          getStockOverview(),
          getStockHistory(),
          getPeriodicStockReport(),
        ]);
        if (active) {
          setOverview(overviewData || { items: [], stats: {} });
          setHistory(Array.isArray(historyData) ? historyData : []);
          setPeriodic(periodicData || { periods: [], summary: {} });
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load stock report.");
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

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (overview.items || []).filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.code, item.category, item.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(item.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [overview.items, search, status]);

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const rows = [
      ["ID", "Name", "Code", "Quantity", "Status"],
      ...filteredItems.map((item) => [
        item.id,
        item.name,
        item.code || "-",
        item.quantity ?? item.stock ?? 0,
        item.status || "-",
      ]),
      [],
      ["History ID", "Date", "Item", "Action", "Change", "User"],
      ...history.map((log) => [
        log.id,
        log.date || "-",
        log.item || "-",
        log.action || "-",
        log.change || "-",
        log.user || "-",
      ]),
    ];

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
    link.setAttribute("download", "stock-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  const stats = overview.stats || {};
  const periodicSummary = periodic.summary || {};

  return (
    <div>
      <div className="admin-list-wrapper">
        <header className="page-shell-header">
          <div>
            <span className="eyebrow-label">ADMIN / REPORTS</span>
            <h1 className="page-shell-title">Stock Reports</h1>
            <p className="page-shell-subtitle">Monitor stock levels, movements, and low stock alerts.</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" className="btn-add-role" onClick={handleExport}>
              Export CSV
            </button>
            <button type="button" className="btn-elegant" onClick={handlePrint}>
              Print
            </button>
          </div>
        </header>

        <div className="admin-stats-row">
          <div className="summary-box light">
            <div>
              <span className="eyebrow-label">Total items</span>
              <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                {stats.total_items || filteredItems.length || 0}
              </h3>
            </div>
          </div>
          <div className="summary-box light">
            <div>
              <span className="eyebrow-label">Low stock alerts</span>
              <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                {stats.low_stock_alerts || 0}
              </h3>
            </div>
          </div>
          <div className="summary-box light">
            <div>
              <span className="eyebrow-label">Out of stock</span>
              <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                {stats.out_of_stock || 0}
              </h3>
            </div>
          </div>
          <div className="summary-box light">
            <div>
              <span className="eyebrow-label">Movements period</span>
              <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
                {periodicSummary.total_movements || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="filter-bar-admin">
          <div className="filter-field" style={{ flex: 2 }}>
            <label htmlFor="stock-report-search">Search</label>
            <input
              id="stock-report-search"
              type="search"
              placeholder="Search stock by name, code, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="stock-report-status">Status</label>
            <select id="stock-report-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error ? <p className="form-alert form-alert-error">{error}</p> : null}

        {!loading ? (
          <>
            <section className="admin-table-card">
              <div className="table-scroll">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length ? (
                      filteredItems.map((item) => (
                        <tr key={item.id}>
                          <td>#{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.code || "-"}</td>
                          <td>{item.quantity ?? item.stock ?? 0}</td>
                          <td>{item.status || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No stock items match your filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          <section className="invoice-paper" style={{ marginTop: "30px" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Recent movements</h2>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item</th>
                      <th>Action</th>
                      <th>Change</th>
                      <th>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length ? (
                      history.slice(0, 10).map((log) => (
                        <tr key={log.id}>
                          <td>{log.date || "-"}</td>
                          <td>{log.item || "-"}</td>
                          <td>{log.action || "-"}</td>
                          <td>{log.change || "-"}</td>
                          <td>{log.user || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No recent stock movements found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
          </section>

          <section className="invoice-paper" style={{ marginTop: "30px" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "18px" }}>Periodic inventory</h2>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Movements</th>
                    <th>Restock</th>
                    <th>Sales</th>
                    <th>Damage</th>
                    <th>Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(periodic.periods) && periodic.periods.length ? (
                    periodic.periods.map((period) => (
                      <tr key={period.period}>
                        <td>{period.period}</td>
                        <td>{period.movements}</td>
                        <td>{period.restock}</td>
                        <td>{period.sale}</td>
                        <td>{period.damage}</td>
                        <td>{period.return}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No periodic inventory data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
        ) : (
          <p style={{ padding: "20px", color: "#888" }}>Loading stock report...</p>
        )}
      </div>
    </div>
  );
}

export default StockReports;
