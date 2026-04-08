import React from "react";

function OrderDetails() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Order Details</h2>
      <p>Section: Moderator Area</p>
      <section>
        <h3>Order Details</h3>
        <dl>
          <dt>ID</dt>
          <dd>001</dd>
          <dt>Order Name</dt>
          <dd>Sample Order</dd>
          <dt>Status</dt>
          <dd>Active</dd>
        </dl>
      </section>
      <section>
        <h3>Related Information</h3>
        <ul>
          <li>Recent activity</li>
          <li>Linked documents</li>
        </ul>
      </section>
      <section>
        <h3>Order Items</h3>
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

export default OrderDetails;
