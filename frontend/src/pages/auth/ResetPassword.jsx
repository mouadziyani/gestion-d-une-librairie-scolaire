import { Link } from "react-router-dom";

function ResetPassword() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-sidebar">
          <div className="tab-link active">NEW PASS</div>
        </div>
        <div className="auth-content">
          <div className="logo-container">
            <div className="logo-graphic"></div>
            <h1 className="auth-title">NEW PASSWORD</h1>
          </div>
          <form className="custom-form">
            <div className="input-row">
              <span>🔒</span>
              <input type="password" placeholder="New Password" required />
            </div>
            <div className="input-row">
              <span>🛡️</span>
              <input type="password" placeholder="Confirm Password" required />
            </div>
            <div className="form-actions" style={{justifyContent: 'center'}}>
              <button type="submit" className="submit-btn">UPDATE PASSWORD</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;