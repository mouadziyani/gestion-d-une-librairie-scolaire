import React from "react";

function Sort() {
  return (
    <div>
      <form action="#">
        <label htmlFor="sortBy">Sort By:</label><br />
        <select id="sortBy" name="sortBy">
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>
      </form>
    </div>
  );
}

export default Sort;
