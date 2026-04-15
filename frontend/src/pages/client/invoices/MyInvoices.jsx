import React, { useState } from "react";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";

function MyInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const invoiceColumns = ["ID", "Invoice Name", "Date", "Status", "Total"];
  
  const invoiceData = [
    { id: "001", name: "Facture Scolaire - Avril", date: "2026-04-10", status: "Active", total: "1,200.00 DH" },
    { id: "002", name: "Fournitures Bureautique", date: "2026-04-12", status: "Inactive", total: "450.00 DH" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  return (
    <div className="invoices-container">
      {/* Header Section */}
      <header className="page-header">
        <div>
          <p style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Area</p>
          <h2>My Invoices</h2>
        </div>
        <Button onClick={() => console.log("Create New Invoice")}>+ New Invoice</Button>
      </header>

      {/* Filter Section */}
      <section className="filters-bar">
        <div className="filter-item">
          <label>Search Invoices</label>
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-item">
          <Dropdown 
            label="Status" 
            options={statusOptions} 
            onChange={(e) => console.log(e.target.value)} 
          />
        </div>

        <div style={{ paddingBottom: '2px' }}>
          <Button variant="outline">Apply Filters</Button>
        </div>
      </section>

      {/* Table Section */}
      <section className="table-wrapper">
        <Table 
          columns={invoiceColumns} 
          data={invoiceData} 
          actions={(item) => (
            <div style={{ display: 'flex', gap: '15px', fontSize: '18px' }}>
              <button title="View" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👁️</button>
              <button title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
              <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
            </div>
          )}
        />
      </section>
    </div>
  );
}

export default MyInvoices;