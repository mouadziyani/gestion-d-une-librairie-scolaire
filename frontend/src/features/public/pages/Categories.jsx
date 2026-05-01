import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/shared/services/categoryService";
import { useUiPreferences } from "@/shared/context/UIContext";

function Categories() {
  const { t } = useUiPreferences();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }

        setCategories(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (active) {
          setCategories([]);
          setError(t("public.failedLoadCategoriesPublic"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, [t]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, category) => sum + Number(category.products_count || 0), 0);
    const emptyCategories = categories.filter((category) => Number(category.products_count || 0) === 0).length;

    return { totalCategories, totalProducts, emptyCategories };
  }, [categories]);

  return (
    <div className="categories-page">
      <section className="categories-hero">
        <div className="categories-hero-copy">
          <p className="categories-eyebrow">{t("public.categoriesEyebrow")}</p>
          <h1>{t("public.categoriesTitle")}</h1>
          <p>{t("public.categoriesDescription")}</p>
          <Link to="/products" className="btn-elegant categories-primary-action">
            {t("public.browseProducts")}
          </Link>
        </div>

        <div className="categories-stats">
          <div className="categories-stat-card">
            <span>{t("public.totalCategories")}</span>
            <strong>{stats.totalCategories}</strong>
          </div>
          <div className="categories-stat-card">
            <span>{t("public.totalProducts")}</span>
            <strong>{stats.totalProducts}</strong>
          </div>
          <div className="categories-stat-card">
            <span>{t("public.emptyCategories")}</span>
            <strong>{stats.emptyCategories}</strong>
          </div>
        </div>
      </section>

      <section className="categories-grid-section">
        <div className="categories-section-heading">
          <div>
            <p className="categories-eyebrow">{t("public.availableSections")}</p>
            <h2>{t("public.everyCategoryInOnePlace")}</h2>
          </div>
          <Link to="/products" className="categories-inline-link">
            {t("public.viewAllProducts")} <ArrowRight size={16} />
          </Link>
        </div>

        {error ? (
          <div className="categories-empty">{error}</div>
        ) : categories.length ? (
          <div className="categories-grid">
            {categories.map((category) => {
              const slug = category.slug || category.name || category.id;

              return (
                <article className="category-card" key={category.id}>
                  <div className="category-card-top">
                    <p className="category-card-tag">{category.slug || t("public.category")}</p>
                    <span className="category-card-count">{Number(category.products_count || 0)}</span>
                  </div>

                  <div>
                    <h3>{category.name}</h3>
                    <p className="category-card-text">
                      {Number(category.products_count || 0) > 0
                        ? t("public.productsAvailableInCategory")
                        : t("public.categoryReadyForFuture")}
                    </p>
                  </div>

                  <Link to={`/products?category=${encodeURIComponent(slug)}`} className="category-card-link">
                    {t("public.browseProducts")} <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="categories-empty">{loading ? null : t("public.noCategoriesFound")}</div>
        )}
      </section>
    </div>
  );
}

export default Categories;
