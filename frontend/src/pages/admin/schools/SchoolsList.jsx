import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../../services/api";

function SchoolsList() {
  const location = useLocation();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const detailsPath = isModeratorRoute ? "/moderator/school-details" : "/admin/schools/details";
  const editPath = isModeratorRoute ? null : "/admin/schools/edit";
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadSchools() {
      try {
        setLoading(true);
        const response = await api.get("/schools", { params: { page } });
        if (active) {
          const schoolsData = response.data?.data;
          setSchools(Array.isArray(schoolsData?.data) ? schoolsData.data : []);
          setLastPage(schoolsData?.last_page || 1);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load schools.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSchools();

    return () => {
      active = false;
    };
  }, [page]);

  const filteredSchools = useMemo(() => {
    const query = search.trim().toLowerCase();
    return schools.filter((school) => {
      const matchesSearch =
        !query ||
        [school.name, school.code, school.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || String(school.status).toLowerCase() === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [schools, search, status]);

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? "MODERATOR" : "ADMIN"} / SCHOOLS</span>
          <h2>Schools List</h2>
        </div>
        {!isModeratorRoute ? (
          <Link to="/admin/schools/create" className="btn-add-role">
            + Add School
          </Link>
        ) : null}
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="school-search">Search</label>
          <input id="school-search" type="search" placeholder="Search by school name or code..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="school-status">Status</label>
          <select id="school-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredSchools.length ? (
                  filteredSchools.map((school) => (
                    <tr key={school.id}>
                      <td>#{school.id}</td>
                      <td>{school.name}</td>
                      <td>{school.code || "-"}</td>
                      <td>{school.status || "-"}</td>
                      <td>
                        <Link to={`${detailsPath}?id=${school.id}`} className="action-link">
                          View
                        </Link>
                        {editPath ? (
                          <Link to={`${editPath}?id=${school.id}`} className="action-link">
                            Edit
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No schools match your filters.</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default SchoolsList;
