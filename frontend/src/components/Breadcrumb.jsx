import React from "react";

function Breadcrumb() {
  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="#">Home</a></li>
          <li><a href="#">Section</a></li>
          <li aria-current="page">Breadcrumb</li>
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
