import React from "react";
import Button from "../../components/Button";
import { School, FileText, ChevronRight, BarChart3 } from "lucide-react";

function AdminInvoiceBySchool() {
  const schoolGroups = [
    { name: "Ecole Al-Amal Nador", totalInvoices: 12, totalAmount: "45,200 DH", lastInvoice: "2026-04-10" },
    { name: "Institution Al-Majd", totalInvoices: 8, totalAmount: "18,900 DH", lastInvoice: "2026-03-28" },
    { name: "Groupe Scolaire El Aïoun", totalInvoices: 24, totalAmount: "102,450 DH", lastInvoice: "2026-04-12" },
  ];

  return (
    <div className="admin-wrapper">
      <header style={{ marginBottom: '40px' }}>
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Admin Management
        </p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem' }}>Invoices by School.</h2>
      </header>

      {/* Overview Section */}
      <section className="admin-stats-row">
        <div className="summary-box">
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase' }}>Total Receivables</p>
            <h3 style={{ fontSize: '2rem', fontFamily: 'Fraunces' }}>166,550 DH</h3>
          </div>
          <BarChart3 size={40} strokeWidth={1} />
        </div>
        
        <div className="summary-box light">
          <div>
            <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Partner Schools</p>
            <h3 style={{ fontSize: '2rem', fontFamily: 'Fraunces' }}>42 Schools</h3>
          </div>
          <School size={40} color="#eee" />
        </div>
      </section>

      {/* Schools List Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Fraunces' }}>Active School Accounts</h3>
          <Button variant="outline" size="sm">Export Report</Button>
        </div>

        <div className="school-list">
          {schoolGroups.map((school, index) => (
            <div className="school-group-card" key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '12px' }}>
                  <School size={24} />
                </div>
                <div className="school-meta">
                  <h4>{school.name}</h4>
                  <p>Last activity: {school.lastInvoice}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#bbb', fontWeight: 'bold' }}>INVOICES</p>
                  <p style={{ fontWeight: '700' }}>{school.totalInvoices}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#bbb', fontWeight: 'bold' }}>TOTAL REVENUE</p>
                  <p style={{ fontWeight: '700' }}>{school.totalAmount}</p>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminInvoiceBySchool;