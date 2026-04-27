import React from "react";
import { Link } from "react-router-dom";

function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="server-error-wrapper">
      <div className="server-error-card">
        <span className="error-icon">⚙️</span>
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#ff6b6b' }}>
          ERROR 500
        </span>
        <h1>Technical Hiccup</h1>
        <p>
          Our digital librarians are currently organizing the shelves. 
          The server encountered an unexpected error and couldn't complete your request. 
          Please try refreshing the page.
        </p>

        <div className="refresh-container">
          <button onClick={handleRefresh} className="btn-refresh">
            Try Refreshing
          </button>
          <Link to="/" className="btn-support">
            Back to Safety
          </Link>
        </div>

        <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#aaa' }}>
            If the problem persists, contact the support team for technical assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServerError;
