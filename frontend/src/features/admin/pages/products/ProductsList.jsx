import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteProduct, getProducts } from "@/shared/services/productService";

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
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const addPath = isModeratorRoute ? null : "/AddProductAdmin";
  const detailsPath = isModeratorRoute ? "/moderator/product-details" : "/ProductDetailsAdmin";
  const editPath = isModeratorRoute ? "/moderator/edit-product" : "/EditProductAdmin";
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
      setError(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search, statusFilter]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product.");
    }
  }

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span style={{ fontSize: "11px", color: "#888", letterSpacing: "2px", fontWeight: "bold" }}>ADMIN AREA</span>
          <h2>Inventory List</h2>
        </div>
        {addPath ? (
          <Link
            to={addPath}
            className="btn-base btn-primary"
            style={{ textDecoration: "none", padding: "12px 25px" }}
          >
            + Add New Product
          </Link>
        ) : null}
      </header>

      <section className="filter-bar-admin">
        <div className="filter-field" style={{ flex: 2 }}>
          <label htmlFor="search">Search Products</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, reference, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Items</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-elegant"
          style={{ padding: "12px 30px" }}
          onClick={loadProducts}
        >
          Refresh
        </button>
      </section>

      {error && (
        <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <section className="data-table-container">
        {!loading ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((product) => {
                  const isActive = product.status === "active" && Number(product.is_available) !== 0;

                  return (
                    <tr key={product.id}>
                      <td style={{ color: "#aaa", fontSize: "12px" }}>#{product.id}</td>
                      <td style={{ fontWeight: "600" }}>{product.name}</td>
                      <td>{product.category?.name || "-"}</td>
                      <td>{formatMoney(product.price)}</td>
                      <td>{product.stock ?? 0} units</td>
                      <td>
                        <span className={`status-indicator ${isActive ? "active-status" : "inactive-status"}`}>
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          to={`${detailsPath}?id=${product.id}`}
                          style={{ marginRight: "15px", fontSize: "13px", color: "#1a1a1a" }}
                        >
                          View
                        </Link>
                        <Link
                          to={`${editPath}?id=${product.id}`}
                          style={{ marginRight: "15px", fontSize: "13px", color: "#1a1a1a" }}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "13px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#888" }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : null}
      </section>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
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

export default ProductsListAdmin;
