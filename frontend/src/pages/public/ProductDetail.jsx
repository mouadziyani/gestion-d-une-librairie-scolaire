import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProduct } from "../../services/productService";
import { addToCart } from "../../services/cartService";
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

    addToCart(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
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

  const imageSrc = resolveMediaUrl(product.image_url) || "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=500";

  return (
    <div className="product-detail-page">
      <main className="detail-wrapper">
        <div className="detail-image-box">
          <img src={imageSrc} alt={product.name} />
        </div>

        <div className="detail-info-box">
          <span className="brand">{product.category?.name || "Product"}</span>
          <h1>{product.name}</h1>
          <span className="price-tag">{formatMoney(product.price)}</span>

          <div className="detail-description">
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="detail-actions">
            <button className="btn-cart" type="button" onClick={handleAddToCart} disabled={!canAddToCart}>
              {canAddToCart ? (added ? "Added to Cart" : "Add to Cart") : "Special Order"}
            </button>
            <Link to="/Cart" className="btn-wishlist">
              View Cart
            </Link>
          </div>

          <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <p style={{ fontSize: "13px", color: "#888" }}>
              <strong>SKU:</strong> {product.reference || "-"} <br />
              <strong>Category:</strong> {product.category?.name || "-"} <br />
              <strong>Stock:</strong> {canAddToCart ? `${product.stock} available` : "Special order"} <br />
              <strong>Discount:</strong> {Number(product.discount || 0) > 0 ? `${product.discount}%` : "No discount"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
