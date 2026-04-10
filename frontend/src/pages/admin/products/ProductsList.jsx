import React from "react";
import { Link } from "react-router-dom";

function ProductsListAdmin() {
  // Data dummy bach n-choufo l-mndar
  const products = [
    { id: 101, name: "Stylo à bille Bleu - BIC", price: "1.50 DH", status: "active", stock: 150 },
    { id: 102, name: "Mathematics Grade 6", price: "120.00 DH", status: "active", stock: 24 },
    { id: 103, name: "Scientific Calculator", price: "280.00 DH", status: "inactive", stock: 0 },
  ];

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span style={{ fontSize: '11px', color: '#888', letterSpacing: '2px', fontWeight: 'bold' }}>ADMIN AREA</span>
          <h2>Inventory List</h2>
        </div>
        <Link to="/admin/add-product" className="btn-filled" style={{ textDecoration: 'none', padding: '12px 25px' }}>
          + Add New Product
        </Link>
      </header>

      {/* Modern Filter Section */}
      <section className="filter-bar-admin">
        <div className="filter-field" style={{ flex: 2 }}>
          <label htmlFor="search">Search Products</label>
          <input type="text" id="search" placeholder="Search by name or barcode..." />
        </div>
        
        <div className="filter-field">
          <label htmlFor="status">Status</label>
          <select id="status">
            <option value="all">All Items</option>
            <option value="active">Active Only</option>
            <option value="inactive">Out of Stock</option>
          </select>
        </div>

        <button className="btn-elegant" style={{ padding: '12px 30px' }}>Filter</button>
      </section>

      {/* Table View */}
      <section className="data-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ color: '#aaa', fontSize: '12px' }}>#{p.id}</td>
                <td style={{ fontWeight: '600' }}>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock} units</td>
                <td>
                  <span className={`status-indicator ${p.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link to={`/admin/edit-product/${p.id}`} style={{ marginRight: '15px', fontSize: '13px', color: '#1a1a1a' }}>Edit</Link>
                  <button style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ProductsListAdmin;