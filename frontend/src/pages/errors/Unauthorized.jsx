import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="unauthorized-wrapper">
      <div className="unauthorized-card">
        <span className="lock-icon">🔒</span>
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '3px', color: '#888' }}>
          ACCESS RESTRICTED
        </span>
        <h1>Restricted Section</h1>
        <p>
          This area of <strong>Library BOUGDIM</strong> is reserved for authorized staff only. 
          Your current credentials don't grant access to these archives.
        </p>

        <Link to="/" className="btn-restricted">
          Return to Public Area
        </Link>

        <div style={{ marginTop: '40px' }}>
          <Link to="/login" style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '600' }}>
            Login as Administrator
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;