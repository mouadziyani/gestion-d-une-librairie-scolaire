import { Link } from "react-router-dom";
import logo from "@/assets/logo/library.png";
import useRegisterForm from "@/features/auth/hooks/useRegisterForm";
import { PASSWORD_POLICY_TEXT } from "@/shared/utils/auth/passwordPolicy";

function Register() {
  const { Form, handleChange, handleSubmit, error } = useRegisterForm();

  return (
    <div className="auth-wrapper auth-register">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>Join the library</span>
          <h2>Join <br /> Us.</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">New account</span>
            <h1>Create account</h1>
            <p>Start ordering books, stationery, and special requests from one clean space.</p>
          </div>

          {error ? <p className="auth-alert auth-alert-error">{error}</p> : null}

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
                placeholder="Strong password"
                value={Form.password}
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
                placeholder="Repeat your password"
                value={Form.password_confirmation}
                onChange={handleChange}
                minLength={10}
                required
              />
            </div>

            <button type="submit" className="btn-elegant">
              Create Account
            </button>
          </form>

          <div className="footer-nav">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
