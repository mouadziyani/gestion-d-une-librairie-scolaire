import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "@/assets/avatars/profile.jpg";
import { AuthContext } from "@/features/auth/authContext";
import { resolveMediaUrl } from "@/shared/utils/common/media";
import { PASSWORD_POLICY_TEXT, validatePasswordPolicy } from "@/shared/utils/auth/passwordPolicy";

function Profile() {
  const { user, loading, updateProfile, deleteProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    profile_photo: null,
  });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
      address: prev.address || user.address || "",
    }));

    setPreview(resolveMediaUrl(user.profile_photo_url || user.profile_photo || ""));
  }, [user]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "profile_photo") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, profile_photo: file }));
      setPreview(file ? URL.createObjectURL(file) : resolveMediaUrl(user?.profile_photo_url || user?.profile_photo || ""));
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.password) {
      if (form.password !== form.password_confirmation) {
        setError("Passwords don't match.");
        return;
      }

      const passwordError = validatePasswordPolicy(form.password, form);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append("name", form.name || user?.name || "");
      payload.append("email", form.email || user?.email || "");
      payload.append("phone", form.phone || user?.phone || "");
      payload.append("address", form.address || user?.address || "");

      if (form.current_password) {
        payload.append("current_password", form.current_password);
      }

      if (form.password) {
        payload.append("password", form.password);
        payload.append("password_confirmation", form.password_confirmation || "");
      }

      if (form.profile_photo) {
        payload.append("profile_photo", form.profile_photo);
      }

      await updateProfile(payload);
      setMessage("Profile updated successfully.");
      setForm((prev) => ({
        ...prev,
        profile_photo: null,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "";
      const serverErrors = err?.response?.data?.errors || err?.errors || {};
      const msg =
        serverMessage ||
        serverErrors?.password?.[0] ||
        serverErrors?.current_password?.[0] ||
        serverErrors?.profile_photo?.[0] ||
        serverErrors?.email?.[0] ||
        "Profile update failed.";
      setError(msg);
    }
  }

  async function handleDeleteProfile() {
    const confirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");
    setDeleteMessage("");

    try {
      await deleteProfile();
      setDeleteMessage("Profile deleted. Redirecting...");
      navigate("/");
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message || "Profile deletion failed.";
      setError(serverMessage);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-grid">
        <aside className="profile-sidebar">
          <div className="profile-avatar-container">
            <img
              src={preview || resolveMediaUrl(user?.profile_photo_url || user?.profile_photo || "") || ProfileImage}
              alt="Profile"
              className="profile-img"
            />
            <button className="edit-avatar-btn" title="Change Avatar" type="button" onClick={openFilePicker}>
              +
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="profile_photo"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <h3 style={{ margin: "10px 0 5px", fontFamily: "Fraunces, serif" }}>
            {user?.name || "User"}
          </h3>
          <span style={{ fontSize: "11px", color: "#888", fontWeight: "800", letterSpacing: "1px" }}>
            {user?.role?.name || "ACCOUNT"}
          </span>
        </aside>

        <main className="profile-main-card">
          <form onSubmit={handleSubmit}>
            <section>
              <h2 className="profile-section-title">Personal Information</h2>

              {message && (
                <p style={{ color: "#027a48", marginBottom: "12px", fontSize: "13px" }}>
                  {message}
                </p>
              )}

              {deleteMessage && (
                <p style={{ color: "#027a48", marginBottom: "12px", fontSize: "13px" }}>
                  {deleteMessage}
                </p>
              )}

              {error && (
                <p style={{ color: "#c53030", marginBottom: "12px", fontSize: "13px" }}>
                  {error}
                </p>
              )}

              <div className="form-row">
                <div>
                  <label className="profile-label">Full Name</label>
                  <input
                    type="text"
                    className="profile-input"
                    name="name"
                    value={form.name ?? user?.name ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="profile-label">Email Address</label>
                  <input
                    type="email"
                    className="profile-input"
                    name="email"
                    value={form.email ?? user?.email ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="profile-label">Phone Number</label>
                  <input
                    type="text"
                    className="profile-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="profile-label">Full Address</label>
                  <input
                    type="text"
                    className="profile-input"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section style={{ marginTop: "40px" }}>
              <h2 className="profile-section-title">Security & Password</h2>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "15px" }}>
                Leave these fields blank if you do not want to change your password.
              </p>

              <div className="password-grid">
                <div>
                  <label className="profile-label">Current Password</label>
                  <input
                    type="password"
                    className="profile-input"
                    name="current_password"
                    value={form.current_password}
                    onChange={handleChange}
                    placeholder="********"
                  />
                </div>
                <div>
                  <label className="profile-label">New Password</label>
                  <input
                    type="password"
                    className="profile-input"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="New password"
                    minLength={10}
                  />
                  <small className="password-policy-note">{PASSWORD_POLICY_TEXT}</small>
                </div>
                <div>
                  <label className="profile-label">Confirm New</label>
                  <input
                    type="password"
                    className="profile-input"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    minLength={10}
                  />
                </div>
              </div>
            </section>

            <div className="profile-actions-bar">
              <button type="button" className="btn-delete-profile" onClick={handleDeleteProfile} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Profile"}
              </button>

              <button type="submit" className="btn-update-profile">
                Update Profile
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Profile;
