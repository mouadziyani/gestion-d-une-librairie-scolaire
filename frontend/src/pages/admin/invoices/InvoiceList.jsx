import React, { useState } from "react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, Edit3, Trash2, Filter } from "lucide-react";

function AdminInvoiceList() {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = ["ID", "Client", "Invoice Name", "Date", "Status", "Amount", "Actions"];
  
  const data = [
    { 
      id: "#001", 
      client: "Mouad Ziyani", 
      name: "Standard Pack", 
      date: "2026-04-14", 
      status: <span className="status-pill status-delivered">Paid</span>,
      amount: "150.00 DH"
    },
    { 
      id: "#002", 
      client: "Ecole Al-Amal", 
      name: "Exam Supplies", 
      date: "2026-04-12", 
      status: <span className="status-pill status-pending">Pending</span>,
      amount: "2,400.00 DH"
    }
  ];

  return (
    <div className="admin-list-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <p style={{ color: '#888', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Operations
          </p>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem', margin: 0 }}>Invoice Archive.</h2>
        </div>
        <Link to="/AdminInvoiceCreate" style={{ textDecoration: 'none' }}>
          <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> New Invoice
          </Button>
        </Link>
      </header>

      {/* Admin Toolbar */}
      <section className="admin-toolbar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="Search by ID, client or invoice..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px' }}>
            <Filter size={16} /> Filter by:
          </div>
          <select>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
          <select>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Highest Amount</option>
          </select>
        </div>
      </section>

      {/* Main Table */}
      <section className="admin-table-card">
        <Table 
          columns={columns} 
          data={data} 
          actions={(item) => (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button title="View" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1a1a1a' }}>
                <Eye size={18} />
              </button>
              <button title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1a1a1a' }}>
                <Edit3 size={18} />
              </button>
              <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4757' }}>
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </section>
      
      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        Showing {data.length} invoices in total.
      </footer>
    </div>
  );
}

export default AdminInvoiceList;