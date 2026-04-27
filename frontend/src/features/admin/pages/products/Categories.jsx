import { useEffect, useMemo, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/shared/services/categoryService";

const initialForm = {
  name: "",
  slug: "",
};

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCategories() {
    const data = await getCategories();
    setCategories(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load categories.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      active = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return [category.name, category.slug]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
    });
  }, [categories, search]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, category) => sum + Number(category.products_count || 0), 0);
    const emptyCategories = categories.filter((category) => Number(category.products_count || 0) === 0).length;

    return { totalCategories, totalProducts, emptyCategories };
  }, [categories]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setActionError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "name" && !current.slug.trim() ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setActionError("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
    };

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      await loadCategories();
      resetForm();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
    });
    setActionError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`Delete category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    setActionError("");

    try {
      await deleteCategory(category.id);
      await loadCategories();

      if (editingId === category.id) {
        resetForm();
      }
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete category.");
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="categories-admin-wrapper">
      <header className="admin-header" style={{ marginBottom: "30px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#888", fontWeight: "700", letterSpacing: "2px" }}>
            ADMIN PANEL
          </span>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "3rem", marginTop: "10px" }}>
            Categories
          </h1>
        </div>
        <button type="button" className="btn-base btn-primary" onClick={resetForm}>
          + New Category
        </button>
      </header>

      {error && (
        <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <section className="category-stats-grid">
        <div className="stat-card">
          <h4>Total Categories</h4>
          <div className="count">{stats.totalCategories}</div>
        </div>
        <div className="stat-card">
          <h4>Total Products</h4>
          <div className="count">{stats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h4>Empty Categories</h4>
          <div className="count">{stats.emptyCategories}</div>
        </div>
      </section>

      <section className="admin-card" style={{ gridTemplateColumns: "1fr", gap: "0", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
          {editingId ? "Edit Category" : "Create Category"}
        </h3>

        {actionError && (
          <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
            {actionError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="edit-admin-wrapper" style={{ padding: 0, maxWidth: "none" }}>
            <div className="form-grid">
              <div className="edit-group">
                <label htmlFor="category-name">Category Name</label>
                <input
                  id="category-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edit-group">
                <label htmlFor="category-slug">Slug</label>
                <input
                  id="category-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generated from name if empty"
                />
              </div>
            </div>

            <div className="admin-actions-bar" style={{ marginTop: "20px" }}>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
              </button>
              <button type="button" className="btn-archive" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="admin-table-area">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px" }}>Category Management</h3>
          <input
            className="admin-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            style={{ minWidth: "240px" }}
          />
        </div>

        <table className="cat-list-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Items Linked</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="cat-name">{category.name}</td>
                  <td>
                    <span className="cat-badge">{category.slug || "-"}</span>
                  </td>
                  <td>{Number(category.products_count || 0)} Products</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="action-link"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="action-link delete-link"
                      onClick={() => handleDelete(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default CategoriesAdmin;
