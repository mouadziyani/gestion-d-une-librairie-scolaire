import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";
import { api } from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSending(true);

    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data?.status || "Reset link sent.");
      setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || "Failed to send reset link.";
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="auth-wrapper auth-forgot">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>Account recovery</span>
          <h2>Recover <br/> Access.</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
             <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">Password help</span>
            <h1>Reset access</h1>
            <p>Enter your account email and we will send a secure reset link.</p>
          </div>

          {message && (
            <p className="auth-alert auth-alert-success">
              {message}
            </p>
          )}
          {error && (
            <p className="auth-alert auth-alert-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-stack">
              <label>YOUR REGISTERED EMAIL</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-elegant" disabled={sending}>
              {sending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="footer-nav">
             <Link to="/login">
                Back to Login
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
