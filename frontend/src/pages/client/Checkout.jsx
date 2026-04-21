import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { clearCart, getCartItems, getCartTotals } from "../../services/cartService";
import { submitCheckout } from "../../services/orderService";
import { createStripePaymentIntent } from "../../services/stripeService";
import { api } from "../../services/api";
import { formatDh } from "../../data/catalog";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePublishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.STRIPE_PUBLISHABLE_KEY ||
  "";

const stripeAppearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#1a1a1a",
    colorBackground: "#fcfcfc",
    colorText: "#1a1a1a",
    colorDanger: "#c53030",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    borderRadius: "10px",
    spacingUnit: "4px",
  },
};

function StripePaymentForm({ onConfirmCheckout, onBack, totals, amountLabel, billingName, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [fieldError, setFieldError] = useState("");

  async function handleStripeSubmit(event) {
    event.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is still loading.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement || !paymentComplete) {
      setError("Please complete the card details before continuing.");
      return;
    }

    setPaying(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName || undefined,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Stripe payment failed.");
        return;
      }

      if (!result.paymentIntent) {
        setError("Stripe payment could not be confirmed.");
        return;
      }

      await onConfirmCheckout(result.paymentIntent);
    } catch (submitError) {
      setError(submitError?.message || "Stripe payment failed.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="stripe-payment-panel">
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "Fraunces", marginBottom: "8px" }}>Pay with card</h3>
        <p style={{ color: "#666", fontSize: "13px" }}>
          Complete the secure Stripe payment for {amountLabel}.
        </p>
        <p style={{ color: "#888", fontSize: "12px", marginTop: "6px" }}>
          Enter the test card number, expiry date, and CVC in the Stripe form below.
        </p>
      </div>

      <form onSubmit={handleStripeSubmit}>
        <div className="stripe-element-shell">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1a1a1a",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  "::placeholder": {
                    color: "#888",
                  },
                },
                invalid: {
                  color: "#c53030",
                },
              },
            }}
            onChange={(event) => {
              setPaymentComplete(Boolean(event.complete));
              setFieldError(event.error?.message || "");
              if (error) {
                setError("");
              }
            }}
          />
        </div>

        {fieldError ? (
          <div className="checkout-field-hint" style={{ marginTop: "12px" }} role="status" aria-live="polite">
            {fieldError}
          </div>
        ) : (
          <div className="checkout-field-hint" style={{ marginTop: "12px" }}>
            For test mode, use 4242 4242 4242 4242 with any future date and any CVC.
          </div>
        )}

        {error ? (
          <div className="checkout-error" style={{ marginTop: "14px" }} role="alert" aria-live="polite">
            {error}
          </div>
        ) : null}

        <div className="stripe-actions">
          <button type="button" className="btn-wishlist" onClick={onBack}>
            Back to payment methods
          </button>
          <button type="submit" className="btn-elegant" disabled={!stripe || !elements || paying || !paymentComplete}>
            {paying ? "Processing payment..." : `Pay ${formatDh(totals.total)}`}
          </button>
        </div>
      </form>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => getCartItems());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [stripeIntent, setStripeIntent] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    delivery_address: "",
    school_id: "",
    payment_method: "cash",
    note: "",
  });

  useEffect(() => {
    if (user?.name) {
      setForm((current) => ({
        ...current,
        customer_name: user.name,
      }));
    }
  }, [user]);

  useEffect(() => {
    setCart(getCartItems());
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSchools() {
      try {
        const response = await api.get("/schools");
        if (active) {
          const schoolsData = response.data?.data;
          setSchools(Array.isArray(schoolsData?.data) ? schoolsData.data : Array.isArray(schoolsData) ? schoolsData : []);
        }
      } catch {
        if (active) {
          setSchools([]);
        }
      }
    }

    loadSchools();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadStripeIntent() {
      if (form.payment_method !== "stripe") {
        setStripeIntent(null);
        setStripeError("");
        setStripeLoading(false);
        return;
      }

      if (!cart.length) {
        setStripeIntent(null);
        setStripeError("Add products to your cart before paying with card.");
        setStripeLoading(false);
        return;
      }

      if (!stripePublishableKey) {
        setStripeIntent(null);
        setStripeError("Stripe is not configured yet. Please use cash.");
        setStripeLoading(false);
        return;
      }

      let activeStripePromise = stripePromise;

      if (!activeStripePromise) {
        const { loadStripe } = await import("@stripe/stripe-js");
        activeStripePromise = loadStripe(stripePublishableKey);

        if (!active) {
          return;
        }

        setStripePromise(activeStripePromise);
      }

      try {
        setStripeLoading(true);
        setStripeError("");

        const result = await createStripePaymentIntent({
          school_id: form.school_id || null,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        });

        if (!active) {
          return;
        }

        setStripeIntent(result);
      } catch (intentError) {
        if (active) {
          setStripeIntent(null);
          setStripeError(intentError?.response?.data?.message || "Unable to initialize Stripe payment.");
        }
      } finally {
        if (active) {
          setStripeLoading(false);
        }
      }
    }

    loadStripeIntent();

    return () => {
      active = false;
    };
  }, [cart, form.payment_method, form.school_id, stripePromise]);

  const totals = useMemo(() => getCartTotals(cart), [cart]);
  const successReference = success?.payment?.reference || (success?.order?.id ? `ORD-${success.order.id}` : "Validated successfully");

  const checkoutPayload = useMemo(
    () => ({
      delivery_address: form.delivery_address,
      school_id: form.school_id || null,
      payment_method: form.payment_method,
      note: form.note || null,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }),
    [cart, form.delivery_address, form.note, form.payment_method, form.school_id],
  );

  async function finalizeCheckout(extra = {}) {
    const payload = {
      ...checkoutPayload,
      ...extra,
    };

    const result = await submitCheckout(payload);
    clearCart();
    setCart([]);
    setSuccess(result);
    setForm({
      customer_name: user?.name || "",
      delivery_address: "",
      school_id: "",
      payment_method: "cash",
      note: "",
    });
    setStripeIntent(null);
    setStripeError("");
    return result;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your cart is empty. Please add products before validating the order.");
      return;
    }

    setSubmitting(true);

    try {
      await finalizeCheckout();
    } catch (checkoutError) {
      const response = checkoutError?.response?.data;
      const message = response?.message || response?.errors?.items?.[0] || "Unable to validate the order right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart.length && !success) {
    return (
      <div className="checkout-wrapper">
        <section className="checkout-form-section">
          <p style={{ color: "#888", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>Client Area</p>
          <h2>Checkout.</h2>
          <div className="cart-empty-state">
            <h3>Your cart is empty.</h3>
            <p>Go back to the catalog and add products before validating your order.</p>
            <Link to="/products" className="btn-elegant" style={{ display: "inline-flex", width: "auto" }}>
              Browse products
            </Link>
          </div>
        </section>
        <aside className="summary-card">
          <h3 style={{ fontFamily: "Fraunces", marginBottom: "20px" }}>Order Summary</h3>
          <p style={{ color: "#888" }}>No items in cart.</p>
        </aside>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-wrapper">
        <section className="checkout-form-section">
          <p style={{ color: "#888", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>Client Area</p>
          <h2>Checkout.</h2>
          <div className="checkout-success">
            <h3>Your order has been validated.</h3>
            <p>Reference: {successReference}</p>
            <p>Total: {formatDh(success.summary?.total || 0)}</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
              <button className="btn-elegant" type="button" onClick={() => navigate("/products")} style={{ width: "auto" }}>
                Continue shopping
              </button>
              <button className="btn-wishlist" type="button" onClick={() => setSuccess(null)}>
                New checkout
              </button>
            </div>
          </div>
        </section>
        <aside className="summary-card">
          <h3 style={{ fontFamily: "Fraunces", marginBottom: "20px" }}>Validated Order</h3>
          <div className="summary-row">
            <span style={{ color: "#888" }}>Items</span>
            <span>{success.summary?.item_count || 0}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span style={{ fontFamily: "Fraunces" }}>{formatDh(success.summary?.total || 0)}</span>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <section className="checkout-form-section">
        <p style={{ color: "#888", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>Client Area</p>
        <h2>Checkout.</h2>

        <form onSubmit={form.payment_method === "stripe" ? (event) => event.preventDefault() : handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Cardholder Name</label>
            <input
              type="text"
              id="name"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              placeholder="Enter cardholder name"
              autoComplete="name"
              required
            />
            <p className="checkout-field-hint">This name will be used for billing and card verification.</p>
          </div>

          <div className="form-group">
            <label htmlFor="delivery_address">Delivery Address</label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              placeholder="Enter delivery address"
              autoComplete="street-address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="school_id">Associated School (Optional)</label>
            <select id="school_id" name="school_id" value={form.school_id} onChange={handleChange}>
              <option value="">No school selected</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-method-grid" role="radiogroup" aria-label="Payment method">
              <label className={`payment-method-card ${form.payment_method === "cash" ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="cash"
                  checked={form.payment_method === "cash"}
                  onChange={handleChange}
                />
                <span>
                  <strong>Cash</strong>
                  <small>Pay on delivery or in store.</small>
                </span>
              </label>
              <label className={`payment-method-card ${form.payment_method === "stripe" ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="stripe"
                  checked={form.payment_method === "stripe"}
                  onChange={handleChange}
                />
                <span>
                  <strong>Card / Stripe</strong>
                  <small>Enter your bank card details securely.</small>
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Order Note</label>
            <textarea
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Optional note for the order"
              rows="4"
            />
          </div>

          {error ? (
            <div className="checkout-error" role="alert" aria-live="polite">
              {error}
            </div>
          ) : null}
          {stripeError ? (
            <div className="checkout-error" role="alert" aria-live="polite">
              {stripeError}
            </div>
          ) : null}

          {form.payment_method !== "stripe" ? (
            <button className="btn-elegant" type="submit" disabled={submitting} style={{ width: "100%", marginTop: "20px" }}>
              {submitting ? "Validating order..." : "Complete Checkout"}
            </button>
          ) : stripeLoading ? (
            <button className="btn-elegant" type="button" disabled style={{ width: "100%", marginTop: "20px" }}>
              Preparing secure payment...
            </button>
          ) : stripeIntent && stripePromise ? (
            <div style={{ marginTop: "20px" }}>
              <Elements
                key={stripeIntent.payment_intent_id}
                stripe={stripePromise}
                options={{
                  clientSecret: stripeIntent.client_secret,
                  appearance: stripeAppearance,
                }}
              >
                <StripePaymentForm
                  totals={totals}
                  amountLabel={formatDh(stripeIntent.amount || totals.total)}
                  billingName={form.customer_name}
                  clientSecret={stripeIntent.client_secret}
                  onBack={() => setForm((current) => ({ ...current, payment_method: "cash" }))}
                  onConfirmCheckout={async (paymentIntent) => {
                    try {
                      await finalizeCheckout({
                        payment_method: "stripe",
                        stripe_payment_intent_id: paymentIntent.id,
                        stripe_payment_status: paymentIntent.status,
                      });
                    } catch (checkoutError) {
                      const response = checkoutError?.response?.data;
                      const message =
                        response?.message || response?.errors?.items?.[0] || "Unable to validate the order right now.";
                      setError(message);
                    }
                  }}
                />
              </Elements>
            </div>
          ) : null}
        </form>
      </section>

      <aside className="summary-card">
        <h3 style={{ fontFamily: "Fraunces", marginBottom: "20px" }}>Order Summary</h3>

        <div className="checkout-items">
          {cart.map((item) => (
            <div className="checkout-item-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.quantity} x {formatDh(item.price)}
                </span>
              </div>
              <strong>{formatDh(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <div className="summary-row">
          <span style={{ color: "#888" }}>Subtotal ({totals.itemCount} items)</span>
          <span>{formatDh(totals.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span style={{ color: "#888" }}>Shipping</span>
          <span style={{ color: "#2ecc71", fontWeight: "600" }}>Free</span>
        </div>
        <div className="summary-row">
          <span style={{ color: "#888" }}>Tax (0%)</span>
          <span>0.00 DH</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span style={{ fontFamily: "Fraunces" }}>{formatDh(totals.total)}</span>
        </div>

        <p style={{ fontSize: "11px", color: "#bbb", marginTop: "20px", textAlign: "center" }}>
          By completing this checkout, you agree to Library BOUGDIM's terms of service.
        </p>
      </aside>
    </div>
  );
}

export default Checkout;
