import { Link } from "react-router-dom";
import logo from "../../assets/library.png";

function ForgotPassword() {
  return (
    <div className="auth-wrapper">
      {/* Visual Side (Desktop) */}
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <h2>Find <br/> Access.</h2>
        </div>
      </div>

      {/* Form Side */}
      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
             <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <h1>Reset</h1>
            <p>Don't worry, enter your email and we'll send you instructions.</p>
          </div>

          <form action="#">
            <div className="input-stack">
              <label>YOUR REGISTERED EMAIL</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                required 
              />
            </div>

            <button type="submit" className="btn-elegant">Send Reset Link</button>
          </form>

          <div className="footer-nav">
             <Link to="/" style={{opacity: 1, color: '#1a1a1a'}}>
                ← Back to Login
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;