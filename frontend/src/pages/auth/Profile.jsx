import React from "react";
import ProfileImage from "../../assets/avatars/profile.jpg"; 

function Profile() {
  return (
    <div className="profile-wrapper">
      <div className="profile-grid">
        
        <aside className="profile-sidebar">
          <div className="profile-avatar-container">
            <img src={ProfileImage} alt="Admin" className="profile-img" />
            <button className="edit-avatar-btn" title="Change Avatar">+</button>
          </div>
          <h3 style={{ margin: '10px 0 5px', fontFamily: 'Fraunces, serif' }}>Mouad Ziyani</h3>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: '800', letterSpacing: '1px' }}>
            ADMINISTRATOR
          </span>
        </aside>

        
        <main className="profile-main-card">
          <form onSubmit={(e) => e.preventDefault()}>
            
            
            <section>
              <h2 className="profile-section-title">Personal Information</h2>
              <div className="form-row">
                <div>
                  <label className="profile-label">Full Name</label>
                  <input type="text" className="profile-input" defaultValue="Mouad Ziyani" />
                </div>
                <div>
                  <label className="profile-label">Email Address</label>
                  <input type="email" className="profile-input" defaultValue="contact@mouadziyani.com" />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="profile-label">Phone Number</label>
                  <input type="text" className="profile-input" defaultValue="+212 6 00 00 00 00" />
                </div>
                <div>
                  <label className="profile-label">Full Address</label>
                  <input type="text" className="profile-input" defaultValue="BD HASSAN II NR 07, El Aioun Sidi Mellouk" />
                </div>
              </div>
            </section>

            
            <section style={{ marginTop: '40px' }}>
              <h2 className="profile-section-title">Security & Password</h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                Leave these fields blank if you don't want to change your password.
              </p>
              <div className="password-grid">
                <div>
                  <label className="profile-label">Current Password</label>
                  <input type="password" className="profile-input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="profile-label">New Password</label>
                  <input type="password" className="profile-input" placeholder="New Password" />
                </div>
                <div>
                  <label className="profile-label">Confirm New</label>
                  <input type="password" className="profile-input" placeholder="Confirm Password" />
                </div>
              </div>
            </section>

            
            <section style={{ marginTop: '40px' }}>
              <h2 className="profile-section-title">Saved Payment Methods</h2>
              <div className="payment-card-item">
                <div className="card-info">
                  <span className="card-brand-icon">visa</span>
                  <div>
                    <h4 style={{ margin: 0 }}>Visa ending in 4242</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Expires 12/28</p>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
              </div>
              <button style={{ background: 'none', border: '1px dashed #ccc', width: '100%', padding: '12px', borderRadius: '10px', color: '#666', cursor: 'pointer', fontSize: '13px' }}>
                + Add New Card
              </button>
            </section>

            
            <section className="danger-zone">
              <h3 style={{ color: '#c53030', marginTop: 0, fontSize: '1.2rem' }}>Danger Zone</h3>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px', lineHeight: '1.5' }}>
                Deleting your account is permanent. This will remove all your data from <strong>Library BOUGDIM</strong>.
              </p>
              <button type="button" className="btn-delete-account">
                Delete My Account
              </button>
            </section>

            <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
              <button type="submit" className="btn-update-profile">Update Profile</button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}

export default Profile;