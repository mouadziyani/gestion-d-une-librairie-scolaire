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

function AdminInvoiceBySchool() {
  const [orders, setOrders] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [ordersResponse, schoolsResponse] = await Promise.all([api.get("/orders"), api.get("/schools")]);

        if (active) {
          setOrders(Array.isArray(ordersResponse.data?.data) ? ordersResponse.data.data : []);
          setSchools(Array.isArray(schoolsResponse.data?.data) ? schoolsResponse.data.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load invoices by school.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return schools
      .map((school) => {
        const schoolOrders = orders.filter((order) => String(order.school_id) === String(school.id));
        const totalOrders = schoolOrders.length;
        const paidOrders = schoolOrders.filter((order) => order.payment_status === "paid").length;
        const totalRevenue = schoolOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

        return {
          ...school,
          totalOrders,
          paidOrders,
          totalRevenue,
          schoolOrders,
        };
      })
      .filter((school) => {
        const matchesSearch =
          !query || [school.name, school.code, school.city].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
        const matchesStatus =
          status === "all" ||
          (status === "active" ? String(school.status).toLowerCase() === "active" : String(school.status).toLowerCase() === status);
        return matchesSearch && matchesStatus;
      });
  }, [orders, schools, search, status]);

  return (
    <div className="admin-list-container">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / INVOICES</span>
          <h1 className="page-shell-title">Invoices by School</h1>
          <p className="page-shell-subtitle">See how invoices and orders are distributed across partner schools.</p>
        </div>
        <Link to="/AdminInvoiceList" className="btn-add-role">
          Back to invoices
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="school-invoice-search">Search</label>
          <input
            id="school-invoice-search"
            type="search"
            placeholder="Search by school, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="school-invoice-status">Status</label>
          <select id="school-invoice-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <div className="admin-stats-row">
        <div className="summary-box light">
          <div>
            <span className="eyebrow-label">Total schools</span>
            <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
              {schools.length}
            </h3>
          </div>
        </div>
        <div className="summary-box light">
          <div>
            <span className="eyebrow-label">Total linked orders</span>
            <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
              {orders.filter((order) => order.school_id).length}
            </h3>
          </div>
        </div>
        <div className="summary-box light">
          <div>
            <span className="eyebrow-label">Estimated revenue</span>
            <h3 className="page-shell-title" style={{ fontSize: "1.9rem", margin: "8px 0 0" }}>
              {formatMoney(orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0))}
            </h3>
          </div>
        </div>
      </div>

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Code</th>
                <th>Orders</th>
                <th>Paid</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                rows.length ? (
                  rows.map((school) => (
                    <tr key={school.id}>
                      <td>{school.name}</td>
                      <td>{school.code || "-"}</td>
                      <td>{school.totalOrders}</td>
                      <td>{school.paidOrders}</td>
                      <td>{formatMoney(school.totalRevenue)}</td>
                      <td>
                        <Link to={`/admin/schools/details?id=${school.id}`} className="action-link">
                          View school
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No school invoices match your filters.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="6">Loading school invoices...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminInvoiceBySchool;
