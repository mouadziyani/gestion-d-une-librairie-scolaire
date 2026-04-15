import React from "react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";

function InvoiceDetail() {
  const invoiceLinesColumns = ["ID", "Item Name", "Quantity", "Price", "Total"];
  const invoiceLinesData = [
    { id: "001", name: "Cahier Selecta A4", qty: 10, price: "12.00 DH", total: "120.00 DH" },
    { id: "002", name: "Stylo BIC Blue (Pack 12)", qty: 2, price: "25.00 DH", total: "50.00 DH" },
  ];

  return (
    <div className="invoice-wrapper">
      {/* Header with Print/Download Actions */}
      <div className="invoice-header">
        <div className="brand-info">
          <h1>Library BOUGDIM</h1>
          <p>Client Area / Invoicing</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" size="sm" onClick={() => window.print()}>Print Invoice</Button>
          <Button size="sm">Download PDF</Button>
        </div>
      </div>

      {/* Primary Details Grid */}
      <section className="invoice-meta-grid">
        <div className="meta-item">
          <dt>Invoice ID</dt>
          <dd>#INV-2026-001</dd>
        </div>
        <div className="meta-item">
          <dt>Issue Date</dt>
          <dd>April 14, 2026</dd>
        </div>
        <div className="meta-item">
          <dt>Status</dt>
          <dd><span className="badge-active">Active</span></dd>
        </div>
        <div className="meta-item">
          <dt>Client Name</dt>
          <dd>Ecole El Aïoun</dd>
        </div>
      </section>

      {/* Invoice Items Table */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontFamily: 'Fraunces' }}>Invoice Lines</h3>
        <Table 
          columns={invoiceLinesColumns} 
          data={invoiceLinesData} 
          actions={(item) => (
            <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
          )}
        />
      </section>

      {/* Summary Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: '300px', borderTop: '2px solid #1a1a1a', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Subtotal</span>
            <strong>170.00 DH</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ color: '#888' }}>Tax (0%)</span>
            <strong>0.00 DH</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span style={{ fontFamily: 'Fraunces' }}>170.00 DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;