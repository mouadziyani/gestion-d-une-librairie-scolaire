import React from "react";

function CategoriesAdmin() {
  
  const categories = [
    { id: 1, name: "Textbooks", productCount: 450, status: "Active" },
    { id: 2, name: "School Supplies", productCount: 1200, status: "Active" },
    { id: 3, name: "Scientific Tools", productCount: 85, status: "Active" },
    { id: 4, name: "Literature", productCount: 320, status: "Archived" },
  ];

  return (
    <div className="categories-admin-wrapper">
      <header className="admin-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: '700', letterSpacing: '2px' }}>ADMIN PANEL</span>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', marginTop: '10px' }}>Categories</h1>
        </div>
        <button className="btn-filled">+ New Category</button>
      </header>

      
      <section className="category-stats-grid">
        <div className="stat-card">
          <h4>Total Categories</h4>
          <div className="count">12</div>
        </div>
        <div className="stat-card">
          <h4>Total Products</h4>
          <div className="count">2,055</div>
        </div>
        <div className="stat-card">
          <h4>Active Sections</h4>
          <div className="count">8</div>
        </div>
      </section>

      
      <section className="admin-table-area">
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Category Management</h3>
        <table className="cat-list-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Items Linked</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="cat-name">{cat.name}</td>
                <td><span className="cat-badge">{cat.productCount} Products</span></td>
                <td>
                  <span style={{ 
                    fontSize: '12px', 
                    color: cat.status === "Active" ? "#27ae60" : "#888" 
                  }}>
                    ● {cat.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginRight: '15px' }}>Edit</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', color: '#e74c3c' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default CategoriesAdmin;