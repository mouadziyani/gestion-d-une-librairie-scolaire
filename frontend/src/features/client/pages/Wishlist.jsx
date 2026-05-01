import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { addToCart } from "@/features/client/services/cartService";
import { getWishlistItems, saveWishlistItems } from "@/features/client/services/wishlistService";
import { useUiPreferences } from "@/shared/context/UIContext";
import { resolveMediaUrl } from "@/shared/utils/common/media";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Wishlist() {
  const { t } = useUiPreferences();
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
        <p className="checkout-eyebrow">{t("wishlistPage.clientArea")}</p>
        <h2 className="wishlist-title">{t("wishlistPage.title")}</h2>
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
                  <span className="category">{item.category?.name || item.cat || t("wishlistPage.productFallback")}</span>
                  <h4>{item.name}</h4>
                  <p className="wishlist-price">{formatMoney(item.price)}</p>

                  <div className="wishlist-actions">
                    <Button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="wishlist-move-button"
                    >
                      <ShoppingCart size={16} /> {t("wishlistPage.moveToCart")}
                    </Button>
                    <button className="btn-remove" title={t("wishlistPage.remove")} type="button" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="wishlist-empty-state">
          <p className="wishlist-empty-copy">{t("wishlistPage.empty")}</p>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <Button variant="outline" style={{ marginTop: "20px" }}>{t("wishlistPage.explore")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
