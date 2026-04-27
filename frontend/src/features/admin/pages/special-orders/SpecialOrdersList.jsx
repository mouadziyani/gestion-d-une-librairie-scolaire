import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/shared/services/api";

function SpecialOrdersList() {
  const location = useLocation();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const detailsPath = isModeratorRoute ? "/moderator/special-order-details" : "/admin/special-orders/details";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadItems() {
      try {
        const response = await api.get("/special-orders");
        if (active) {
          setItems(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load special orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [item.item_name, item.status, item.school?.name, item.category?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(item.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? "MODERATOR" : "ADMIN"} / SPECIAL ORDERS</span>
          <h2>Special Orders</h2>
        </div>
        <Link to="/special-order" className="btn-add-role">
          Public request form
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="special-search">Search</label>
          <input id="special-search" type="search" placeholder="Search by item or school..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="special-status">Status</label>
          <select id="special-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>School</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredItems.length ? (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.item_name || "-"}</td>
                      <td>{item.school?.name || "-"}</td>
                      <td>{item.status || "-"}</td>
                      <td>
                        <Link to={`${detailsPath}?id=${item.id}`} className="action-link">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No special orders match your filters.</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default SpecialOrdersList;
