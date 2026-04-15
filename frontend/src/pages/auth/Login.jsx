import { Link } from "react-router-dom";

import logo from "../../assets/logo/library.png";
import useLoginForm from "../../hooks/useLoginForm";

function Login() {
  const {Form , handleChange , handleSubmit} = useLoginForm();

  return (
    <div className="auth-wrapper">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <h2>Read <br/> More.</h2>
        </div>
      </div>

      
      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
             <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <h1>Sign in</h1>
            <p>Welcome back to BOUGDIM Library.</p>
          </div>

          <form onSubmit={handleSubmit} >
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
                placeholder="••••••••"
                required 
                onChange={handleChange}
                value={Form.password}
              />
            </div>

            <button type="submit" className="btn-elegant">Continue</button>
          </form>

          <div className="footer-nav">
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;