import React from "react";

function EditProduct() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>Edit Product</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>Update Product</h3>
        <form action="#">
          <fieldset>
            <legend>Update Details</legend>
            <div>
              <label htmlFor="name">Name:</label><br />
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="Pics">Pics:</label><br />
              <input type="text" id="Pics" name="Pics" required />
            </div>
            <div>
              <label htmlFor="Price">Price:</label><br />
              <input type="text" id="Price" name="Price" required />
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
              <button type="submit">Update</button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default EditProduct;
