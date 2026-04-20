import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../../../services/supplierService";

const INITIAL_FORM = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
};

function AddSupplier() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await createSupplier(form);
    navigate("/admin/suppliers");
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SUPPLIERS</span>
          <h1 className="page-shell-title">Add Supplier</h1>
          <p className="page-shell-subtitle">Create a supplier record stored locally for now.</p>
        </div>
      </header>

      <section className="admin-card admin-form-shell">
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
          {error ? <p className="form-alert form-alert-error full-row">{error}</p> : null}
          <div className="admin-actions-bar full-row">
            <button type="button" className="btn-archive" onClick={() => navigate("/admin/suppliers")}>Cancel</button>
            <button type="submit" className="btn-save">Create Supplier</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddSupplier;
