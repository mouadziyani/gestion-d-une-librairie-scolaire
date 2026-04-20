import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";

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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

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
        err?.response?.data?.message ||
        "Failed to reset password.";
      setError(msg);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-sidebar">
          <div className="tab-link active">NEW PASS</div>
        </div>
        <div className="auth-content">
          <div className="logo-container">
            <div className="logo-graphic"></div>
            <h1 className="auth-title">NEW PASSWORD</h1>
          </div>

          {message && (
            <p style={{ color: "#027a48", marginBottom: "10px", fontSize: "13px" }}>
              {message}
            </p>
          )}
          {error && (
            <p style={{ color: "#b42318", marginBottom: "10px", fontSize: "13px" }}>
              {error}
            </p>
          )}

          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="input-row">
              <span>Pwd</span>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-row">
              <span>Chk</span>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions" style={{ justifyContent: "center" }}>
              <button type="submit" className="submit-btn">UPDATE PASSWORD</button>
            </div>
          </form>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link to="/login" style={{ color: "#1a1a1a", fontSize: "13px" }}>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
