import React from "react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/">🏠 Home</Link>
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <li key={to} className={`breadcrumb-item ${last ? "active" : ""}`}>
              <span className="breadcrumb-separator">/</span>
              {last ? (
                <span>{value.replace(/([A-Z])/g, ' $1').trim()}</span>
              ) : (
                <Link to={to}>
                  {value.replace(/([A-Z])/g, ' $1').trim()}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;