import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminUsers } from "../../../services/adminUserService";

function UsersReports() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const data = await getAdminUsers();
        if (active) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load users report.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const roles = useMemo(
    () =>
      [...new Map(users.map((user) => [user.role?.slug || "none", user.role?.name || "No role"])).entries()].map(
        ([slug, name]) => ({ slug, name }),
      ),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.phone, user.role?.name, user.role?.slug]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesRole = roleFilter === "all" || (user.role?.slug || "none") === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const activeUsers = users.filter((user) => user.status !== "inactive").length;

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">ADMIN / REPORTS</span>
          <h2>Users Reports</h2>
        </div>
        <Link to="/admin/users" className="btn-add-role">
          Open users list
        </Link>
      </header>

      <div className="admin-stats-strip">
        <div className="stat-item">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="stat-item">
          <span>Active users</span>
          <strong>{activeUsers}</strong>
        </div>
        <div className="stat-item">
          <span>Roles</span>
          <strong>{roles.length}</strong>
        </div>
      </div>

      <section className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="user-report-search">Search</label>
          <input
            id="user-report-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, role..."
          />
        </div>
        <div className="filter-field">
          <label htmlFor="user-report-role">Role</label>
          <select id="user-report-role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.name || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.role?.name || "-"}</td>
                      <td>{user.phone || "-"}</td>
                      <td>{user.created_at || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users match your filters.</td>
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

export default UsersReports;
