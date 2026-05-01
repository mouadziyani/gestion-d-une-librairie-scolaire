import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/features/auth/authContext";
import { clearCart, getCartItems, getCartTotals, syncCartWithProducts } from "@/features/client/services/cartService";
import { submitCheckout } from "@/shared/services/orderService";
import { createStripePaymentIntent } from "@/shared/services/stripeService";
import { api } from "@/shared/services/api";
import { formatDh } from "@/data/catalog";
import { useUiPreferences } from "@/shared/context/UIContext";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePublishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.STRIPE_PUBLISHABLE_KEY ||
  "";

function buildStripeAppearance() {
  return {
    theme: "stripe",
    variables: {
      colorPrimary: "#5b2501",
      colorBackground: "#fcfcfc",
      colorText: "#1a1a1a",
      colorDanger: "#c53030",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      borderRadius: "10px",
      spacingUnit: "4px",
    },
  };
}

function StripePaymentForm({ onConfirmCheckout, onBack, totals, amountLabel, billingName, clientSecret }) {
  const { t } = useUiPreferences();
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
      setError(t("checkout.stripeLoading"));
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement || !paymentComplete) {
      setError(t("checkout.completeCardDetails"));
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
        setError(result.error.message || t("checkout.stripePaymentFailed"));
        return;
      }

      if (!result.paymentIntent) {
        setError(t("checkout.stripePaymentUnconfirmed"));
        return;
      }

      await onConfirmCheckout(result.paymentIntent);
    } catch (submitError) {
      setError(submitError?.message || t("checkout.stripePaymentFailed"));
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="stripe-payment-panel">
      <div className="checkout-copy-block">
        <h3 className="checkout-section-title">{t("checkout.payWithCard")}</h3>
        <p className="checkout-copy-text">{t("checkout.securePaymentFor", { amount: amountLabel })}</p>
        <p className="checkout-copy-note">{t("checkout.stripeTestHint")}</p>
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
          <div className="checkout-field-hint checkout-field-spacing" role="status" aria-live="polite">
            {fieldError}
          </div>
        ) : (
          <div className="checkout-field-hint checkout-field-spacing">
            {t("checkout.stripeTestCardHint")}
          </div>
        )}

        {error ? (
          <div className="checkout-error checkout-error-spacing" role="alert" aria-live="polite">
            {error}
          </div>
        ) : null}

        <div className="stripe-actions">
          <button type="button" className="btn-wishlist" onClick={onBack}>
            {t("checkout.backToPaymentMethods")}
          </button>
          <button type="submit" className="btn-elegant" disabled={!stripe || !elements || paying || !paymentComplete}>
            {paying ? t("checkout.processingPayment") : t("checkout.payAmount", { amount: formatDh(totals.total) })}
          </button>
        </div>
      </form>
    </div>
  );
}

