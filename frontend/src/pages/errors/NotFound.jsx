import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="error-page-wrapper">
      <div className="error-code">404</div>

      <div className="error-content">
        <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', color: '#888' }}>
          OUPSS !
        </span>
        <h2>Page Missing</h2>
        <p>
          It seems like the chapter you're looking for has been moved or doesn't exist in our library. 
          Let's get you back to the main shelf.
        </p>
        
        <Link to="/" className="btn-back-home">
          Return to Library Home
        </Link>
      </div>

      <div style={{ marginTop: '50px', fontSize: '13px', color: '#ccc' }}>
        Library BOUGDIM — El Aïoun Sidi Mellouk, Oujda, Morocco
      </div>
    </div>
  );
}

export default NotFound;