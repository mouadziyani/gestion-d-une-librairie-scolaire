import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePlus } from "lucide-react";
import { api } from "@/shared/services/api";

const INITIAL_ITEM = { id: 1, name: "", qty: 1, price: 0 };

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} DH`;
}

function AdminInvoiceCreate() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [schools, setSchools] = useState([]);
  const [items, setItems] = useState([INITIAL_ITEM]);
  const [form, setForm] = useState({
    user_id: "",
    school_id: "",
    invoice_number: "",
    issued_at: new Date().toISOString().slice(0, 10),
    status: "unpaid",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [usersResponse, schoolsResponse] = await Promise.all([
          api.get("/admin/users"),
          api.get("/schools"),
        ]);

        if (active) {
          setClients(Array.isArray(usersResponse.data?.data) ? usersResponse.data.data : []);
          setSchools(Array.isArray(schoolsResponse.data?.data) ? schoolsResponse.data.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load invoice options.");
        }
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0),
    [items]
  );

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  };

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleItemChange(id, field, value) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "name" ? value : value === "" ? "" : Number(value),
            }
          : item
      )
    );
  }

  async function handleSubmit(event, overrideStatus = null) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...form,
        status: overrideStatus || form.status,
        school_id: form.school_id || null,
        invoice_number: form.invoice_number || null,
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: Number(item.qty || 0),
          price: Number(item.price || 0),
        })),
      };

      await api.post("/invoices", payload);
      navigate("/AdminInvoiceList");
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;
      const firstValidationError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
      setError(firstValidationError || err?.response?.data?.message || "Failed to create invoice.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-invoice-container">
      <header style={{ marginBottom: '40px' }}>
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Admin Area</p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem' }}>Create New Invoice.</h2>
      </header>

      <div className="create-card">
        <form onSubmit={(event) => handleSubmit(event)}>
          {/* Section 1: Basic Info */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Client / School Name</label>
              <select name="user_id" value={form.user_id} onChange={handleFormChange} required>
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Reference Code</label>
              <input
                type="text"
                name="invoice_number"
                placeholder="INV-2026-XXXX"
                value={form.invoice_number}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" name="issued_at" value={form.issued_at} onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Invoice Status</label>
              <select name="status" value={form.status} onChange={handleFormChange}>
                <option value="draft">Draft</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>School</label>
            <select name="school_id" value={form.school_id} onChange={handleFormChange}>
              <option value="">No school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="section-divider">
            <span>Invoice Items</span>
          </div>

          {/* Section 2: Dynamic Items List */}
          {items.map((item) => {
            const lineTotal = Number(item.qty || 0) * Number(item.price || 0);

            return (
            <div className="item-row-grid" key={item.id}>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Science Kit"
                  value={item.name}
                  onChange={(event) => handleItemChange(item.id, "name", event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(event) => handleItemChange(item.id, "qty", event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Price (DH)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(event) => handleItemChange(item.id, "price", event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px' }}>Total</label>
                <input type="text" disabled value={formatMoney(lineTotal)} style={{ background: '#f5f5f5' }} />
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', paddingBottom: '12px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
          })}

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

          <div style={{ textAlign: "right", marginBottom: "22px" }}>
            <p style={{ margin: "0 0 6px", color: "#888", fontSize: "13px" }}>Grand Total</p>
            <h3 style={{ margin: 0, fontFamily: "Fraunces", fontSize: "2rem" }}>{formatMoney(grandTotal)}</h3>
          </div>

          {error ? <p className="form-alert form-alert-error">{error}</p> : null}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-base btn-outline"
              disabled={submitting}
              onClick={(event) => handleSubmit(event, "draft")}
            >
              Save as Draft
            </button>
            <button type="submit" className="btn-base btn-primary" disabled={submitting}>
              <FilePlus size={18} /> Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminInvoiceCreate;
