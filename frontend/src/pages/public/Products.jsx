import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/library.png";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";
import { resolveMediaUrl } from "../../utils/media";

function getFiltersFromLocation(search) {
  const params = new URLSearchParams(search);
  return {
    search: params.get("search") || "",
    category: (params.get("category") || "all").toLowerCase(),
    status: (params.get("status") || "all").toLowerCase(),
    sort: (params.get("sort") || "featured").toLowerCase(),
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => getFiltersFromLocation(location.search));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setForm(getFiltersFromLocation(location.search));
  }, [location.search]);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([getProducts(page), getCategories()]);
        if (!active) {
          return;
        }

        setProducts(Array.isArray(productData?.data) ? productData.data : []);
        setLastPage(productData?.last_page || 1);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, [page]);

  const normalizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: category.name,
        slug: (category.slug || category.name || "").toLowerCase(),
      })),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    const searchValue = form.search.trim().toLowerCase();
    const categoryValue = form.category.trim().toLowerCase();
    const statusValue = form.status.trim().toLowerCase();

    const result = products.filter((product) => {
      const productCategory = (product.category?.slug || product.category?.name || product.cat || "").toLowerCase();
      const matchesSearch =
        !searchValue ||
        [product.name, product.reference, product.description, product.level, productCategory]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchValue));
      const matchesCategory =
        categoryValue === "all" ||
        productCategory === categoryValue ||
        String(product.category_id || "").toLowerCase() === categoryValue;
      const matchesStatus =
        statusValue === "all" ||
        String(product.status || "").toLowerCase() === statusValue ||
        (statusValue === "available" && Number(product.is_available) !== 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (form.sort === "price-asc") {
      return result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (form.sort === "price-desc") {
      return result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (form.sort === "best-sellers") {
      return result.sort((a, b) => Number(b.order_items_count || 0) - Number(a.order_items_count || 0));
    }

    if (form.sort === "discount") {
      return result.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
    }

    return result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  }, [products, form.category, form.search, form.sort, form.status]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateQuery(nextForm) {
    const params = new URLSearchParams();

    if (nextForm.search.trim()) params.set("search", nextForm.search.trim());
    if (nextForm.category !== "all") params.set("category", nextForm.category);
    if (nextForm.status !== "all") params.set("status", nextForm.status);
    if (nextForm.sort !== "featured") params.set("sort", nextForm.sort);

    const queryString = params.toString();
    navigate(queryString ? `/products?${queryString}` : "/products");
  }

  function handleApplyFilters(event) {
    event.preventDefault();
    updateQuery(form);
  }

  function handleReset() {
    const next = { search: "", category: "all", status: "all", sort: "featured" };
    setForm(next);
    navigate("/products");
  }

  return (
    <div className="products-wrapper">
      <section className="search-filter-section">
        <div className="products-hero-header">
          <img src={logo} alt="Library BOUGDIM" className="products-hero-logo" />
          <div>
            <p className="products-eyebrow">Library shop</p>
            <h1>Browse school essentials.</h1>
            <p className="products-subtitle">
              Search by name, reference, category, status, discount, or best sellers.
            </p>
          </div>
        </div>

        <form className="products-filter-form" onSubmit={handleApplyFilters}>
          <div className="search-box">
            <input
              type="text"
              name="search"
              value={form.search}
              onChange={handleChange}
              placeholder="Find by name, reference, or category..."
            />
          </div>

          <div className="filter-row products-filter-row">
            <select className="custom-select" name="category" value={form.category} onChange={handleChange}>
              <option value="all">All Categories</option>
              {normalizedCategories.map((category) => (
                <option key={category.value} value={category.slug || category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select className="custom-select" name="status" value={form.status} onChange={handleChange}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="inactive">Inactive</option>
            </select>

            <select className="custom-select" name="sort" value={form.sort} onChange={handleChange}>
              <option value="featured">Featured</option>
              <option value="best-sellers">Best Sellers</option>
              <option value="discount">Discount</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <button className="btn-elegant" style={{ padding: "10px 25px", fontSize: "12px" }} type="submit">
              Apply Filters
            </button>

            <button className="btn-base btn-outline" style={{ padding: "10px 18px" }} type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="products-list-area">
        {error ? <p className="form-alert form-alert-error">{error}</p> : null}
        {!loading ? (
          <>
            <div className="products-grid">
              {filteredProducts.length ? (
                filteredProducts.map((product) => {
                  const isAvailable = product.status === "active" && Number(product.is_available) !== 0;
                  const categoryLabel = product.category?.name || product.cat || "-";
                  const imageSrc = resolveMediaUrl(product.image) || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500";

                  return (
                    <Link to={`/ProductDetail?productId=${product.id}`} className="product-item" key={product.id}>
                      <div className="product-img-holder">
                        <img src={imageSrc} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <span className="product-category">{categoryLabel}</span>
                        <div className="product-meta">
                          <h4>{product.name}</h4>
                          <span className="price">{formatMoney(product.price)}</span>
                        </div>
                        <div className="product-badges">
                          {Number(product.discount || 0) > 0 ? <span className="product-badge product-badge-discount">-{product.discount}%</span> : null}
                          <span className={`product-badge ${isAvailable ? "product-badge-available" : "product-badge-unavailable"}`}>
                            {isAvailable ? "Available" : "Special order"}
                          </span>
                          {(product.order_items_count || 0) > 0 ? (
                            <span className="product-badge product-badge-sold">{product.order_items_count} sold</span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="empty-state-card">
                  <h3>No products match your filters.</h3>
                  <p>Try resetting the filters or searching with a different keyword.</p>
                  <button type="button" className="btn-base btn-primary" onClick={handleReset}>
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "center" }}>
              <button type="button" className="btn-base btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <button type="button" className="btn-base btn-outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default Products;
