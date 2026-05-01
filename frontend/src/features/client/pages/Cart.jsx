import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CART_CHANGED_EVENT,
  clearCart,
  getCartItems,
  getCartTotals,
  removeCartItem,
  syncCartWithProducts,
  updateCartItem,
} from "@/features/client/services/cartService";
import { formatDh } from "@/data/catalog";
import { useUiPreferences } from "@/shared/context/UIContext";
import { resolveMediaUrl } from "@/shared/utils/common/media";

function Cart() {
  const { t } = useUiPreferences();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCartItems());
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function refreshCart() {
      const previousCart = getCartItems();
      setCart(previousCart);
      setSyncing(true);
      setSyncMessage("");

      try {
        const syncedCart = await syncCartWithProducts();
        if (!active) {
          return;
        }

        setCart(syncedCart);

        if (JSON.stringify(previousCart) !== JSON.stringify(syncedCart)) {
          setSyncMessage(t("cartPage.updatedMessage"));
        }
      } catch {
        if (active) {
          setSyncMessage(t("cartPage.savedCartMessage"));
        }
      } finally {
        if (active) {
          setSyncing(false);
        }
      }
    }

    function handleCartChange(event) {
      setCart(Array.isArray(event?.detail?.items) ? event.detail.items : getCartItems());
    }

    refreshCart();
    window.addEventListener(CART_CHANGED_EVENT, handleCartChange);
    window.addEventListener("storage", handleCartChange);

    return () => {
      active = false;
      window.removeEventListener(CART_CHANGED_EVENT, handleCartChange);
      window.removeEventListener("storage", handleCartChange);
    };
  }, [t]);

  const totals = useMemo(() => getCartTotals(cart), [cart]);

  function syncCart(nextCart) {
    setCart([...nextCart]);
  }

  function handleDecrease(id, quantity) {
    const nextCart = updateCartItem(id, quantity - 1);
    syncCart(nextCart);
  }

  function handleIncrease(id, quantity) {
    const nextCart = updateCartItem(id, quantity + 1);
    syncCart(nextCart);
  }

  function handleRemove(id) {
    const nextCart = removeCartItem(id);
    syncCart(nextCart);
  }

  function handleClear() {
    const nextCart = clearCart();
    syncCart(nextCart);
  }

  return (
    <div className="cart-page">
      <main className="cart-wrapper">
        <section className="cart-items-section">
          <h2>{t("cartPage.title")}</h2>
          {syncing ? <p className="cart-sync-note">{t("cartPage.refreshing")}</p> : null}
          {syncMessage ? <p className="cart-sync-note">{syncMessage}</p> : null}

          {cart.length ? (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>{t("cartPage.product")}</th>
                    <th>{t("cartPage.quantity")}</th>
                    <th>{t("cartPage.price")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const imageSrc = resolveMediaUrl(item.image_url || item.img || item.image);
                    const stockLimitReached = Number(item.stock || 0) > 0 && Number(item.quantity || 0) >= Number(item.stock || 0);

                    return (
                    <tr className="cart-item-row" key={item.id}>
                      <td>
                        <div className="cart-product-info">
                          {imageSrc ? <img src={imageSrc} alt={item.name} className="cart-img" /> : <div className="cart-img cart-img-placeholder">{t("cartPage.noImage")}</div>}
                          <div>
                            <h4 className="cart-item-title">{item.name}</h4>
                            <p className="cart-item-meta">
                              {t("cartPage.reference")}: {item.reference || `#${item.id}`}
                            </p>
                            {Number(item.stock || 0) > 0 ? (
                              <p className="cart-item-stock">
                                {t("cartPage.stock")}: {item.stock}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="qty-control">
                          <button type="button" onClick={() => handleDecrease(item.id, item.quantity)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => handleIncrease(item.id, item.quantity)} disabled={stockLimitReached}>
                            +
                          </button>
                        </div>
                      </td>
                      <td className="table-strong-cell">{formatDh(item.price * item.quantity)}</td>
                      <td className="table-align-end">
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="cart-remove-button"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="cart-actions-row">
                <button className="btn-wishlist" type="button" onClick={handleClear}>
                  {t("cartPage.clearCart")}
                </button>
                <Link to="/products" className="btn-wishlist">
                  {t("cartPage.continueShopping")}
                </Link>
              </div>
            </>
          ) : (
            <div className="cart-empty-state">
              <h3>{t("cartPage.emptyTitle")}</h3>
              <p>{t("cartPage.emptyDescription")}</p>
              <Link to="/products" className="btn-elegant" style={{ display: "inline-flex", width: "auto" }}>
                {t("cartPage.browseProducts")}
              </Link>
            </div>
          )}
        </section>

        <section className="cart-summary-side">
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">{t("cartPage.orderSummary")}</h3>

            <div className="summary-row">
              <span>{t("cartPage.subtotal")}</span>
              <span>{formatDh(totals.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>{t("cartPage.delivery")}</span>
              <span className="checkout-success-text">{t("cartPage.free")}</span>
            </div>

            <div className="summary-row summary-total">
              <span>{t("cartPage.total")}</span>
              <span>{formatDh(totals.total)}</span>
            </div>

            <button className="btn-checkout" type="button" onClick={() => navigate("/checkout")} disabled={!cart.length}>
              {t("cartPage.proceedToCheckout")}
            </button>

            <p className="cart-summary-note">
              {t("cartPage.note")}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cart;
