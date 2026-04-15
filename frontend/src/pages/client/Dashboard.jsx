import React from "react";
import Table from "../../components/Table"; 
import Button from "../../components/Button";
import { ShoppingBag, FileText, CreditCard, Box } from "lucide-react";

function DashboardClient() {
  // Stats k-t-hem l-client (Orders, Unpaid Invoices, Loyalty Points)
  const clientStats = [
    { title: "Current Orders", value: "03", icon: <Box size={20} />, color: "#1a1a1a" },
    { title: "Pending Invoices", value: "01", icon: <FileText size={20} />, color: "#ff4757" },
    { title: "Total Spent", value: "2,450 DH", icon: <CreditCard size={20} />, color: "#2ecc71" },
  ];

  const orderColumns = ["Order ID", "Items", "Status", "Total"];
  const orderData = [
    { id: "#ORD-9921", items: "5 Books", status: <span className="status-pill status-shipped">In Transit</span>, total: "320.00 DH" },
    { id: "#ORD-9910", items: "12 Pens, 2 Notebooks", status: <span className="status-pill status-delivered">Delivered</span>, total: "150.00 DH" },
  ];

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '40px' }}>
        <p style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Welcome back, Mouad</p>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem' }}>Client Space.</h1>
      </header>

      {/* Stats Cards Section */}
      <section className="stats-grid">
        {clientStats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div style={{ marginBottom: '15px', color: stat.color }}>{stat.icon}</div>
            <h4>{stat.title}</h4>
            <div className="number">{stat.value}</div>
          </div>
        ))}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        {/* Recent Orders Section */}
        <section>
          <div className="section-title">
            My Recent Orders
            <Button variant="outline" size="sm">Track All</Button>
          </div>
          <div className="table-scroll">
            <Table 
              columns={orderColumns} 
              data={orderData} 
              actions={(item) => (
                <button title="View Details" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👁️</button>
              )}
            />
          </div>
        </section>

        {/* Support or Quick Actions */}
        <section>
          <div className="section-title">Support & Help</div>
          <div className="stat-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
             <ShoppingBag size={40} color="#eee" style={{ marginBottom: '15px' }} />
             <h3 style={{ marginBottom: '10px' }}>Need help with an order?</h3>
             <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
               Our team in El Aïoun is available from 09:00 to 19:00.
             </p>
             <Button variant="outline" style={{ width: '100%' }}>Contact Library</Button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default DashboardClient;