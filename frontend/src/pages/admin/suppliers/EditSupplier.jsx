import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getSupplier, updateSupplier } from "../../../services/supplierService";

function EditSupplier() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("id");
  const [form, setForm] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSupplier() {
      const supplier = await getSupplier(supplierId);
      if (active && supplier) {
        setForm({
          name: supplier.name || "",
          code: supplier.code || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          status: supplier.status || "active",
        });
      }
      if (active) {
        setLoading(false);
      }
    }

    loadSupplier();

    return () => {
      active = false;
    };
  }, [supplierId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await updateSupplier(supplierId, form);
    navigate("/admin/suppliers");
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SUPPLIERS</span>
          <h1 className="page-shell-title">Edit Supplier</h1>
          <p className="page-shell-subtitle">Update the locally stored supplier record.</p>
        </div>
        <Link to="/admin/suppliers" className="btn-archive">Back to list</Link>
      </header>

      <section className="admin-card admin-form-shell">
        {!loading ? (
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="input-group">
              <label htmlFor="name">Supplier Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="code">Code</label>
              <input id="code" name="code" value={form.code} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="input-group full-row">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="input-group full-row">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="admin-actions-bar full-row">
              <button type="button" className="btn-archive" onClick={() => navigate("/admin/suppliers")}>Cancel</button>
              <button type="submit" className="btn-save">Save Changes</button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}

export default EditSupplier;
