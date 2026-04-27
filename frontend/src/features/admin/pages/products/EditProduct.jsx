import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "@/shared/services/categoryService";
import { getProduct, updateProduct } from "@/shared/services/productService";
import { optimizeImageUpload } from "@/shared/utils/common/optimizeImageUpload";
import { resolveMediaUrl } from "@/shared/utils/common/media";

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

function EditProductAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const listPath = location.pathname.startsWith("/moderator") ? "/moderator/products" : "/ProductsListAdmin";
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [categoriesData, productData] = await Promise.all([
          getCategories(),
          productId ? getProduct(productId) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        if (productData) {
          setForm({
            name: productData.name || "",
            description: productData.description || "",
            price: productData.price ?? "",
            stock: productData.stock ?? 0,
            image: productData.image || "",
            is_available: Number(productData.is_available) !== 0,
            category_id: productData.category_id ? String(productData.category_id) : "",
            reference: productData.reference || "",
            min_stock: productData.min_stock ?? 5,
            status: productData.status || "active",
            discount: productData.discount ?? "",
            level: productData.level || "",
          });
          setImagePreview(resolveMediaUrl(productData.image_url) || "");
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load product.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [productId]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateProduct(productId, buildPayload());
      navigate(listPath);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  }

  if (!productId) {
    return (
      <div className="edit-admin-wrapper">
        <div className="edit-card">
          <h2>Missing Product ID</h2>
          <p>Please open this page from the products list.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return null;
  }

  const imageSrc = imagePreview || resolveMediaUrl(form.image) || "";

  return (
    <div className="edit-admin-wrapper">
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", letterSpacing: "2px", color: "#888", fontWeight: "bold" }}>
          LIBRARY BOUGDIM ADMIN
        </span>
      </header>

      <div className="edit-card">
        <h2>Edit Product</h2>

        {error && (
          <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="edit-group full-row">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="edit-group full-row">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} />
            </div>

            <div className="edit-group">
              <label htmlFor="price">Price (DH)</label>
              <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>

            <div className="edit-group">
              <label htmlFor="stock">Stock</label>
              <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>

            <div className="edit-group">
              <label htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="edit-group">
              <label htmlFor="is_available">Availability</label>
              <select
                id="is_available"
                name="is_available"
                value={form.is_available ? "1" : "0"}
                onChange={(e) => setForm((current) => ({ ...current, is_available: e.target.value === "1" }))}
              >
                <option value="1">Available</option>
                <option value="0">Unavailable</option>
              </select>
            </div>

            <div className="edit-group">
              <label htmlFor="reference">Reference / Barcode</label>
              <input id="reference" name="reference" value={form.reference} onChange={handleChange} placeholder="e.g. BIC-001" />
              <div className="barcode-preview">
                <span>Barcode / Reference</span>
                <strong>{form.reference || "AUTO-REF"}</strong>
              </div>
            </div>

            <div className="edit-group">
              <label htmlFor="min_stock">Min Stock</label>
              <input id="min_stock" name="min_stock" type="number" min="0" value={form.min_stock} onChange={handleChange} required />
            </div>

            <div className="edit-group">
              <label htmlFor="discount">Discount</label>
              <input id="discount" name="discount" type="number" step="0.01" min="0" value={form.discount} onChange={handleChange} />
            </div>

            <div className="edit-group">
              <label htmlFor="level">Level</label>
              <input id="level" name="level" value={form.level} onChange={handleChange} />
            </div>

            <div className="edit-group full-row">
              <label htmlFor="image_file">Product Photo</label>
              <input id="image_file" name="image_file" type="file" accept="image/*" onChange={handleChange} />
              <p style={{ fontSize: "10px", color: "#aaa", marginTop: "5px" }}>
                Uploaded images are cropped to 1:1 and compressed automatically.
              </p>
            </div>

            <div className="edit-group full-row">
              <label htmlFor="image">Image URL / Path</label>
              <input id="image" name="image" value={form.image} onChange={handleChange} />
            </div>

            <div className="edit-group full-row">
              <label>Preview</label>
              <div className="product-preview-card">
                {imageSrc ? <img src={imageSrc} alt="Product preview" /> : <span>No image selected</span>}
              </div>
            </div>
          </div>

          <button type="submit" className="update-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
        Product ID: {productId}
      </p>
    </div>
  );
}

export default EditProductAdmin;
