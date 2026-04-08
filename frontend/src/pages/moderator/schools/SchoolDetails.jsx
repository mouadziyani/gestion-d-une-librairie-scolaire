import React from "react";

function SchoolDetails() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>School Details</h2>
      <p>Section: Moderator Area</p>
      <section>
        <h3>School Details</h3>
        <dl>
          <dt>ID</dt>
          <dd>001</dd>
          <dt>School Name</dt>
          <dd>Sample School</dd>
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

export default SchoolDetails;
