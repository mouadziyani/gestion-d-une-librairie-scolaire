import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";

function SchoolDetails() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get("id");
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/schools" : "/admin/schools";
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSchool() {
      try {
        const response = await api.get(`/schools/${schoolId}`);
        if (active) {
          setSchool(response.data?.data ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load school.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!schoolId) {
      setError("Missing school id.");
      setLoading(false);
      return () => {};
    }

    loadSchool();

    return () => {
      active = false;
    };
  }, [schoolId]);

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? "MODERATOR" : "ADMIN"} / SCHOOLS</span>
          <h1 className="page-shell-title">School Details</h1>
          <p className="page-shell-subtitle">Inspect the school record and linked data.</p>
        </div>
        <Link to={listPath} className="btn-archive">
          Back to list
        </Link>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-card">
        {!loading ? (
          school ? (
          <>
            <div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", marginBottom: "8px" }}>
                {school.name}
              </h2>
              <p>{school.code || "-"}</p>
            </div>

            <div className="admin-stats-strip">
              <div className="stat-item">
                <span>Status</span>
                <strong>{school.status || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>City</span>
                <strong>{school.city || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Phone</span>
                <strong>{school.phone || "-"}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <tbody>
                  <tr>
                    <td>Id</td>
                    <td>#{school.id}</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{school.name}</td>
                  </tr>
                  <tr>
                    <td>Code</td>
                    <td>{school.code || "-"}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{school.email || "-"}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{school.address || "-"}</td>
                  </tr>
                  <tr>
                    <td>Created</td>
                    <td>{school.created_at || "-"}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{school.status || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null) : null}
      </section>
    </div>
  );
}

export default SchoolDetails;
