import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/productService";
import { createCategory, getCategories } from "../../../services/categoryService";
import { optimizeImageUpload } from "../../../utils/optimizeImageUpload";
import { resolveMediaUrl } from "../../../utils/media";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: 0,
  image: "",
  is_available: true,
  category_id: "",
  reference: "",
  min_stock: 5,
  status: "active",
  discount: "",
  level: "",
};

function AddProductAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }

        setCategories(Array.isArray(data) ? data : []);
        setForm((current) => ({
          ...current,
          category_id: current.category_id || (data?.[0]?.id ? String(data[0].id) : ""),
        }));
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

    loadCategories();

    return () => {
      active = false;
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  async function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (name === "image_file") {
      const file = files?.[0] || null;

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = "";
      }

      if (file) {
        try {
          const optimizedFile = await optimizeImageUpload(file);
          setImageFile(optimizedFile);
          const previewUrl = URL.createObjectURL(optimizedFile);
          previewRef.current = previewUrl;
          setImagePreview(previewUrl);
          setForm((current) => ({ ...current, image: "" }));
          setError("");
        } catch (processingError) {
          setImageFile(null);
          setImagePreview("");
          setError(processingError?.message || "Failed to process image.");
        }
      } else {
        setImageFile(null);
        setImagePreview("");
      }

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCategoryChange(event) {
    const { name, value } = event.target;

    setCategoryForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function buildPayload() {
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("description", form.description.trim() || "");
    payload.append("price", String(Number(form.price || 0)));
    payload.append("stock", String(Number(form.stock || 0)));
    payload.append("is_available", form.is_available ? "1" : "0");
    payload.append("category_id", String(Number(form.category_id)));
    payload.append("reference", form.reference.trim() || "");
    payload.append("min_stock", String(Number(form.min_stock || 0)));
    payload.append("status", form.status);
    payload.append("discount", form.discount === "" ? "" : String(Number(form.discount)));
    payload.append("level", form.level.trim() || "");

    if (imageFile) {
      payload.append("image_file", imageFile);
    } else if (form.image.trim()) {
      payload.append("image", form.image.trim());
    }

    return payload;
  }

  function slugify(value) {
    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleCreateCategory() {
    if (!categoryForm.name.trim()) {
      return;
    }

    setCreatingCategory(true);
    setError("");

    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim() || slugify(categoryForm.name),
      };

      const createdCategory = await createCategory(payload);
      const freshCategories = await getCategories();
      const normalizedCategories = Array.isArray(freshCategories) ? freshCategories : [];

      setCategories(normalizedCategories);
      setForm((current) => ({
        ...current,
        category_id: createdCategory?.id ? String(createdCategory.id) : current.category_id,
      }));
      setCategoryForm({ name: "", slug: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create category.");
    } finally {
      setCreatingCategory(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createProduct(buildPayload());
      navigate("/ProductsListAdmin");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return null;
  }

  const imageSrc = imagePreview || resolveMediaUrl(form.image) || "";

  return (
    <div className="add-admin-wrapper">
      <header style={{ marginBottom: "40px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#888", fontWeight: "bold" }}>
          ADMIN / INVENTORY / NEW
        </span>
      </header>

      <div className="add-card">
        <h2>Add New Product</h2>

        {error && (
          <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group full-row">
              <label htmlFor="name">Product Title</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group full-row">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price (DH)</label>
              <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="stock">Stock</label>
              <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  marginTop: "12px",
                  padding: "14px",
                  border: "1px dashed #e5e5e5",
                  borderRadius: "10px",
                  background: "#fcfcfc",
                }}
                >
                  <p style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>
                    Quick add category
                  </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  <input
                    type="text"
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryChange}
                    placeholder="Category name"
                  />
                  <input
                    type="text"
                    name="slug"
                    value={categoryForm.slug}
                    onChange={handleCategoryChange}
                    placeholder="Slug (optional)"
                  />
                  <button
                    type="button"
                    className="btn-base btn-outline"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory}
                  >
                    {creatingCategory ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="is_available">Availability</label>
              <select id="is_available" name="is_available" value={form.is_available ? "1" : "0"} onChange={(e) => setForm((current) => ({ ...current, is_available: e.target.value === "1" }))}>
                <option value="1">Available</option>
                <option value="0">Unavailable</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="reference">Reference / Barcode</label>
              <input id="reference" name="reference" value={form.reference} onChange={handleChange} placeholder="e.g. BIC-001" />
              <div className="barcode-preview">
                <span>Barcode / Reference</span>
                <strong>{form.reference || "AUTO-REF"}</strong>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="min_stock">Min Stock</label>
              <input id="min_stock" name="min_stock" type="number" min="0" value={form.min_stock} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="discount">Discount</label>
              <input id="discount" name="discount" type="number" step="0.01" min="0" value={form.discount} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="level">Level</label>
              <input id="level" name="level" value={form.level} onChange={handleChange} />
            </div>

            <div className="input-group full-row">
              <label htmlFor="image_file">Product Photo</label>
              <input id="image_file" name="image_file" type="file" accept="image/*" onChange={handleChange} />
              <p style={{ fontSize: "10px", color: "#aaa", marginTop: "5px" }}>
                Uploaded images are cropped to 1:1 and compressed automatically. If no file is selected, you can still paste an image URL below.
              </p>
            </div>

            <div className="input-group full-row">
              <label htmlFor="image">Image URL / Path</label>
              <input
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="e.g. /uploads/products/book.jpg"
              />
              <p style={{ fontSize: "10px", color: "#aaa", marginTop: "5px" }}>
                Backend stores image as a string path, so use an URL or relative path.
              </p>
            </div>

            <div className="input-group full-row">
              <label>Preview</label>
              <div className="product-preview-card">
                {imageSrc ? <img src={imageSrc} alt="Product preview" /> : <span>No image selected</span>}
              </div>
            </div>

            <button type="submit" className="btn-create" disabled={saving}>
              {saving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductAdmin;
