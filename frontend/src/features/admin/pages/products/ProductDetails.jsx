import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct, getProduct } from "@/shared/services/productService";
import { useUiPreferences } from "@/shared/context/UIContext";
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
  const { t } = useUiPreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/products" : "/admin/products";
  const editPath = isModeratorRoute ? "/moderator/edit-product" : "/admin/products/edit";
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
          setError(err?.response?.data?.message || t("adminProducts.failedLoadProduct"));
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
  }, [productId, t]);

  const statusLabel = useMemo(() => {
    if (!product) {
      return t("adminProducts.statusUnknown");
    }

    return product.status === "active" && Number(product.is_available) !== 0 ? t("adminProducts.available") : t("adminProducts.unavailable");
  }, [product, t]);

  async function handleDelete() {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(t("adminProducts.deleteProductConfirmNamed", { name: product.name }));

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteProduct(product.id);
      navigate(listPath);
    } catch (err) {
      setError(err?.response?.data?.message || t("adminProducts.failedDeleteProduct"));
    } finally {
      setDeleting(false);
    }
  }

  if (!productId) {
    return (
      <div className="admin-detail-wrapper">
        <div className="admin-card">
          <div className="admin-detail-content">
            <h2>{t("adminProducts.missingProductId")}</h2>
            <p>{t("adminProducts.openFromProductsList")}</p>
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
            <h2>{t("adminProducts.productDetails")}</h2>
            <p style={{ color: "#b91c1c" }}>{error}</p>
            <button type="button" className="btn-save" onClick={() => navigate(listPath)}>
              {t("adminProducts.backToProducts")}
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
            <h2>{t("public.productNotFound")}</h2>
            <button type="button" className="btn-save" onClick={() => navigate(listPath)}>
              {t("adminProducts.backToProducts")}
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
        <p style={{ fontSize: "12px", letterSpacing: "2px", color: "#888" }}>{`${t("pages.adminArea")} / ${t("pages.inventoryList")} / ${t("adminProducts.productDetails")}`}</p>
        <h1 style={{ fontFamily: "Fraunces, serif" }}>{t("adminProducts.manageProduct")}</h1>
      </header>

      <div className="admin-card">
        <div className="admin-product-side">
          <div className="admin-product-img">
            {imageSrc ? <img src={imageSrc} alt={product.name} /> : <span>{t("adminProducts.noImageSelected")}</span>}
          </div>
          <div className="admin-actions-bar" style={{ flexDirection: "column" }}>
            <Link
              to={`${editPath}?id=${product.id}`}
              className="btn-save"
              style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center" }}
            >
              {t("adminProducts.editProduct")}
            </Link>
            <button type="button" className="btn-archive" onClick={handleDelete} disabled={deleting}>
              {deleting ? t("adminProducts.deleting") : t("adminProducts.deleteProduct")}
            </button>
          </div>
        </div>

        <div className="admin-detail-content">
          <div className="admin-stats-strip">
            <div className="stat-item">
              <span>{t("adminProducts.currentStock")}</span>
              <strong>{t("adminProducts.unitsLabel", { count: Number(product.stock || 0) })}</strong>
            </div>
            <div className="stat-item">
              <span>{t("pages.price")}</span>
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <div className="stat-item">
              <span>{t("common.status")}</span>
              <strong style={{ color: statusLabel === t("adminProducts.available") ? "#0ca678" : "#e74c3c" }}>
                {statusLabel}
              </strong>
            </div>
          </div>

          <form>
            <div className="admin-form-group">
              <label>{t("adminProducts.productName")}</label>
              <input type="text" value={product.name || ""} readOnly />
            </div>

            <div className="admin-form-group">
              <label>{t("adminProducts.description")}</label>
              <textarea rows="4" value={product.description || ""} readOnly />
            </div>

            <div className="admin-product-fields-grid">
              <div className="admin-form-group">
                <label>{t("adminProducts.category")}</label>
                <input type="text" value={product.category?.name || t("adminProducts.categoryFallback")} readOnly />
              </div>
            <div className="admin-form-group">
              <label>{t("adminProducts.referenceBarcode")}</label>
              <input type="text" value={product.reference || "-"} readOnly />
              <div className="barcode-preview">
                <span>{t("adminProducts.barcodeReference")}</span>
                <strong>{product.reference || t("adminProducts.autoReference")}</strong>
              </div>
            </div>
            </div>

            <div className="admin-product-fields-grid">
              <div className="admin-form-group">
                <label>{t("adminProducts.minStock")}</label>
                <input type="text" value={product.min_stock ?? 0} readOnly />
              </div>
              <div className="admin-form-group">
                <label>{t("adminProducts.availability")}</label>
                <input
                  type="text"
                  value={Number(product.is_available) !== 0 ? t("adminProducts.available") : t("adminProducts.unavailable")}
                  readOnly
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>{t("adminProducts.slug")}</label>
              <input type="text" value={product.slug || "-"} readOnly />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsAdmin;
