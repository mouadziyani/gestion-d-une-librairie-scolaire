import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { createAdminUser } from "../../../services/adminUserService";

const INITIAL_FORM = {
  name: "",
  email: "",
  role_slug: "client",
};

const ROLE_OPTIONS = [
  { label: "User", value: "client" },
  { label: "Moderator", value: "moderator" },
];

function CreateUser() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createAdminUser({
        name: form.name,
        email: form.email,
        role_slug: form.role_slug,
      });
      navigate("/admin/users");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to create user.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / USERS</span>
          <h1 className="page-shell-title">Add User</h1>
          <p className="page-shell-subtitle">
            Create staff, moderator, or client accounts. A secure password will be generated and sent by email.
            {user?.name ? ` Logged in as ${user.name}.` : ""}
          </p>
        </div>
      </header>

      <section className="admin-card admin-form-shell">
        <form onSubmit={handleSubmit} className="admin-form-grid">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="role_slug">Role</label>
            <select id="role_slug" name="role_slug" value={form.role_slug} onChange={handleChange} required>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="form-alert form-alert-error full-row">{error}</p> : null}

          <div className="admin-actions-bar full-row">
            <button type="button" className="btn-archive" onClick={() => navigate("/admin/users")}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={submitting}>
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateUser;
