import React from "react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { Printer, Mail, CheckCircle, Clock, History, FileText } from "lucide-react";

function AdminInvoiceDetail() {
  const lineColumns = ["ID", "Item Name", "Qty", "Price", "Total"];
  const lineData = [
    { id: "001", name: "Science Encyclopedia", qty: 2, price: "150 DH", total: "300 DH" },
  ];

  return (
    <div className="admin-detail-container">
      {/* Main Invoice Section */}
      <main className="invoice-paper">
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: '2rem', margin: 0 }}>Library BOUGDIM</h1>
            <p style={{ color: '#888' }}>Invoice #001</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="status-tag">ACTIVE</span>
          </div>
        </header>

        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Billing Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>CLIENT</p>
              <p>Alex Example</p>
              <p>alex@example.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>DATE</p>
              <p>April 14, 2026</p>
            </div>
          </div>
        </section>

        <section>
          <Table columns={lineColumns} data={lineData} />
          <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #1a1a1a', paddingTop: '20px' }}>
            <p style={{ fontSize: '14px', color: '#888' }}>Total Amount</p>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: '2rem' }}>300.00 DH</h2>
          </div>
        </section>
      </main>

      {/* Admin Sidebar Section */}
      <aside className="admin-action-sidebar">
        <div className="sidebar-card">
          <h4>Quick Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant="outline" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Printer size={16} /> Print Invoice
            </Button>
            <Button variant="outline" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Mail size={16} /> Send to Client
            </Button>
            <Button style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <CheckCircle size={16} /> Mark as Paid
            </Button>
          </div>
        </div>

        <div className="sidebar-card">
          <h4><History size={14} /> Recent Activity</h4>
          <ul className="activity-feed">
            <li className="activity-item">
              <p style={{ margin: 0, fontWeight: 'bold' }}>Invoice Created</p>
              <small style={{ color: '#888' }}>Today, 10:00 AM</small>
            </li>
            <li className="activity-item" style={{ border: 'none' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Viewed by Client</p>
              <small style={{ color: '#888' }}>Today, 11:30 AM</small>
            </li>
          </ul>
        </div>

        <div className="sidebar-card">
          <h4><FileText size={14} /> Linked Documents</h4>
          <p style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'underline', cursor: 'pointer' }}>
            Delivery_Note_001.pdf
          </p>
        </div>
      </aside>
    </div>
  );
}

export default AdminInvoiceDetail;