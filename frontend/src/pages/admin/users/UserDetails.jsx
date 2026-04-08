import React from "react";

function UserDetails() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>User Details</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>User Details</h3>
        <dl>
          <dt>ID</dt>
          <dd>001</dd>
          <dt>User Name</dt>
          <dd>Sample User</dd>
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

export default UserDetails;
