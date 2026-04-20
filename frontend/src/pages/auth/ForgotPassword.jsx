import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";
import { api } from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data?.status || "Reset link sent.");
      setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || "Failed to send reset link.";
      setError(msg);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <h2>Find <br/> Access.</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
             <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <h1>Reset</h1>
            <p>Enter your email and we will send you a reset link.</p>
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

            <button type="submit" className="btn-elegant">Send Reset Link</button>
          </form>

          <div className="footer-nav">
             <Link to="/login" style={{opacity: 1, color: '#1a1a1a'}}>
                Back to Login
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
