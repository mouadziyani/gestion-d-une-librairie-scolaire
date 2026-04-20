import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "../../services/categoryService";

function Categories() {
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
          setError("We could not load the categories right now.");
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
  }, []);

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
          <p className="categories-eyebrow">Library collection</p>
          <h1>Explore every category available in the shop.</h1>
          <p>
            Browse the full catalog of books, supplies, and school essentials. Guests and clients can use this page to
            discover what is available before jumping into products.
          </p>
          <Link to="/products" className="btn-elegant categories-primary-action">
            Browse products
          </Link>
        </div>

        <div className="categories-stats">
          <div className="categories-stat-card">
            <span>Total categories</span>
            <strong>{stats.totalCategories}</strong>
          </div>
          <div className="categories-stat-card">
            <span>Total products</span>
            <strong>{stats.totalProducts}</strong>
          </div>
          <div className="categories-stat-card">
            <span>Empty categories</span>
            <strong>{stats.emptyCategories}</strong>
          </div>
        </div>
      </section>

      <section className="categories-grid-section">
        <div className="categories-section-heading">
          <div>
            <p className="categories-eyebrow">Available sections</p>
            <h2>Every category in one place.</h2>
          </div>
          <Link to="/products" className="categories-inline-link">
            View all products <ArrowRight size={16} />
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
                    <p className="category-card-tag">{category.slug || "category"}</p>
                    <span className="category-card-count">{Number(category.products_count || 0)}</span>
                  </div>

                  <div>
                    <h3>{category.name}</h3>
                    <p className="category-card-text">
                      {Number(category.products_count || 0) > 0
                        ? "Products are already available in this category."
                        : "This category is ready for future products."}
                    </p>
                  </div>

                  <Link to={`/products?category=${encodeURIComponent(slug)}`} className="category-card-link">
                    Browse products <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="categories-empty">{loading ? null : "No categories found."}</div>
        )}
      </section>
    </div>
  );
}

export default Categories;
