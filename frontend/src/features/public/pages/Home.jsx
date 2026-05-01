import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/shared/services/productService";
import { getCategories } from "@/shared/services/categoryService";
import { getSitePreferences } from "@/shared/services/sitePreferencesService";
import { useUiPreferences } from "@/shared/context/UIContext";
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
      <strong>{product?.name || fallbackLabel}</strong>
    </div>
  );
}

function Home() {
  const { t } = useUiPreferences();
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
            <span className="eyebrow-label">{t("common.brandName")}</span>
            <h1>{t("home.heroTitle")}</h1>
            <p>{t("home.heroDescription")}</p>

            <div className="home-hero-actions">
              <Link to="/products" className="home-btn home-btn-primary">
                {t("home.browseProducts")}
              </Link>
              <Link to="/categories" className="home-btn home-btn-secondary">
                {t("home.viewCategories")}
              </Link>
              <Link to="/special-order" className="home-btn home-btn-secondary">
                {t("home.specialOrder")}
              </Link>
            </div>

            {hasCatalogueData ? (
              <div className="home-desk-metrics">
                <div>
                  <strong>{activeProductsCount}</strong>
                  <span>{t("home.activeProducts")}</span>
                </div>
                <div>
                  <strong>{categories.length}</strong>
                  <span>{t("home.categories")}</span>
                </div>
                <div>
                  <strong>{discountedProductsCount}</strong>
                  <span>{t("home.discounts")}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="home-desk-board" aria-label={t("home.cataloguePreview")}>
            <div className="home-desk-feature">
              <div className="home-desk-product-image">
                <ProductVisual product={heroProduct} fallbackLabel={t("home.featuredProduct")} />
              </div>
              <div className="home-desk-product-copy">
                <span>{t("home.featuredItem")}</span>
                <h3>{heroProduct?.name || t("home.catalogueEssentials")}</h3>
                <p>{heroProduct ? formatMoney(heroProduct.price) : t("home.booksToolsMore")}</p>
              </div>
            </div>

            <div className="home-desk-side">
              <div className="home-desk-note">
                <span>{t("home.topCategory")}</span>
                <strong>{heroCategory?.name || t("home.schoolCatalogue")}</strong>
              </div>
              <div className="home-desk-note home-desk-note-accent">
                <span>{t("home.averageDiscount")}</span>
                <strong>{hasCatalogueData ? `${averageDiscount}%` : t("home.offers")}</strong>
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
            <h3>{t("home.fastDelivery")}</h3>
            <p>{t("home.fastDeliveryDescription")}</p>
          </article>
          <article className="home-feature-card">
            <span>02</span>
            <h3>{t("home.specialOrders")}</h3>
            <p>{t("home.specialOrdersDescription")}</p>
          </article>
          <article className="home-feature-card">
            <span>03</span>
            <h3>{t("home.securePayment")}</h3>
            <p>{t("home.securePaymentDescription")}</p>
          </article>
          <article className="home-feature-card">
            <span>04</span>
            <h3>{t("home.schoolPartners")}</h3>
            <p>{t("home.schoolPartnersDescription")}</p>
          </article>
        </section>
      ) : null}

      {sections.discountBanner ? (
        <section className="home-promo-strip">
          <div>
            <span className="eyebrow-label">{t("home.currentOffer")}</span>
            <h2>{t("home.saveMoreTitle")}</h2>
            <p>{t("home.saveMoreDescription")}</p>
          </div>
          <Link to="/products?status=active" className="home-btn home-btn-dark">
            {t("home.shopOffers")}
          </Link>
        </section>
      ) : null}

      {sections.featuredEssentials ? (
        <section className="home-section-block">
          <div className="home-section-head">
            <div>
              <span className="eyebrow-label">{t("home.featuredSelection")}</span>
              <h2>{t("home.featuredEssentials")}</h2>
            </div>
            <Link to="/products" className="landing-section-link">
              {t("home.viewAllProducts")}
            </Link>
          </div>

          <div className="home-product-grid home-product-grid-featured">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
                className="home-product-card"
                aria-label={t("home.openProduct", { name: product.name })}
              >
                <div className="home-product-media">
                  <ProductVisual product={product} fallbackLabel={t("public.noImage")} />
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
              <span className="eyebrow-label">{t("home.fullShelf")}</span>
              <h2>{t("home.shopMoreEssentials")}</h2>
            </div>
            <Link to="/products" className="landing-section-link">
              {t("home.openFullCatalogue")}
            </Link>
          </div>

          <div className="home-catalogue-wall-grid">
            {landingProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
                className="home-shelf-product"
                aria-label={t("home.openProduct", { name: product.name })}
              >
                <div className="home-shelf-thumb">
                  <ProductVisual product={product} fallbackLabel={t("home.item")} />
                </div>
                <div className="home-shelf-body">
                  <span>{product.category?.name || t("home.schoolItem")}</span>
                  <h4>{product.name}</h4>
                  <div>
                    <strong>{formatMoney(product.price)}</strong>
                    {Number(product.discount || 0) > 0 ? <em>{t("home.percentOff", { count: product.discount })}</em> : null}
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
              <span className="eyebrow-label">{t("home.bestSellers")}</span>
              <h2>{t("home.mostRequestedProducts")}</h2>
            </div>
            <Link to="/products?sort=best-sellers" className="landing-section-link">
              {t("home.seePopularItems")}
            </Link>
          </div>

          <div className="home-product-grid home-product-grid-best">
            {bestSellerProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product-detail?productId=${product.id}`}
                className="home-product-card"
                aria-label={t("home.openProduct", { name: product.name })}
              >
                <div className="home-product-media">
                  <ProductVisual product={product} fallbackLabel={t("public.noImage")} />
                </div>
                <div className="home-product-body">
                  <h4>{product.name}</h4>
                  <p>{formatMoney(product.price)}</p>
                  <span className="home-product-meta">{t("home.ordersCount", { count: product.order_items_count || 0 })}</span>
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
              <span className="eyebrow-label">{t("home.categories")}</span>
              <h2>{t("home.browseByCategory")}</h2>
            </div>
            <Link to="/categories" className="landing-section-link">
              {t("home.openCategories")}
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
                <strong>{t("home.itemsCount", { count: category.products_count || 0 })}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {sections.brandStory ? (
        <section className="home-story-grid">
          <article className="home-story-copy">
            <span className="eyebrow-label">{t("home.aboutStore")}</span>
            <h2>{t("home.builtForSchoolLife")}</h2>
            <p>{t("home.builtForSchoolLifeDescription")}</p>
          </article>
          <article className="home-story-card">
            <span className="eyebrow-label">{t("home.whyItWorks")}</span>
            <ul>
              <li>{t("home.realtimeBrowsing")}</li>
              <li>{t("home.clearStockVisibility")}</li>
              <li>{t("home.specialOrdersMissing")}</li>
              <li>{t("home.mobileFriendlyShopping")}</li>
            </ul>
          </article>
        </section>
      ) : null}

      {sections.schoolPartners ? (
        <section className="home-partner-grid">
          <article className="home-partner-copy">
            <span className="eyebrow-label">{t("home.schoolPartnersLabel")}</span>
            <h2>{t("home.cleanerSupplyWorkflow")}</h2>
            <p>{t("home.cleanerSupplyWorkflowDescription")}</p>
          </article>
          <div className="home-partner-pills">
            <span>{t("home.schoolLists")}</span>
            <span>{t("home.bulkOrders")}</span>
            <span>{t("home.specialRequests")}</span>
            <span>{t("home.fastInvoicing")}</span>
          </div>
        </section>
      ) : null}

      {sections.callToAction ? (
        <section className="home-cta-grid">
          <div>
            <span className="eyebrow-label">{t("home.customOrder")}</span>
            <h2>{t("home.customOrderTitle")}</h2>
            <p>{t("home.customOrderDescription")}</p>
          </div>
          <Link to="/special-order" className="home-btn home-btn-primary">
            {t("home.startSpecialOrder")}
          </Link>
        </section>
      ) : null}
    </div>
  );
}

export default Home;
