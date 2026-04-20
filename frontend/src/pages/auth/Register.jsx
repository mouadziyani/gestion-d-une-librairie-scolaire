import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";
import useRegisterForm from "../../hooks/useRegisterForm";

function Register() {
  const { Form, handleChange, handleSubmit, error } = useRegisterForm();

  return (
    <div className="auth-wrapper">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <h2>Join <br/> Us.</h2>
        </div>
      </div>
      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <h1>Register</h1>
            <p>Create your account to start your journey.</p>
          </div>

          {error && (
            <p style={{ color: "#b42318", marginBottom: "10px", fontSize: "13px" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-stack">
              <label>FULL NAME</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={Form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-stack">
              <label>EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={Form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-stack">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={Form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-stack">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="••••••••"
                value={Form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-elegant">
              Create Account
            </button>
          </form>

          <div className="footer-nav">
            <p style={{ fontSize: "14px", color: "#777" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ opacity: 1, color: "#1a1a1a" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
