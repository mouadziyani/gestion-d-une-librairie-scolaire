import React from "react";

function Profile() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Profile</h2>
      <p>Section: Client Area</p>
      <section>
        <h3>Profile Summary</h3>
        <dl>
          <dt>Name</dt>
          <dd>Alex Example</dd>
          <dt>Email</dt>
          <dd>alex@example.com</dd>
        </dl>
      </section>
      <section>
        <h3>Update Item</h3>
        <form action="#">
          <fieldset>
            <legend>Update Details</legend>
            <div>
              <label htmlFor="name">Name:</label><br />
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="code">Code:</label><br />
              <input type="text" id="code" name="code" required />
            </div>
            <div>
              <label htmlFor="status">Status:</label><br />
              <select id="status" name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <button type="submit">Update</button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default Profile;
