import { Link } from "react-router-dom";

import logo from "@/assets/logo/library.png";
import useLoginForm from "@/features/auth/hooks/useLoginForm";
import { useUiPreferences } from "@/shared/context/UIContext";

function Login() {
  const { Form, handleChange, handleSubmit, error } = useLoginForm();
  const { t } = useUiPreferences();

  return (
    <div className="auth-wrapper auth-login">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>{t("auth.loginPanelKicker")}</span>
          <h2>{t("auth.loginPanelTitle")}</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">{t("auth.welcomeBack")}</span>
            <h1>{t("auth.signIn")}</h1>
            <p>{t("auth.loginDescription")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error ? <p className="auth-alert auth-alert-error">{error}</p> : null}

            <div className="input-stack">
              <label>{t("auth.email").toUpperCase()}</label>
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
              <label>{t("auth.password").toUpperCase()}</label>
              <input
                type="password"
                name="password"
                placeholder={t("auth.password")}
                required
                onChange={handleChange}
                value={Form.password}
              />
            </div>

            <button type="submit" className="btn-elegant">{t("auth.continue")}</button>
          </form>

          <div className="footer-nav">
            <Link to="/register">{t("auth.createAccount")}</Link>
            <Link to="/forgot-password">{t("auth.forgotPassword")}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
