import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAdminUser, getAdminUsers } from "@/features/admin/services/adminUserService";
import { getRoles } from "@/features/admin/services/roleService";
import { useUiPreferences } from "@/shared/context/UIContext";

function UsersList() {
  const navigate = useNavigate();
  const { t } = useUiPreferences();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const [userList, roleList] = await Promise.all([getAdminUsers(), getRoles()]);
        if (active) {
          setUsers(Array.isArray(userList) ? userList : []);
          setRoles(Array.isArray(roleList) ? roleList : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || t("pages.failedLoadUsers"));
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

  const roleOptions = useMemo(
    () =>
      roles.map((role) => ({
        slug: role.slug,
        name: role.name || role.slug,
      })),
    [roles],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.phone, user.role?.name, user.role?.slug]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesRole = roleFilter === "all" || user.role?.slug === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  async function handleDelete(id) {
    const confirmed = window.confirm(t("pages.deleteUserConfirm"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || t("pages.failedDeleteUser"));
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{t("pages.adminArea")} / {t("sidebar.users")}</span>
          <h2>{t("pages.usersList")}</h2>
        </div>
        <button type="button" className="btn-add-role" onClick={() => navigate("/admin/users/create")}>
          + {t("pages.addUser")}
        </button>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="user-search">{t("common.search")}</label>
          <input
            id="user-search"
            type="search"
            placeholder={t("pages.searchUsersPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="role-filter">{t("pages.role")}</label>
          <select id="role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">{t("pages.allRoles")}</option>
            {roleOptions.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.name}
              </option>
            ))}
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
                <th>{t("pages.name")}</th>
                <th>{t("auth.email")}</th>
                <th>{t("pages.role")}</th>
                <th>{t("pages.phone")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role?.name || t("pages.unknown")}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <Link to={`/admin/users/details?id=${user.id}`} className="action-link">
                        {t("common.view")}
                      </Link>
                      <Link to={`/admin/users/edit?id=${user.id}`} className="action-link">
                        {t("common.edit")}
                      </Link>
                      <button type="button" className="action-link delete-link action-button-link" onClick={() => handleDelete(user.id)}>
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">{t("pages.noUsersMatch")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default UsersList;
