import React from "react";

function SystemConfig() {
  return (
    <div className="config-wrapper">
      <header style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', fontWeight: 'bold' }}>
          ADMIN / SETTINGS
        </span>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', marginTop: '10px' }}>System Configuration</h2>
      </header>

      <form action="#" onSubmit={(e) => e.preventDefault()}>
        
        <section className="config-section">
          <h3>⚙️ General Settings</h3>
          <div className="config-grid">
            <div className="input-group">
              <label htmlFor="siteName" style={{ fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>
                Store Name
              </label>
              <input 
                type="text" 
                id="siteName" 
                defaultValue="Library BOUGDIM" 
                style={{ width: '100%', padding: '12px', marginTop: '8px', border: '1px solid #eee', borderRadius: '6px' }}
              />
            </div>
            <div className="input-group">
              <label htmlFor="siteEmail" style={{ fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>
                Admin Notification Email
              </label>
              <input 
                type="email" 
                id="siteEmail" 
                defaultValue="contact@bougdim.com" 
                style={{ width: '100%', padding: '12px', marginTop: '8px', border: '1px solid #eee', borderRadius: '6px' }}
              />
            </div>
          </div>
        </section>

        
        <section className="config-section">
          <h3>🔒 Security & Access</h3>
          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to admin logins.</p>
            </div>
            <input type="checkbox" className="switch-input" id="twoFactor" />
          </div>

          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Maintenance Mode</h4>
              <p>Disable the public front-end while making changes.</p>
            </div>
            <input type="checkbox" className="switch-input" id="maintenance" />
          </div>

          <div className="toggle-group" style={{ border: 'none' }}>
            <div className="toggle-info">
              <h4>New User Registration</h4>
              <p>Allow new customers to create accounts.</p>
            </div>
            <input type="checkbox" className="switch-input" id="registration" defaultChecked />
          </div>
        </section>

        <button type="submit" className="btn-save-config">Save All Changes</button>
      </form>
    </div>
  );
}

export default SystemConfig;