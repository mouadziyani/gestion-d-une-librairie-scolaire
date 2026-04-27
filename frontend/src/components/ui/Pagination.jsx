import React from "react";

function Pagination() {
  return (
    <div>
      <nav aria-label="Pagination">
        <ul>
          <li><button type="button">Previous</button></li>
          <li><button type="button">1</button></li>
          <li><button type="button">2</button></li>
          <li><button type="button">Next</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
