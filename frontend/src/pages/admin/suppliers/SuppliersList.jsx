import React from "react";

function SuppliersList() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Suppliers List</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Search and Filters</h3>
        <form action="#">
          <fieldset>
            <legend>Filter Suppliers</legend>
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
        <h3>Suppliers Table</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Sample Supplier</td>
              <td>Active</td>
              <td>View | Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SuppliersList;
