import React from "react";
import { ListFilter } from "lucide-react";

function Sort({ onSortChange }) {
  return (
    <div className="sort-container">
      <ListFilter size={16} color="#888" />
      <span className="sort-label">Sort by:</span>
      
      <div className="sort-select-wrapper">
        <select 
          id="sortBy" 
          name="sortBy" 
          className="sort-select"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}

export default Sort;