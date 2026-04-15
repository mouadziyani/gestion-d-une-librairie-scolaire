import React, { useState } from "react";
import Button from "../../../components/Button";
import { Plus, Trash2, Save, FilePlus } from "lucide-react";

function AdminInvoiceCreate() {
  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="create-invoice-container">
      <header style={{ marginBottom: '40px' }}>
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Admin Area</p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem' }}>Create New Invoice.</h2>
      </header>

      <div className="create-card">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Basic Info */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Client / School Name</label>
              <input type="text" placeholder="Search school..." required />
            </div>
            <div className="form-group">
              <label>Reference Code</label>
              <input type="text" placeholder="INV-2026-XXXX" required />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" defaultValue="2026-04-14" />
            </div>
            <div className="form-group">
              <label>Invoice Status</label>
              <select>
                <option value="active">Active / Draft</option>
                <option value="pending">Pending Payment</option>
                <option value="inactive">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="section-divider">
            <span>Invoice Items</span>
          </div>

          {/* Section 2: Dynamic Items List */}
          {items.map((item, index) => (
            <div className="item-row-grid" key={item.id}>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Item Name</label>
                <input type="text" placeholder="e.g. Science Kit" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Qty</label>
                <input type="number" min="1" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Price (DH)</label>
                <input type="number" step="0.01" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Total</label>
                <input type="text" disabled value="0.00 DH" style={{ background: '#f5f5f5' }} />
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', paddingBottom: '12px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addItem}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'none', border: '1px dashed #ccc', 
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              marginTop: '10px', fontSize: '13px', fontWeight: '600'
            }}
          >
            <Plus size={16} /> Add Another Item
          </button>

          <div className="section-divider"></div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <Button variant="outline">Save as Draft</Button>
            <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilePlus size={18} /> Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminInvoiceCreate;