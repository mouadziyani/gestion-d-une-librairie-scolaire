import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct, getProduct } from "@/shared/services/productService";
import { resolveMediaUrl } from "@/shared/utils/common/media";

function formatPrice(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(number);
}

function ProductDetailsAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/products" : "/ProductsListAdmin";
  const editPath = isModeratorRoute ? "/moderator/edit-product" : "/EditProductAdmin";
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProduct(productId);

        if (!active) {
          return;
        }

        setProduct(data);
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load product.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  const statusLabel = useMemo(() => {
    if (!product) {
      return "Unknown";
    }

    return product.status === "active" && Number(product.is_available) !== 0 ? "Active" : "Inactive";
  }, [product]);

  async function handleDelete() {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(`Delete product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteProduct(product.id);
      navigate(listPath);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  if (!productId) {
    return (
      <div className="admin-detail-wrapper">
        <div className="admin-card">
          <div className="admin-detail-content">
            <h2>Missing Product ID</h2>
            <p>Please open this page from the products list.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="admin-detail-wrapper">
        <div className="admin-card">
          <div className="admin-detail-content">
            <h2>Product Details</h2>
            <p style={{ color: "#b91c1c" }}>{error}</p>
            <button type="button" className="btn-save" onClick={() => navigate(listPath)}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-detail-wrapper">
        <div className="admin-card">
          <div className="admin-detail-content">
            <h2>Product not found</h2>
            <button type="button" className="btn-save" onClick={() => navigate(listPath)}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imageSrc = resolveMediaUrl(product.image_url);

  return (
    <div className="admin-detail-wrapper">
      <header style={{ marginBottom: "30px" }}>
        <p style={{ fontSize: "12px", letterSpacing: "2px", color: "#888" }}>ADMIN / INVENTORY / DETAILS</p>
        <h1 style={{ fontFamily: "Fraunces, serif" }}>Manage Product</h1>
      </header>

      <div className="admin-card">
        <div className="admin-product-side">
          <div className="admin-product-img">
            {imageSrc ? <img src={imageSrc} alt={product.name} /> : <span>No image selected</span>}
          </div>
          <div className="admin-actions-bar" style={{ flexDirection: "column" }}>
            <Link
              to={`${editPath}?id=${product.id}`}
              className="btn-save"
              style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center" }}
            >
              Edit Product
            </Link>
            <button type="button" className="btn-archive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>

        <div className="admin-detail-content">
          <div className="admin-stats-strip">
            <div className="stat-item">
              <span>Current Stock</span>
              <strong>{Number(product.stock || 0)} Units</strong>
            </div>
            <div className="stat-item">
              <span>Price</span>
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <div className="stat-item">
              <span>Status</span>
              <strong style={{ color: statusLabel === "Active" ? "#0ca678" : "#e74c3c" }}>
                {statusLabel}
              </strong>
            </div>
          </div>

          <form>
            <div className="admin-form-group">
              <label>Product Name</label>
              <input type="text" value={product.name || ""} readOnly />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea rows="4" value={product.description || ""} readOnly />
            </div>

            <div className="admin-product-fields-grid">
              <div className="admin-form-group">
                <label>Category</label>
                <input type="text" value={product.category?.name || "Uncategorized"} readOnly />
              </div>
            <div className="admin-form-group">
              <label>Reference / Barcode</label>
              <input type="text" value={product.reference || "-"} readOnly />
              <div className="barcode-preview">
                <span>Barcode / Reference</span>
                <strong>{product.reference || "AUTO-REF"}</strong>
              </div>
            </div>
            </div>

            <div className="admin-product-fields-grid">
              <div className="admin-form-group">
                <label>Min Stock</label>
                <input type="text" value={product.min_stock ?? 0} readOnly />
              </div>
              <div className="admin-form-group">
                <label>Availability</label>
                <input
                  type="text"
                  value={Number(product.is_available) !== 0 ? "Available" : "Unavailable"}
                  readOnly
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Slug</label>
              <input type="text" value={product.slug || "-"} readOnly />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsAdmin;
