import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteProduct, getProducts } from "@/shared/services/productService";
import { useUiPreferences } from "@/shared/context/UIContext";

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function ProductsListAdmin() {
  const location = useLocation();
  const { t } = useUiPreferences();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const addPath = isModeratorRoute ? null : "/admin/products/create";
  const detailsPath = isModeratorRoute ? "/moderator/product-details" : "/admin/products/details";
  const editPath = isModeratorRoute ? "/moderator/edit-product" : "/admin/products/edit";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts({
        page,
        search: search.trim() || undefined,
        status: statusFilter,
      });
      setProducts(Array.isArray(data?.data) ? data.data : []);
      setLastPage(data?.last_page || 1);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || t("pages.failedLoadProducts"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search, statusFilter]);

  async function handleDelete(id) {
    const confirmed = window.confirm(t("pages.deleteProductConfirm"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || t("pages.failedDeleteProduct"));
    }
  }

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">{t("pages.adminArea")}</span>
          <h2>{t("pages.inventoryList")}</h2>
        </div>
        {addPath ? (
          <Link
            to={addPath}
            className="btn-base btn-primary"
            style={{ textDecoration: "none", padding: "12px 25px" }}
          >
            + {t("pages.addNewProduct")}
          </Link>
        ) : null}
      </header>

      <section className="filter-bar-admin">
        <div className="filter-field" style={{ flex: 2 }}>
          <label htmlFor="search">{t("pages.searchProducts")}</label>
          <input
            type="text"
            id="search"
            placeholder={t("pages.searchProductsPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status">{t("common.status")}</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">{t("pages.allItems")}</option>
            <option value="active">{t("pages.activeOnly")}</option>
            <option value="inactive">{t("pages.inactiveOnly")}</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-elegant"
          style={{ padding: "12px 30px" }}
          onClick={loadProducts}
        >
          {t("common.refresh")}
        </button>
      </section>

      {error && <div className="form-alert form-alert-error">{error}</div>}

      <section className="data-table-container">
        {!loading ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("pages.productName")}</th>
                <th>{t("navbar.categories")}</th>
                <th>{t("pages.price")}</th>
                <th>{t("pages.stock")}</th>
                <th>{t("common.status")}</th>
                <th className="table-align-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((product) => {
                  const isActive = product.status === "active" && Number(product.is_available) !== 0;

                  return (
                    <tr key={product.id}>
                      <td className="table-meta-cell">#{product.id}</td>
                      <td className="table-strong-cell">{product.name}</td>
                      <td>{product.category?.name || "-"}</td>
                      <td>{formatMoney(product.price)}</td>
                      <td>{product.stock ?? 0} {t("pages.units")}</td>
                      <td>
                        <span className={`status-indicator ${isActive ? "active-status" : "inactive-status"}`}>
                          {isActive ? t("pages.productStatusActive") : t("pages.productStatusInactive")}
                        </span>
                      </td>
                      <td className="table-align-end">
                        <Link
                          to={`${detailsPath}?id=${product.id}`}
                          className="action-link spaced-action-link"
                        >
                          {t("common.view")}
                        </Link>
                        <Link
                          to={`${editPath}?id=${product.id}`}
                          className="action-link spaced-action-link"
                        >
                          {t("common.edit")}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="action-link action-button-link delete-link"
                        >
                          {t("common.delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty-cell table-empty-cell-compact">
                    {t("pages.noProductsFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : null}
      </section>

      <div className="pagination-row pagination-row-bottom">
        <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {t("common.previous")}
        </button>
        <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}

export default ProductsListAdmin;
