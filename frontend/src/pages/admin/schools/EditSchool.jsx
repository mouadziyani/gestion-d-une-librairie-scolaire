import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";

function EditSchool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get("id");
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSchool() {
      try {
        const response = await api.get(`/schools/${schoolId}`);
        const school = response.data?.data;
        if (active && school) {
          setForm({
            name: school.name || "",
            code: school.code || "",
            address: school.address || "",
            city: school.city || "",
            phone: school.phone || "",
            email: school.email || "",
            status: school.status || "active",
          });
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load school.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!schoolId) {
      setError("Missing school id.");
      setLoading(false);
      return () => {};
    }

    loadSchool();

    return () => {
      active = false;
    };
  }, [schoolId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/schools/${schoolId}`, form);
      navigate("/admin/schools");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update school.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SCHOOLS</span>
          <h1 className="page-shell-title">Edit School</h1>
          <p className="page-shell-subtitle">Update the partner school information.</p>
        </div>
        <Link to="/admin/schools" className="btn-archive">
          Back to list
        </Link>
      </header>

      <section className="admin-card admin-form-shell">
        {!loading ? (
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="input-group">
              <label htmlFor="name">School Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="code">Code</label>
              <input id="code" name="code" value={form.code} onChange={handleChange} />
            </div>

            <div className="input-group full-row">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="input-group full-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="input-group full-row">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error ? <p className="form-alert form-alert-error full-row">{error}</p> : null}

            <div className="admin-actions-bar full-row">
              <button type="button" className="btn-archive" onClick={() => navigate("/admin/schools")}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}

export default EditSchool;