function Checkout() {
  const { t } = useUiPreferences();
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
    let active = true;

    async function refreshCart() {
      setCart(getCartItems());

      try {
        const syncedCart = await syncCartWithProducts();
        if (active) {
          setCart(syncedCart);
        }
      } catch {
        if (active) {
          setCart(getCartItems());
        }
      }
    }

    refreshCart();

    return () => {
      active = false;
    };
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
        setStripeError(t("checkout.addProductsBeforeCard"));
        setStripeLoading(false);
        return;
      }

      if (!stripePublishableKey) {
        setStripeIntent(null);
        setStripeError(t("checkout.stripeNotConfigured"));
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
          setStripeError(intentError?.response?.data?.message || t("checkout.stripeInitFailed"));
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
  }, [cart, form.payment_method, form.school_id, stripePromise, t]);

  const totals = useMemo(() => getCartTotals(cart), [cart]);
  const successReference = success?.payment?.reference || (success?.order?.id ? `ORD-${success.order.id}` : t("checkout.validatedFallback"));

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
      setError(t("checkout.emptyCartError"));
      return;
    }

    setSubmitting(true);

    try {
      await finalizeCheckout();
    } catch (checkoutError) {
      const response = checkoutError?.response?.data;
      const message = response?.message || response?.errors?.items?.[0] || t("checkout.validateFailed");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart.length && !success) {
    return (
      <div className="checkout-wrapper">
        <section className="checkout-form-section">
          <p className="checkout-eyebrow">{t("checkout.clientArea")}</p>
          <h2>{t("checkout.title")}</h2>
          <div className="cart-empty-state">
            <h3>{t("checkout.emptyTitle")}</h3>
            <p>{t("checkout.emptyDescription")}</p>
            <Link to="/products" className="btn-elegant" style={{ display: "inline-flex", width: "auto" }}>
              {t("checkout.browseProducts")}
            </Link>
          </div>
        </section>
        <aside className="summary-card">
          <h3 className="checkout-section-title">{t("checkout.orderSummary")}</h3>
          <p className="checkout-muted-text">{t("checkout.noItems")}</p>
        </aside>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-wrapper">
        <section className="checkout-form-section">
          <p className="checkout-eyebrow">{t("checkout.clientArea")}</p>
          <h2>{t("checkout.title")}</h2>
          <div className="checkout-success">
            <h3>{t("checkout.successTitle")}</h3>
            <p>{t("checkout.reference")}: {successReference}</p>
            <p>{t("checkout.total")}: {formatDh(success.summary?.total || 0)}</p>
            <div className="checkout-success-actions">
              <button className="btn-elegant" type="button" onClick={() => navigate("/products")} style={{ width: "auto" }}>
                {t("checkout.continueShopping")}
              </button>
              <button className="btn-wishlist" type="button" onClick={() => setSuccess(null)}>
                {t("checkout.newCheckout")}
              </button>
            </div>
          </div>
        </section>
        <aside className="summary-card">
          <h3 className="checkout-section-title">{t("checkout.validatedOrder")}</h3>
          <div className="summary-row">
            <span className="checkout-muted-text">{t("checkout.items")}</span>
            <span>{success.summary?.item_count || 0}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span className="checkout-total-amount">{formatDh(success.summary?.total || 0)}</span>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <section className="checkout-form-section">
        <p className="checkout-eyebrow">{t("checkout.clientArea")}</p>
        <h2>{t("checkout.title")}</h2>

        <form onSubmit={form.payment_method === "stripe" ? (event) => event.preventDefault() : handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t("checkout.cardholderName")}</label>
            <input
              type="text"
              id="name"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              placeholder={t("checkout.cardholderPlaceholder")}
              autoComplete="name"
              required
            />
            <p className="checkout-field-hint">{t("checkout.cardholderHint")}</p>
          </div>

          <div className="form-group">
            <label htmlFor="delivery_address">{t("checkout.deliveryAddress")}</label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              placeholder={t("checkout.deliveryAddressPlaceholder")}
              autoComplete="street-address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="school_id">{t("checkout.associatedSchoolOptional")}</label>
            <select id="school_id" name="school_id" value={form.school_id} onChange={handleChange}>
              <option value="">{t("checkout.noSchoolSelected")}</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("checkout.paymentMethod")}</label>
            <div className="payment-method-grid" role="radiogroup" aria-label={t("checkout.paymentMethod")}>
              <label className={`payment-method-card ${form.payment_method === "cash" ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="cash"
                  checked={form.payment_method === "cash"}
                  onChange={handleChange}
                />
                <span>
                  <strong>{t("checkout.cash")}</strong>
                  <small>{t("checkout.cashHint")}</small>
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
                  <strong>{t("checkout.cardStripe")}</strong>
                  <small>{t("checkout.cardStripeHint")}</small>
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">{t("checkout.orderNote")}</label>
            <textarea
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder={t("checkout.orderNotePlaceholder")}
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
            <button className="btn-elegant checkout-submit-button" type="submit" disabled={submitting}>
              {submitting ? t("checkout.validatingOrder") : t("checkout.completeCheckout")}
            </button>
          ) : stripeLoading ? (
            <button className="btn-elegant checkout-submit-button" type="button" disabled>
              {t("checkout.preparingSecurePayment")}
            </button>
          ) : stripeIntent && stripePromise ? (
            <div className="checkout-stripe-shell">
              <Elements
                key={stripeIntent.payment_intent_id}
                stripe={stripePromise}
                options={{
                  clientSecret: stripeIntent.client_secret,
                  appearance: buildStripeAppearance(),
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
                        response?.message || response?.errors?.items?.[0] || t("checkout.validateFailed");
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
        <h3 className="checkout-section-title">{t("checkout.orderSummary")}</h3>

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
          <span className="checkout-muted-text">{t("checkout.subtotalItems", { count: totals.itemCount })}</span>
          <span>{formatDh(totals.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span className="checkout-muted-text">{t("checkout.shipping")}</span>
          <span className="checkout-success-text">{t("cartPage.free")}</span>
        </div>
        <div className="summary-row">
          <span className="checkout-muted-text">{t("checkout.taxZero")}</span>
          <span>0.00 DH</span>
        </div>

        <div className="summary-total">
          <span>{t("checkout.total")}</span>
          <span className="checkout-total-amount">{formatDh(totals.total)}</span>
        </div>

        <p className="checkout-terms-note">
          {t("checkout.termsNote")}
        </p>
      </aside>
    </div>
  );
}

export default Checkout;
