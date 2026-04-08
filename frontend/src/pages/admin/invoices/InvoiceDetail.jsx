import React from "react";

function InvoiceDetail() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Invoice Detail</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Invoice Details</h3>
        <dl>
          <dt>ID</dt>
          <dd>001</dd>
          <dt>Invoice Name</dt>
          <dd>Sample Invoice</dd>
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
        <h3>Invoice Lines</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Invoice Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Sample Invoice</td>
              <td>Active</td>
              <td>View | Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InvoiceDetail;
