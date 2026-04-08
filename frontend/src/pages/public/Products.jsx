import React from "react";

function Products() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Products</h2>
      <p>Section: Public Area</p>
      <section>
        <h3>Search and Filters</h3>
        <form action="#">
          <fieldset>
            <legend>Filter Products</legend>
            <div>
              <label htmlFor="search">Search:</label><br />
              <input type="text" id="search" name="search" />
            </div>
            <div>
              <label htmlFor="status">Status:</label><br />
              <select id="status" name="status">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <button type="submit">Apply Filters</button>
            </div>
          </fieldset>
        </form>
      </section>
      <section>
        <h3>Product List</h3>
        <ul>
          <li>Product A - $10</li>
          <li>Product B - $12</li>
        </ul>
      </section>
    </div>
  );
}

export default Products;
