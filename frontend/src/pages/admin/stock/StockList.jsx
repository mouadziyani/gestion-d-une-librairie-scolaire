import React from "react";
import { Link } from "react-router-dom";

function StockList() {
  const stockItems = [
    { id: "001", name: "Stylo à bille Bleu - BIC", code: "BIC-BL-001", status: "Active", qty: 1240 },
    { id: "002", name: "Mathematics Grade 6", code: "BK-MATH-06", status: "Active", qty: 8 }, // Low stock
    { id: "003", name: "Scientific Calculator", code: "CALC-FX-99", status: "Inactive", qty: 0 },
  ];

  return (
    <div className="stock-list-wrapper">
      <header className="admin-header">
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888' }}>ADMIN AREA</span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem' }}>Stock Inventory</h2>
        </div>
      </header>

      {/* Quick Summary Cards */}
      <section className="stock-stats-row">
        <div className="stock-card-mini">
          <span>Total Items</span>
          <strong>2,055</strong>
        </div>
        <div className="stock-card-mini">
          <span>Low Stock Alerts</span>
          <strong style={{ color: '#e67e22' }}>14</strong>
        </div>
        <div className="stock-card-mini">
          <span>Out of Stock</span>
          <strong style={{ color: '#ff6b6b' }}>3</strong>
        </div>
      </section>

      {/* Filter Section */}
      <section className="admin-filters" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input type="text" placeholder="Search by name or code..." className="admin-input" style={{ flex: 3 }} />
        <select className="admin-input" style={{ flex: 1 }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn-filled" style={{ padding: '0 30px' }}>Apply</button>
      </section>

      {/* Stock Table */}
      <section className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID / Code</th>
              <th>Stock Item Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: '700' }}>#{item.id}</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>{item.code}</div>
                </td>
                <td style={{ fontWeight: '600' }}>{item.name}</td>
                <td>
                  {item.qty} units 
                  {item.qty > 0 && item.qty < 10 && <span className="low-stock-warning">Low Stock</span>}
                </td>
                <td>
                  <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link to={`/admin/stock/view/${item.id}`} className="action-link">View</Link>
                  <Link to={`/admin/stock/edit/${item.id}`} className="action-link">Edit</Link>
                  <button className="action-link delete-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default StockList;