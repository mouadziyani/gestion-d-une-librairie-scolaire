import { Link } from "react-router-dom";
import logo from "@/assets/logo/library.png";
import useRegisterForm from "@/features/auth/hooks/useRegisterForm";
import { PASSWORD_POLICY_TEXT } from "@/shared/utils/auth/passwordPolicy";
import { useUiPreferences } from "@/shared/context/UIContext";

function Register() {
  const { Form, handleChange, handleSubmit, error } = useRegisterForm();
  const { t } = useUiPreferences();

  return (
    <div className="auth-wrapper auth-register">
      <div className="auth-panel">
        <div className="panel-overlay-text">
          <span>{t("auth.registerPanelKicker")}</span>
          <h2>{t("auth.registerPanelTitle")}</h2>
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-container-inner">
          <div className="logo-box">
            <img src={logo} alt="BOUGDIM" />
          </div>

          <div className="hero-text">
            <span className="auth-eyebrow">{t("auth.newAccount")}</span>
            <h1>{t("auth.createAccountTitle")}</h1>
            <p>{t("auth.registerDescription")}</p>
          </div>

          {error ? <p className="auth-alert auth-alert-error">{error}</p> : null}

          <form onSubmit={handleSubmit}>
            <div className="input-stack">
              <label>{t("auth.fullName").toUpperCase()}</label>
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
              <label>{t("auth.email").toUpperCase()}</label>
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
              <label>{t("auth.password").toUpperCase()}</label>
              <input
                type="password"
                name="password"
                placeholder={t("auth.strongPassword")}
                value={Form.password}
                onChange={handleChange}
                minLength={10}
                required
              />
              <small className="password-policy-note">{PASSWORD_POLICY_TEXT}</small>
            </div>

            <div className="input-stack">
              <label>{t("auth.confirmPassword").toUpperCase()}</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder={t("auth.confirmPassword")}
                value={Form.password_confirmation}
                onChange={handleChange}
                minLength={10}
                required
              />
            </div>

            <button type="submit" className="btn-elegant">
              {t("auth.createAccountTitle")}
            </button>
          </form>

          <div className="footer-nav">
            <p>
              {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.signInLink")}</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
