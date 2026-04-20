import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { createAdminUser } from "../../../services/adminUserService";
import { getRoles } from "../../../services/roleService";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  role_id: "",
  password: "",
  password_confirmation: "",
};

function CreateUser() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRoles() {
      try {
        const data = await getRoles();
        if (active) {
          setRoles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setRoles([]);
        }
      }
    }

    loadRoles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (roles.length && !form.role_id) {
      const defaultRole = roles.find((role) => role.slug === "client") || roles[0];
      if (defaultRole) {
        setForm((current) => ({ ...current, role_id: String(defaultRole.id) }));
      }
    }
  }, [roles, form.role_id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handlePhotoChange(event) {
    setProfilePhoto(event.target.files?.[0] || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("address", form.address);
      payload.append("role_id", form.role_id);
      payload.append("password", form.password);
      payload.append("password_confirmation", form.password_confirmation);

      if (profilePhoto) {
        payload.append("profile_photo", profilePhoto);
      }

      await createAdminUser(payload);
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
            Create staff, moderator, or client accounts from one place.
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
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="role_id">Role</label>
            <select id="role_id" name="role_id" value={form.role_id} onChange={handleChange} required>
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group full-row">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" type="text" value={form.address} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group full-row">
            <label htmlFor="profile_photo">Profile Photo</label>
            <input id="profile_photo" type="file" accept="image/*" onChange={handlePhotoChange} />
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
