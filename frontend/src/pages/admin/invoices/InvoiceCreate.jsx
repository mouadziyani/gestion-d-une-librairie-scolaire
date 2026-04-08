import React from "react";

function InvoiceCreate() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Invoice Create</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Create Invoice</h3>
        <form action="#">
          <fieldset>
            <legend>Create Details</legend>
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
              <button type="submit">Create</button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default InvoiceCreate;
