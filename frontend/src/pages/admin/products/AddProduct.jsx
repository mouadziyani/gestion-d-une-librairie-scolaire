import React from "react";

function AddProduct() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Add Product</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Create Product</h3>
        <form action="#">
          <fieldset>
            <legend>Create Details</legend>
            <div>
              <label htmlFor="name">Name:</label><br />
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="pics">Pics:</label><br />
              <input type="text" id="Pics" name="Pics" required />
            </div>
            <div>
              <label htmlFor="price">price:</label><br />
              <input type="file" id="price" name="price" required />
            </div>
            <div>
              <label htmlFor="code">CodeBar:</label><br />
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

export default AddProduct;
