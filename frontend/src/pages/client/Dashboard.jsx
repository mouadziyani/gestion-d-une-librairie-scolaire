import React from "react";

function Dashboard() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Dashboard</h2>
      <p>Section: Client Area</p>
      <section>
        <h3>Quick Stats</h3>
        <ul>
          <li>Total Users: 1,245</li>
          <li>Active Orders: 38</li>
          <li>Low Stock Items: 12</li>
        </ul>
      </section>
      <section>
        <h3>Recent Activity</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Sample Item</td>
              <td>Active</td>
              <td>View | Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3>Charts</h3>
        <p>Placeholder for charts</p>
      </section>
    </div>
  );
}

export default Dashboard;
