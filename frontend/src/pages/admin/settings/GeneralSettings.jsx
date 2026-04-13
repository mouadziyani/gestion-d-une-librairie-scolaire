import React from "react";

function GeneralSettings() {
  return (
    <div className="settings-container">
      <header style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#888', letterSpacing: '2px' }}>
          ADMIN / CONFIGURATION
        </span>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.8rem', marginTop: '10px' }}>General Settings</h1>
      </header>

      <div className="settings-card">
        <form onSubmit={(e) => e.preventDefault()}>
          
          
          <section className="settings-group">
            <h3>Library Identity</h3>
            <div className="settings-form-grid">
              <div className="settings-input-wrapper">
                <label>Store Name</label>
                <input type="text" className="settings-field" defaultValue="Library BOUGDIM" />
              </div>
              <div className="settings-input-wrapper">
                <label>Legal Name</label>
                <input type="text" className="settings-field" defaultValue="S.A.R.L. Bougdim & Co" />
              </div>
            </div>
          </section>

          
          <section className="settings-group">
            <h3>Contact & Location</h3>
            <div className="settings-form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="settings-input-wrapper">
                <label>Full Address (Google Maps)</label>
                <input type="text" className="settings-field" defaultValue="BD HASSAN II NR 07 ELAIOUN SIDI MELLOUK" />
              </div>
            </div>
            <div className="settings-form-grid" style={{ marginTop: '20px' }}>
              <div className="settings-input-wrapper">
                <label>Public Email</label>
                <input type="email" className="settings-field" defaultValue="contact@bougdim.com" />
              </div>
              <div className="settings-input-wrapper">
                <label>Phone Number</label>
                <input type="text" className="settings-field" defaultValue="+212 536 XX XX XX" />
              </div>
            </div>
          </section>

          
          <section className="settings-group">
            <h3>Security Preferences</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
              <input type="checkbox" id="twoFactor" style={{ width: '18px', height: '18px' }} defaultChecked />
              <div>
                <label htmlFor="twoFactor" style={{ fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  Enable Multi-Factor Authentication
                </label>
                <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>
                  Protect your admin dashboard with a second security step.
                </p>
              </div>
            </div>
          </section>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="submit" className="btn-save-settings">
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneralSettings;