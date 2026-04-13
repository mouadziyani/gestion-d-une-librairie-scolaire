import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo/library.png";
import api from "../../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    
    await api.get("/sanctum/csrf-cookie");

    const res = await api.post("/login", {
      email: username,
      password: password,
    });

    console.log("Login success", res.data);
    window.location.href = "/dashboard";

  } catch (err) {
    console.error(err.response?.data);
  }
};

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

          <form onSubmit={handleLogin}>
            <div className="input-stack">
              <label>EMAIL</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="input-stack">
              <label>PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
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