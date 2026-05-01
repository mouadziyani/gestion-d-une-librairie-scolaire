import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getProduct } from "@/shared/services/productService";
import { addToCart } from "@/features/client/services/cartService";
import { addToWishlist, isInWishlist } from "@/features/client/services/wishlistService";
import { AuthContext } from "@/features/auth/authContext";
import { useUiPreferences } from "@/shared/context/UIContext";
import { resolveMediaUrl } from "@/shared/utils/common/media";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function ProductDetail() {
  const { user } = useContext(AuthContext);
  const { t } = useUiPreferences();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const productId = searchParams.get("productId");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      if (!productId) {
        setProduct(null);
        setError(t("public.chooseProductFromCatalogue"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getProduct(productId);
        if (active) {
          setProduct(data);
          setQuantity(1);
          setWishlisted(isInWishlist(data?.id));
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || t("public.failedLoadProductDetails"));
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

  const canAddToCart = useMemo(() => {
    if (!product) {
      return false;
    }

    return product.status === "active" && Number(product.is_available) !== 0 && Number(product.stock || 0) > 0;
  }, [product]);

  const isAuthenticated = !!user;

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
      return;
    }

    if (!product || !canAddToCart) {
      return;
    }

    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  function handleQuantityChange(nextQuantity) {
    if (!product) {
      return;
    }

    const stock = Number(product.stock || 0);
    const cappedQuantity = stock > 0 ? Math.min(Math.max(1, nextQuantity), stock) : 1;
    setQuantity(cappedQuantity);
  }

  function handleWishlist() {
    if (!product) {
      return;
    }

    addToWishlist(product);
    setWishlisted(true);
  }

  if (loading) {
    return null;
  }

  if (error || !product) {
    return (
      <div className="product-detail-page detail-empty">
        <h2>{t("public.productNotFound")}</h2>
        <p>{error || t("public.productUnavailable")}</p>
        <Link to="/products" className="btn-filled">
          {t("public.backToProducts")}
        </Link>
      </div>
    );
  }

  const imageSrc = resolveMediaUrl(product.image_url);
  const hasDiscount = Number(product.discount || 0) > 0;
  const stockCount = Number(product.stock || 0);

  return (
    <div className="product-detail-page">
      <main className="detail-wrapper">
        <section className="detail-media-panel">
          <div className="detail-image-box">
            {imageSrc ? <img src={imageSrc} alt={product.name} /> : <div className="detail-image-placeholder">{t("public.noImageSelected")}</div>}
          </div>
          <div className="detail-media-strip">
            <span>{product.reference || "NO-REF"}</span>
            <strong>{product.category?.name || t("public.productFallback")}</strong>
          </div>
        </section>

        <div className="detail-info-box">
          <div className="detail-badges-row">
            <span className="brand">{product.category?.name || t("public.productFallback")}</span>
            {hasDiscount ? <span className="detail-discount-badge">-{product.discount}%</span> : null}
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <span className="price-tag">{formatMoney(product.price)}</span>
            <span className={canAddToCart ? "detail-stock-pill is-available" : "detail-stock-pill"}>
              {canAddToCart ? t("public.inStockCount", { count: stockCount }) : t("public.specialOrder")}
            </span>
          </div>

          <div className="detail-description">
            <p>{product.description || t("public.noDescription")}</p>
          </div>

          <div className="detail-purchase-panel">
            <div className="detail-quantity-row">
              <span>{t("public.quantity")}</span>
              <div className="detail-quantity-stepper">
                <button type="button" onClick={() => handleQuantityChange(quantity - 1)} disabled={!canAddToCart || quantity <= 1}>
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => handleQuantityChange(quantity + 1)} disabled={!canAddToCart || quantity >= stockCount}>
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn-cart" type="button" onClick={handleAddToCart} disabled={isAuthenticated && !canAddToCart}>
                {!isAuthenticated ? t("public.loginToAdd") : canAddToCart ? (added ? t("public.addedQuantity", { count: quantity }) : t("public.addToCart")) : t("public.specialOrder")}
              </button>
              <button className="btn-wishlist" type="button" onClick={handleWishlist} disabled={wishlisted}>
                {wishlisted ? t("public.inWishlist") : t("public.addToWishlist")}
              </button>
              {isAuthenticated ? (
                <Link to="/cart" className="btn-wishlist">
                  {t("public.viewCart")}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="detail-spec-grid">
            <div>
              <span>{t("public.sku")}</span>
              <strong>{product.reference || "-"}</strong>
            </div>
            <div>
              <span>{t("public.category")}</span>
              <strong>{product.category?.name || "-"}</strong>
            </div>
            <div>
              <span>{t("public.stock")}</span>
              <strong>{canAddToCart ? t("public.availableCount", { count: product.stock }) : t("public.specialOrder")}</strong>
            </div>
            <div>
              <span>{t("public.discount")}</span>
              <strong>{hasDiscount ? `${product.discount}%` : t("public.noDiscount")}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
