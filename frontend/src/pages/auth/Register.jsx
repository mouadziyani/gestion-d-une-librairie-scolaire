import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo/library.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");

      
      await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      
      const user = await api.get("/api/user");
      console.log("User:", user.data);

      
      window.location.href = "/dashboard";

    } catch (err) {
      if (err.response?.status === 422) {
        setError("Email deja utilisé ou données invalides");
      } else {
        console.log(err.response);
        console.log(err.response?.data);
        setError(JSON.stringify(err.response?.data));
      }
    }
  };

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
            <p style={{ color: "red", marginBottom: "10px" }}>
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