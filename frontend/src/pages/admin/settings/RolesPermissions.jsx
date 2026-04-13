import React from "react";

function RolesPermissions() {
  const roles = [
    { id: 1, name: "Super Admin", type: "super", p: { read: true, write: true, delete: true } },
    { id: 2, name: "Stock Manager", type: "editor", p: { read: true, write: true, delete: false } },
    { id: 3, name: "Staff Viewer", type: "viewer", p: { read: true, write: false, delete: false } },
  ];

  return (
    <div className="roles-wrapper">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', fontWeight: 'bold' }}>ADMIN / SECURITY</span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', marginTop: '10px' }}>Access Control</h2>
        </div>
        <button className="btn-add-role">+ Create New Role</button>
      </header>

      <section className="roles-card">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th style={{ textAlign: 'center' }}>View Shop</th>
              <th style={{ textAlign: 'center' }}>Edit Products</th>
              <th style={{ textAlign: 'center' }}>Manage Users</th>
              <th style={{ textAlign: 'center' }}>Delete Data</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{role.name}</div>
                  <span className={`role-badge role-${role.type}`}>{role.type}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" className="perm-checkbox" checked={role.p.read} readOnly />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" className="perm-checkbox" checked={role.p.write} readOnly />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" className="perm-checkbox" checked={role.type === 'super'} readOnly />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" className="perm-checkbox" checked={role.p.delete} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fff9db', borderRadius: '8px', border: '1px solid #ffe066' }}>
        <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
          <strong>Note:</strong> Permissions are applied instantly. Be careful when assigning <strong>Delete</strong> rights to new staff members.
        </p>
      </div>
    </div>
  );
}

export default RolesPermissions;