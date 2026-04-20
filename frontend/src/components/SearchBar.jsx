import React, { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleFormSubmit} className="search-form">
        <Search size={20} className="search-icon-fixed" />
        
        <input
          type="text"
          id="searchInput"
          name="searchInput"
          className="search-input"
          placeholder="Search for books, authors, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
