import React from "react";

function UsersReports() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Users Reports</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Report Filters</h3>
        <form action="#">
          <fieldset>
            <legend>Date Range</legend>
            <div>
              <label htmlFor="from">From:</label><br />
              <input type="date" id="from" name="from" />
            </div>
            <div>
              <label htmlFor="to">To:</label><br />
              <input type="date" id="to" name="to" />
            </div>
            <div>
              <button type="submit">Run Report</button>
            </div>
          </fieldset>
        </form>
      </section>
      <section>
        <h3>Report Results</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Sample User</td>
              <td>Active</td>
              <td>View | Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3>Charts</h3>
        <p>Placeholder for analytics charts</p>
      </section>
    </div>
  );
}

export default UsersReports;
