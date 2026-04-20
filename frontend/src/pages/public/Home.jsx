import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getSitePreferences } from "../../services/sitePreferencesService";
import { resolveMediaUrl } from "../../utils/media";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function ProductVisual({ product, fallbackLabel }) {
  const imageUrl = resolveMediaUrl(product?.image);

  if (imageUrl) {
    return <img src={imageUrl} alt={product?.name || fallbackLabel} />;
  }

  return (
    <div className="home-visual-placeholder">
      <span>{fallbackLabel}</span>
      <strong>{product?.name || "No image available"}</strong>
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(() => getSitePreferences());
  const sections = preferences.landingSections || {};

  useEffect(() => {
    function handlePreferencesChange() {
      setPreferences(getSitePreferences());
    }

    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [productData, categoryData] = await Promise.all([getProducts(), getCategories()]);
        if (!active) {
          return;
        }

        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "active" && Number(product.is_available) !== 0),
    [products],
  );

  const featuredProducts = useMemo(
    () =>
      [...activeProducts]
        .sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0))
        .slice(0, 2),
    [activeProducts],
  );

  const bestSellerProducts = useMemo(
    () =>
      [...activeProducts]
        .sort((a, b) => Number(b.order_items_count || 0) - Number(a.order_items_count || 0))
        .slice(0, 4),
    [activeProducts],
  );

  const highlightedCategories = useMemo(
    () =>
      [...categories]
        .sort((a, b) => Number(b.products_count || 0) - Number(a.products_count || 0))
        .slice(0, 4),
    [categories],
  );

  const heroProduct = featuredProducts[0] || bestSellerProducts[0] || activeProducts[0] || null;
  const heroCategory = highlightedCategories[0] || null;
  const activeProductsCount = activeProducts.length;
  const discountedProductsCount = products.filter((product) => Number(product.discount || 0) > 0).length;
  const averageDiscount = products.length
    ? Math.round(products.reduce((sum, product) => sum + Number(product.discount || 0), 0) / products.length)
    : 0;

  return (
    <div className="home-wrapper home-landing-page">
      {sections.hero ? (
        <section className="home-hero-grid">
          <div className="home-hero-copy">
            <span className="eyebrow-label">Librairie BOUGDIM 2026</span>
            <h1>Everything a school needs, in one calm place.</h1>
            <p>
              Browse books, stationery, and special orders through a clear experience built for parents,
              students, and schools.
            </p>

            <div className="home-hero-actions">
              <Link to="/products" className="home-btn home-btn-primary">
                Browse Collection
              </Link>
              <Link to="/special-order" className="home-btn home-btn-secondary">
                Special Order
              </Link>
            </div>

            <div className="home-hero-chips">
              <span>{activeProductsCount} active products</span>
              <span>{categories.length} categories</span>
              <span>{discountedProductsCount} discounted items</span>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-frame">
              <div className="home-hero-frame-top">
                <span className="eyebrow-label">Live snapshot</span>
                <h3>What is trending right now</h3>
              </div>

              <div className="home-hero-image-box">
                <ProductVisual product={heroProduct} fallbackLabel="Featured product" />
              </div>

              <div className="home-hero-meta-grid">
                <div>
                  <span>Featured item</span>
                  <strong>{heroProduct?.name || "Selected school supply"}</strong>
                </div>
                <div>
                  <span>Top category</span>
                  <strong>{heroCategory?.name || "School essentials"}</strong>
                </div>
                <div>
                  <span>Average discount</span>
                  <strong>{averageDiscount}%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {sections.features ? (
        <section className="home-feature-grid">
          <article className="home-feature-card">
            <span>01</span>
            <h3>Fast Delivery</h3>
            <p>Service de livraison rapide pour toutes les ecoles partenaires et les particuliers.</p>
          </article>
          <article className="home-feature-card">
            <span>02</span>
            <h3>Special Orders</h3>
            <p>Passer une commande speciale pour des produits non disponibles en stock.</p>
          </article>
          <article className="home-feature-card">
            <span>03</span>
            <h3>Secure Payment</h3>
            <p>Choisissez entre paiement en ligne securise ou especes a la livraison.</p>
          </article>
          <article className="home-feature-card">
            <span>04</span>
            <h3>School Partners</h3>
            <p>Gestion optimisee des listes scolaires pour nos etablissements partenaires.</p>
          </article>
        </section>
      ) : null}

      {sections.discountBanner ? (
        <section className="home-promo-strip">
          <div>
            <span className="eyebrow-label">Current offer</span>
            <h2>Save more on essential school items.</h2>
            <p>Admin can enable or disable this banner from General Settings.</p>
          </div>
          <Link to="/products?status=active" className="home-btn home-btn-dark">
            Shop offers
          </Link>
        </section>
      ) : null}

      {sections.featuredEssentials ? (
        <section className="home-section-block">
          <div className="home-section-head">
            <div>
              <span className="eyebrow-label">Featured selection</span>
              <h2>Featured Essentials</h2>
            </div>
            <Link to="/products" className="landing-section-link">
              View all products
            </Link>
          </div>

          <div className="home-product-grid home-product-grid-featured">
            {(loading ? [] : featuredProducts).map((product) => (
              <Link
                key={product.id}
                to={`/ProductDetail?productId=${product.id}`}
                className="home-product-card"
                aria-label={`Open product ${product.name}`}
              >
                <div className="home-product-media">
                  <ProductVisual product={product} fallbackLabel="No image" />
                </div>
                <div className="home-product-body">
                  <h4>{product.name}</h4>
                  <p>
                    {formatMoney(product.price)} {Number(product.discount || 0) > 0 ? `- ${product.discount}%` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {sections.bestSellers ? (
        <section className="home-section-block">
          <div className="home-section-head">
            <div>
              <span className="eyebrow-label">Best sellers</span>
              <h2>Most requested products</h2>
            </div>
            <Link to="/products?sort=best-sellers" className="landing-section-link">
              See popular items
            </Link>
          </div>

          <div className="home-product-grid home-product-grid-best">
            {(loading ? [] : bestSellerProducts).map((product) => (
              <Link
                key={product.id}
                to={`/ProductDetail?productId=${product.id}`}
                className="home-product-card"
                aria-label={`Open product ${product.name}`}
              >
                <div className="home-product-media">
                  <ProductVisual product={product} fallbackLabel="No image" />
                </div>
                <div className="home-product-body">
                  <h4>{product.name}</h4>
                  <p>{formatMoney(product.price)}</p>
                  <span className="home-product-meta">{product.order_items_count || 0} orders</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {sections.categoryHighlights ? (
        <section className="home-section-block home-categories-block">
          <div className="home-section-head">
            <div>
              <span className="eyebrow-label">Categories</span>
              <h2>Browse by category</h2>
            </div>
            <Link to="/categories" className="landing-section-link">
              Open categories
            </Link>
          </div>

          <div className="home-category-grid">
            {highlightedCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug || category.name || category.id)}`}
                className="home-category-card"
              >
                <span>{category.name}</span>
                <strong>{category.products_count || 0} items</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {sections.brandStory ? (
        <section className="home-story-grid">
          <article className="home-story-copy">
            <span className="eyebrow-label">About the store</span>
            <h2>Built for school life, from books to delivery.</h2>
            <p>
              Our library platform keeps products, stock, and school orders visible in one place so parents,
              students, and staff can move faster with fewer errors.
            </p>
          </article>
          <article className="home-story-card">
            <span className="eyebrow-label">Why it works</span>
            <ul>
              <li>Real-time product browsing</li>
              <li>Clear stock visibility</li>
              <li>Special orders when items are missing</li>
              <li>Simple mobile-friendly shopping</li>
            </ul>
          </article>
        </section>
      ) : null}

      {sections.schoolPartners ? (
        <section className="home-partner-grid">
          <article className="home-partner-copy">
            <span className="eyebrow-label">School partners</span>
            <h2>Partner schools get a cleaner supply workflow.</h2>
            <p>
              We keep books, supply lists, and special orders aligned so partner schools can update their
              needs without back-and-forth every week.
            </p>
          </article>
          <div className="home-partner-pills">
            <span>School lists</span>
            <span>Bulk orders</span>
            <span>Special requests</span>
            <span>Fast invoicing</span>
          </div>
        </section>
      ) : null}

      {sections.callToAction ? (
        <section className="home-cta-grid">
          <div>
            <span className="eyebrow-label">Need a custom order?</span>
            <h2>Request items that are not in stock and track them from the same account.</h2>
            <p>
              Submit a special order, follow its status, and keep everything linked to the same customer profile.
            </p>
          </div>
          <Link to="/special-order" className="home-btn home-btn-primary">
            Start Special Order
          </Link>
        </section>
      ) : null}
    </div>
  );
}

export default Home;
