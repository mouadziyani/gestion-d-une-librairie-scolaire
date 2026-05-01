import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function SpecialOrdersList() {
  const location = useLocation();
  const { t } = useUiPreferences();
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
          setError(err?.response?.data?.message || t("pages.failedLoadSpecialOrders"));
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
          <span className="eyebrow-label">{isModeratorRoute ? t("pages.moderatorArea") : t("pages.adminArea")} / {t("sidebar.specialOrders")}</span>
          <h2>{t("pages.specialOrders")}</h2>
        </div>
        <Link to="/special-order" className="btn-add-role">
          {t("pages.publicRequestForm")}
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="special-search">{t("common.search")}</label>
          <input id="special-search" type="search" placeholder={t("pages.searchSpecialOrdersPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="special-status">{t("common.status")}</label>
          <select id="special-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("common.allStatuses")}</option>
            <option value="pending">{t("pages.pending")}</option>
            <option value="approved">{t("pages.approved")}</option>
            <option value="rejected">{t("pages.rejected")}</option>
            <option value="completed">{t("pages.completed")}</option>
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
                <th>{t("pages.item")}</th>
                <th>{t("pages.school")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.actions")}</th>
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
                          {t("common.view")}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">{t("pages.noSpecialOrdersMatch")}</td>
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
