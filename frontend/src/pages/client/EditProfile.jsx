import React, { useState } from "react";
import Button from "../../components/Button";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "Alex Example",
    email: "alex@example.com",
    status: "active"
  });

  return (
    <div className="profile-edit-wrapper">
      <header>
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Settings
        </p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem', marginBottom: '10px' }}>Edit Profile.</h2>
      </header>

      <div className="profile-grid">
        {/* Left Side: Avatar & Summary */}
        <aside className="profile-aside">
          <div className="profile-avatar-large">
            {formData.name.charAt(0)}
          </div>
          <h4 style={{ margin: '0 0 5px' }}>{formData.name}</h4>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>{formData.email}</p>
          <Button variant="outline" size="sm" style={{ width: '100%' }}>Change Photo</Button>
        </aside>

        {/* Right Side: Edit Form */}
        <main className="edit-card">
          <h3>Personal Information</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                disabled 
                style={{ cursor: 'not-allowed', opacity: 0.6 }}
              />
            </div>

            <div className="form-group">
              <label>Account Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <Button type="submit">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default EditProfile;