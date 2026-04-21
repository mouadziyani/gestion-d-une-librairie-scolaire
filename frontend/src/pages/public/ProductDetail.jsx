import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProduct } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { addToWishlist, isInWishlist } from "../../services/wishlistService";
import { resolveMediaUrl } from "../../utils/media";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function ProductDetail() {
  const [searchParams] = useSearchParams();
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
        setError("Please choose a product from the catalogue.");
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
          setError(err?.response?.data?.message || "Failed to load product details.");
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

  const canAddToCart = useMemo(() => {
    if (!product) {
      return false;
    }

    return product.status === "active" && Number(product.is_available) !== 0 && Number(product.stock || 0) > 0;
  }, [product]);

  function handleAddToCart() {
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
        <h2>Product not found</h2>
        <p>{error || "This product is not available."}</p>
        <Link to="/products" className="btn-filled">
          Back to products
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
            {imageSrc ? <img src={imageSrc} alt={product.name} /> : <div className="detail-image-placeholder">No image selected</div>}
          </div>
          <div className="detail-media-strip">
            <span>{product.reference || "NO-REF"}</span>
            <strong>{product.category?.name || "Product"}</strong>
          </div>
        </section>

        <div className="detail-info-box">
          <div className="detail-badges-row">
            <span className="brand">{product.category?.name || "Product"}</span>
            {hasDiscount ? <span className="detail-discount-badge">-{product.discount}%</span> : null}
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <span className="price-tag">{formatMoney(product.price)}</span>
            <span className={canAddToCart ? "detail-stock-pill is-available" : "detail-stock-pill"}>
              {canAddToCart ? `${stockCount} in stock` : "Special order"}
            </span>
          </div>

          <div className="detail-description">
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="detail-purchase-panel">
            <div className="detail-quantity-row">
              <span>Quantity</span>
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
              <button className="btn-cart" type="button" onClick={handleAddToCart} disabled={!canAddToCart}>
                {canAddToCart ? (added ? `${quantity} Added` : "Add to Cart") : "Special Order"}
              </button>
              <button className="btn-wishlist" type="button" onClick={handleWishlist} disabled={wishlisted}>
                {wishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
              <Link to="/Cart" className="btn-wishlist">
                View Cart
              </Link>
            </div>
          </div>

          <div className="detail-spec-grid">
            <div>
              <span>SKU</span>
              <strong>{product.reference || "-"}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{product.category?.name || "-"}</strong>
            </div>
            <div>
              <span>Stock</span>
              <strong>{canAddToCart ? `${product.stock} available` : "Special order"}</strong>
            </div>
            <div>
              <span>Discount</span>
              <strong>{hasDiscount ? `${product.discount}%` : "No discount"}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
