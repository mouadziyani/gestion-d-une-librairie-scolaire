import { Link } from "react-router-dom";

import logo from "@/assets/logo/library.png";
import useLoginForm from "@/features/auth/hooks/useLoginForm";

function Login() {
  const { Form, handleChange, handleSubmit, error } = useLoginForm();

  return (
    <div className="auth-wrapper auth-login">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>Student supply hub</span>
          <h2>Read <br /> More.</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">Welcome back</span>
            <h1>Sign in</h1>
            <p>Access your Library BOUGDIM account and keep your school essentials close.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error ? <p className="auth-alert auth-alert-error">{error}</p> : null}

            <div className="input-stack">
              <label>EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                onChange={handleChange}
                value={Form.email}
              />
            </div>

            <div className="input-stack">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={handleChange}
                value={Form.password}
              />
            </div>

            <button type="submit" className="btn-elegant">Continue</button>
          </form>

          <div className="footer-nav">
            <Link to="/register">Create account</Link>
            <Link to="/forgot-password">Forgot password</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
