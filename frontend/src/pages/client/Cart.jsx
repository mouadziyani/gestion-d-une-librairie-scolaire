import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCartItems, getCartTotals, removeCartItem, updateCartItem } from "../../services/cartService";
import { formatDh } from "../../data/catalog";
import { resolveMediaUrl } from "../../utils/media";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCartItems());

  useEffect(() => {
    setCart(getCartItems());
  }, []);

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
          <h2>Your Cart</h2>

          {cart.length ? (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
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
                          {imageSrc ? <img src={imageSrc} alt={item.name} className="cart-img" /> : <div className="cart-img cart-img-placeholder">No image</div>}
                          <div>
                            <h4 style={{ margin: 0 }}>{item.name}</h4>
                            <p style={{ fontSize: "12px", color: "#888", margin: "5px 0 0" }}>
                              Ref: {item.reference || `#${item.id}`}
                            </p>
                            {Number(item.stock || 0) > 0 ? (
                              <p style={{ fontSize: "11px", color: "#aaa", margin: "4px 0 0" }}>
                                Stock: {item.stock}
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
                      <td style={{ fontWeight: "600" }}>{formatDh(item.price * item.quantity)}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontWeight: "bold" }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn-wishlist" type="button" onClick={handleClear}>
                  Clear cart
                </button>
                <Link to="/products" className="btn-wishlist">
                  Continue shopping
                </Link>
              </div>
            </>
          ) : (
            <div className="cart-empty-state">
              <h3>Your cart is empty.</h3>
              <p>Add products from the catalog to validate your order.</p>
              <Link to="/products" className="btn-elegant" style={{ display: "inline-flex", width: "auto" }}>
                Browse products
              </Link>
            </div>
          )}
        </section>

        <section className="cart-summary-side">
          <div className="cart-summary-card">
            <h3 style={{ marginBottom: "25px" }}>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatDh(totals.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: "#27ae60", fontWeight: "600" }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatDh(totals.total)}</span>
            </div>

            <button className="btn-checkout" type="button" onClick={() => navigate("/Checkout")} disabled={!cart.length}>
              Proceed to Checkout
            </button>

            <p style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "15px" }}>
              Tax included. Secure payment guaranteed.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cart;
