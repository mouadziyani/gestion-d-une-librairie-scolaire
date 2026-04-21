import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { addToCart } from "../../services/cartService";
import { getWishlistItems, saveWishlistItems } from "../../services/wishlistService";
import { resolveMediaUrl } from "../../utils/media";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    setWishlistItems(getWishlistItems());
  }, []);

  function handleRemove(id) {
    const next = wishlistItems.filter((item) => String(item.id) !== String(id));
    setWishlistItems(next);
    saveWishlistItems(next);
  }

  function handleMoveToCart(item) {
    addToCart(item, 1);
    handleRemove(item.id);
  }

  return (
    <div className="wishlist-container">
      <header>
        <p style={{ color: "#888", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>Client Area</p>
        <h2 style={{ fontFamily: "Fraunces", fontSize: "2.5rem" }}>Your Wishlist.</h2>
      </header>

      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            const imageSrc = resolveMediaUrl(item.image || item.image_url || item.img);

            return (
              <div className="wishlist-card" key={item.id}>
                <div className="wishlist-image">
                  {imageSrc ? <img src={imageSrc} alt={item.name} /> : null}
                </div>
                <div className="wishlist-content">
                  <span className="category">{item.category?.name || item.cat || "Product"}</span>
                  <h4>{item.name}</h4>
                  <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{formatMoney(item.price)}</p>

                  <div className="wishlist-actions">
                    <Button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      <ShoppingCart size={16} /> Move to Cart
                    </Button>
                    <button className="btn-remove" title="Remove" type="button" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <p style={{ color: "#888", fontSize: "1.2rem" }}>Your wishlist is empty.</p>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <Button variant="outline" style={{ marginTop: "20px" }}>Explore Library</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
