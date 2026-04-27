import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/shared/services/productService";
import { getCategories } from "@/shared/services/categoryService";
import { getSitePreferences } from "@/shared/services/sitePreferencesService";
import { resolveMediaUrl } from "@/shared/utils/common/media";

const HOME_CACHE_KEY = "bougdim_home_catalogue";

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function readHomeCache() {
  if (typeof window === "undefined") {
    return { products: [], categories: [], activeProductsTotal: 0 };
  }

  try {
    const cached = JSON.parse(window.localStorage.getItem(HOME_CACHE_KEY) || "{}");
    return {
      products: Array.isArray(cached.products) ? cached.products : [],
      categories: Array.isArray(cached.categories) ? cached.categories : [],
      activeProductsTotal: Number(cached.activeProductsTotal || 0),
    };
  } catch {
    return { products: [], categories: [], activeProductsTotal: 0 };
  }
}

function writeHomeCache(payload) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(payload));
  }
}

function ProductVisual({ product, fallbackLabel }) {
  const imageUrl = resolveMediaUrl(product?.image_url || product?.image || product?.img);

  if (imageUrl) {
    return <img src={imageUrl} alt={product?.name || fallbackLabel} />;
  }

  return (
    <div className="home-visual-placeholder">
      <span>{fallbackLabel}</span>
      <strong>{product?.name || "Catalogue"}</strong>
    </div>
  );
}

function Home() {
  const [catalogue, setCatalogue] = useState(() => readHomeCache());
  const [preferences, setPreferences] = useState(() => getSitePreferences());
  const sections = preferences.landingSections || {};
  const products = catalogue.products;
  const categories = catalogue.categories;
  const activeProductsTotal = catalogue.activeProductsTotal;

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
        const [productData, categoryData] = await Promise.all([
          getProducts({ page: 1, per_page: 24, status: "available", sort: "discount" }),
          getCategories(),
        ]);
        if (!active) {
          return;
        }

        const liveProducts = Array.isArray(productData?.data) ? productData.data : [];
        const liveCategories = Array.isArray(categoryData) ? categoryData : [];

        const nextCatalogue = {
          products: liveProducts,
          categories: liveCategories,
          activeProductsTotal: Number(productData?.total || liveProducts.length),
        };

        setCatalogue(nextCatalogue);
        writeHomeCache(nextCatalogue);
      } catch {
        // Keep the last successful catalogue visible if the API is still waking up.
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

  const landingProducts = useMemo(
    () =>
      [...activeProducts]
        .sort((a, b) => {
          const discountDelta = Number(b.discount || 0) - Number(a.discount || 0);
          return discountDelta || Number(b.stock || 0) - Number(a.stock || 0);
        })
        .slice(0, 16),
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
  const hasCatalogueData = products.length > 0 || categories.length > 0;
  const activeProductsCount = activeProductsTotal || activeProducts.length;
  const discountedProductsCount = products.filter((product) => Number(product.discount || 0) > 0).length;
  const averageDiscount = products.length
    ? Math.round(products.reduce((sum, product) => sum + Number(product.discount || 0), 0) / products.length)
    : 0;

  return (
    <div className="home-wrapper home-landing-page">
      {sections.hero ? (
        <section className="home-hero-grid home-desk-hero">
          <div className="home-hero-copy home-desk-copy">
            <span className="eyebrow-label">Librairie BOUGDIM</span>
            <h1>School supplies, sorted like a clean desk.</h1>
            <p>
              Pick textbooks, notebooks, writing tools, and custom requests from a catalogue designed
              for quick school shopping.
            </p>

            <div className="home-hero-actions">
              <Link to="/products" className="home-btn home-btn-primary">
                Browse products
              </Link>
              <Link to="/categories" className="home-btn home-btn-secondary">
                View categories
              </Link>
              <Link to="/special-order" className="home-btn home-btn-secondary">
                Special order
              </Link>
            </div>

            {hasCatalogueData ? (
              <div className="home-desk-metrics">
                <div>
                  <strong>{activeProductsCount}</strong>
                  <span>active products</span>
                </div>
                <div>
                  <strong>{categories.length}</strong>
                  <span>categories</span>
                </div>
                <div>
                  <strong>{discountedProductsCount}</strong>
                  <span>discounts</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="home-desk-board" aria-label="Catalogue preview">
            <div className="home-desk-feature">
              <div className="home-desk-product-image">
                <ProductVisual product={heroProduct} fallbackLabel="Featured product" />
              </div>
              <div className="home-desk-product-copy">
                <span>Featured item</span>
                <h3>{heroProduct?.name || "Catalogue essentials"}</h3>
                <p>{heroProduct ? formatMoney(heroProduct.price) : "Books, tools, bags, and more"}</p>
              </div>
            </div>

            <div className="home-desk-side">
              <div className="home-desk-note">
                <span>Top category</span>
                <strong>{heroCategory?.name || "School catalogue"}</strong>
              </div>
              <div className="home-desk-note home-desk-note-accent">
                <span>Average discount</span>
                <strong>{hasCatalogueData ? `${averageDiscount}%` : "Offers"}</strong>
              </div>
              <div className="home-desk-category-list">
                {highlightedCategories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${encodeURIComponent(category.slug || category.name || category.id)}`}
                  >
                    <span>{category.name}</span>
                    <strong>{category.products_count || 0}</strong>
                  </Link>
                ))}
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
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
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

      {sections.featuredEssentials ? (
        <section className="home-catalogue-wall">
          <div className="home-section-head">
            <div>
              <span className="eyebrow-label">Full shelf</span>
              <h2>Shop more school essentials</h2>
            </div>
            <Link to="/products" className="landing-section-link">
              Open full catalogue
            </Link>
          </div>

          <div className="home-catalogue-wall-grid">
            {landingProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
                className="home-shelf-product"
                aria-label={`Open product ${product.name}`}
              >
                <div className="home-shelf-thumb">
                  <ProductVisual product={product} fallbackLabel="Item" />
                </div>
                <div className="home-shelf-body">
                  <span>{product.category?.name || "School item"}</span>
                  <h4>{product.name}</h4>
                  <div>
                    <strong>{formatMoney(product.price)}</strong>
                    {Number(product.discount || 0) > 0 ? <em>{product.discount}% off</em> : null}
                  </div>
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
            {bestSellerProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
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
