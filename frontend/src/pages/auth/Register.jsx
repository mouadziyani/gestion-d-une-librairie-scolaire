import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/library.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match! ❌");
      return;
    }
    // Logic dyal register hna
    console.log("Registering...", formData);
  };

  return (
    <div className="auth-wrapper">
      {/* Visual Side (Desktop) */}
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <h2>Join <br/> Us.</h2>
        </div>
      </div>

      {/* Form Side */}
      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
             <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <h1>Register</h1>
            <p>Create your account to start your journey.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-stack">
              <label>FULL NAME</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe"
                value={formData.name}
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
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-stack">
              <label>CONFIRM PASSWORD</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="btn-elegant">Create Account</button>
          </form>

          <div className="footer-nav">
             <p style={{fontSize: '14px', color: '#777'}}>
                Already have an account? <Link to="/" style={{opacity: 1, color: '#1a1a1a'}}>Sign in</Link>
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;