import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import logo from "../../assets/logo/library.png";
import { api } from "../../services/api";
import { PASSWORD_POLICY_TEXT, validatePasswordPolicy } from "../../utils/passwordPolicy";

function ResetPassword() {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Passwords don't match.");
      return;
    }

    const passwordError = validatePasswordPolicy(form.password, { email });
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSaving(true);

    try {
      const res = await api.post("/reset-password", {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setMessage(res.data?.status || "Password updated.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.password?.[0] ||
        err?.response?.data?.message ||
        "Failed to reset password.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="auth-wrapper auth-reset">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>Secure password update</span>
          <h2>New <br /> Chapter.</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">Secure reset</span>
            <h1>New password</h1>
            <p>Choose a strong password for {email || "your account"}.</p>
          </div>

          {!token || !email ? (
            <p className="auth-alert auth-alert-error">
              This reset link is missing required information. Please request a new reset link.
            </p>
          ) : null}

          {message ? <p className="auth-alert auth-alert-success">{message}</p> : null}
          {error ? <p className="auth-alert auth-alert-error">{error}</p> : null}

          <form onSubmit={handleSubmit}>
            <div className="input-stack">
              <label>NEW PASSWORD</label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                minLength={10}
                required
              />
              <small className="password-policy-note">{PASSWORD_POLICY_TEXT}</small>
            </div>

            <div className="input-stack">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm new password"
                value={form.password_confirmation}
                onChange={handleChange}
                minLength={10}
                required
              />
            </div>

            <button type="submit" className="btn-elegant" disabled={saving || !token || !email}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="footer-nav">
            <Link to="/forgot-password">Request new link</Link>
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
