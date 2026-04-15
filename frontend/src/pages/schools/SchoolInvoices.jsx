import React, { useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { Search, Filter, Eye, Download, Trash2 } from "lucide-react";

function SchoolInvoices() {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = ["ID", "Invoice Name", "Date", "Status", "Amount", "Actions"];
  
  const data = [
    { 
      id: "INV-001", 
      name: "Fournitures Scolaires Avril", 
      date: "2026-04-10", 
      status: <span className="status-tag">Active</span>,
      amount: "2,740.00 DH"
    },
    { 
      id: "INV-002", 
      name: "Lot de Manuels - Bac 2026", 
      date: "2026-03-25", 
      status: <span className="status-tag" style={{background: '#fff4e6', color: '#d9480f'}}>Pending</span>,
      amount: "1,200.00 DH"
    }
  ];

  return (
    <div className="school-page-wrapper">
      <header className="portal-title-box">
        <p>School Portal / Library BOUGDIM</p>
        <h2>School Invoices.</h2>
      </header>

      {/* Filter Section */}
      <section className="search-filter-grid">
        <div className="search-input-group" style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by ID or Invoice name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-select-group">
          <select id="status">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} /> Apply
        </Button>
      </section>

      {/* Table Section */}
      <section className="table-container-portal">
        <Table 
          columns={columns} 
          data={data} 
          actions={(item) => (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button title="View" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <Eye size={18} color="#1a1a1a" />
              </button>
              <button title="Download" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <Download size={18} color="#1a1a1a" />
              </button>
              <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <Trash2 size={18} color="#ff4757" />
              </button>
            </div>
          )}
        />
      </section>
    </div>
  );
}

export default SchoolInvoices;