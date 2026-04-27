import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/features/auth/authContext";
import { api } from "@/shared/services/api";

function SpecialOrder() {
  const { user } = useContext(AuthContext);
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    item_name: "",
    category_id: "",
    quantity: 1,
    school_id: "",
    details: "",
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [schoolsResponse, categoriesResponse] = await Promise.all([api.get("/schools"), api.get("/categories")]);
        if (active) {
          setSchools(Array.isArray(schoolsResponse.data?.data) ? schoolsResponse.data.data : []);
          setCategories(Array.isArray(categoriesResponse.data?.data) ? categoriesResponse.data.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load special order form data.");
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
    };
  }, []);

  const canSubmit = useMemo(() => Boolean(user?.id), [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/special-orders", {
        school_id: form.school_id || null,
        item_name: form.item_name,
        category_id: form.category_id || null,
        quantity: Number(form.quantity || 1),
        details: form.details || null,
      });
      setSuccess("Your special request has been submitted successfully.");
      setForm({
        item_name: "",
        category_id: "",
        quantity: 1,
        school_id: "",
        details: "",
      });
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Failed to submit special order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!canSubmit) {
    return (
      <div className="special-order-wrapper">
        <div className="special-order-header">
          <h1>Special Request</h1>
          <p>Please log in to submit a special order request.</p>
          <Link to="/login" className="btn-elegant" style={{ display: "inline-flex", width: "auto", marginTop: "20px", textDecoration: "none" }}>
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="special-order-page">
      <main className="special-order-wrapper">
        <div className="special-order-header">
          <h1>Special Request</h1>
          <p>Can't find a specific book or supply? Tell us what you need and we'll source it for you.</p>
        </div>

        <form className="order-form-grid" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label htmlFor="item_name">Item Name / Title</label>
            <input id="item_name" name="item_name" type="text" placeholder="e.g. Advanced Physics Grade 12" value={form.item_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" name="quantity" type="number" placeholder="1" min="1" value={form.quantity} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label htmlFor="school_id">Associated School (Optional)</label>
            <select id="school_id" name="school_id" value={form.school_id} onChange={handleChange}>
              <option value="">Select school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="details">Additional Details (ISBN, Author, Edition...)</label>
            <textarea
              id="details"
              name="details"
              rows="4"
              placeholder="The more info, the faster we find it..."
              value={form.details}
              onChange={handleChange}
            />
          </div>

          {error ? <div className="checkout-error full-width">{error}</div> : null}
          {success ? <div className="checkout-success full-width">{success}</div> : null}

          <button type="submit" className="btn-submit-order" disabled={submitting || loading}>
            {submitting ? "Submitting..." : "Submit Special Request"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ fontSize: "13px", color: "#888" }}>* Our team will notify you once the item status changes.</p>
        </div>
      </main>
    </div>
  );
}

export default SpecialOrder;
