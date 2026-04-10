import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/logout");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>B.</h2>
        </div>
        <ul className="sidebar-nav">
          <li className="active">Dashboard</li>
          <li>Inventory</li>
          <li>Orders</li>
          <li>Users</li>
          <li>Settings</li>
        </ul>
        <div className="sidebar-footer">
          <li style={{listStyle: "none"}}>
            <button
              type="button"
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </li>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Library BOUGDIM</h1>
          <p>Admin Overview & Analytics</p>
        </header>

        {/* Quick Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <div className="value">1,245</div>
          </div>
          <div className="stat-card">
            <h4>Active Orders</h4>
            <div className="value">38</div>
          </div>
          <div className="stat-card">
            <h4>Low Stock</h4>
            <div className="value" style={{color: '#ff5e78'}}>12</div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <section className="table-container">
          <h3>Recent Activity</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#001</td>
                <td style={{fontWeight: '600'}}>The Great Gatsby</td>
                <td><span className="status-badge">Active</span></td>
                <td>
                  <a href="#" className="action-btn">Edit</a>
                  <a href="#" className="action-btn" style={{color: 'red'}}>Delete</a>
                </td>
              </tr>
              <tr>
                <td>#002</td>
                <td style={{fontWeight: '600'}}>1984 George Orwell</td>
                <td><span className="status-badge">Active</span></td>
                <td>
                  <a href="#" className="action-btn">Edit</a>
                  <a href="#" className="action-btn" style={{color: 'red'}}>Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
