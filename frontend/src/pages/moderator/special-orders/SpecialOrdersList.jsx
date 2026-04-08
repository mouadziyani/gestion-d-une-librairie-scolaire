import React from "react";

function SpecialOrdersList() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Special Orders List</h2>
      <p>Section: Moderator Area</p>
      <section>
        <h3>Search and Filters</h3>
        <form action="#">
          <fieldset>
            <legend>Filter Orders</legend>
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
        <h3>Orders Table</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Sample Order</td>
              <td>Active</td>
              <td>View | Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SpecialOrdersList;
