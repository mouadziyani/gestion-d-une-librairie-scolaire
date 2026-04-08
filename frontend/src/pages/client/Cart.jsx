import React from "react";

function Cart() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Cart</h2>
      <p>Section: Client Area</p>
      <section>
        <h3>Cart Items</h3>
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
        <h3>Summary</h3>
        <ul>
          <li>Subtotal: $40</li>
          <li>Total: $45</li>
        </ul>
        <button type="button">Proceed to Checkout</button>
      </section>
    </div>
  );
}

export default Cart;
