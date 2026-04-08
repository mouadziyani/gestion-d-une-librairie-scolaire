import React from "react";

function SupplierDetails() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Supplier Details</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Supplier Details</h3>
        <dl>
          <dt>ID</dt>
          <dd>001</dd>
          <dt>Supplier Name</dt>
          <dd>Sample Supplier</dd>
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
    </div>
  );
}

export default SupplierDetails;
