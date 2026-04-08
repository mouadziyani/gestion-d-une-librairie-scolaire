import React from "react";

function Checkout() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Checkout</h2>
      <p>Section: Client Area</p>
      <section>
        <h3>Checkout Item</h3>
        <form action="#">
          <fieldset>
            <legend>Checkout Details</legend>
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
              <button type="submit">Checkout</button>
            </div>
          </fieldset>
        </form>
      </section>
      <section>
        <h3>Order Summary</h3>
        <ul>
          <li>Items: 3</li>
          <li>Total: $45</li>
        </ul>
      </section>
    </div>
  );
}

export default Checkout;
