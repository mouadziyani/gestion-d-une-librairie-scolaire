import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAdminUser, updateAdminUser } from "../../../services/adminUserService";
import { getRoles } from "../../../services/roleService";

function EditUser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role_id: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [user, roleList] = await Promise.all([getAdminUser(userId), getRoles()]);
        if (!active) {
          return;
        }

        setRoles(Array.isArray(roleList) ? roleList : []);
        setForm({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          role_id: user?.role_id ? String(user.role_id) : "",
          password: "",
          password_confirmation: "",
        });
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load user.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!userId) {
      setError("Missing user id.");
      setLoading(false);
      return () => {};
    }

    loadData();

    return () => {
      active = false;
    };
  }, [userId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("address", form.address);
      payload.append("role_id", form.role_id);

      if (form.password) {
        payload.append("password", form.password);
        payload.append("password_confirmation", form.password_confirmation);
      }

      if (profilePhoto) {
        payload.append("profile_photo", profilePhoto);
      }

      await updateAdminUser(userId, payload);
      navigate("/admin/users");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / USERS</span>
          <h1 className="page-shell-title">Edit User</h1>
          <p className="page-shell-subtitle">Update the account, role, or profile photo.</p>
        </div>
        <Link to="/admin/users" className="btn-archive">
          Back to list
        </Link>
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
            <label htmlFor="password">New Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <div className="input-group full-row">
            <label htmlFor="profile_photo">Profile Photo</label>
            <input id="profile_photo" type="file" accept="image/*" onChange={(event) => setProfilePhoto(event.target.files?.[0] || null)} />
          </div>

          {error ? <p className="form-alert form-alert-error full-row">{error}</p> : null}

          <div className="admin-actions-bar full-row">
            <button type="button" className="btn-archive" onClick={() => navigate("/admin/users")}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditUser;
