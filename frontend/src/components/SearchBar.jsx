import React from "react";

function SearchBar() {
  return (
    <div>
      <form action="#">
        <label htmlFor="searchInput">Search:</label><br />
        <input type="text" id="searchInput" name="searchInput" />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
