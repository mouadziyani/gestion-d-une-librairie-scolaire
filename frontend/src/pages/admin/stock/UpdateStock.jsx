import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createStockEntry, getStockEntry, getStockOverview, updateStockEntry } from "../../../services/stockService";

const reasonOptions = [
  { value: "restock", label: "New Shipment Received" },
  { value: "sale", label: "Sales Correction" },
  { value: "damage", label: "Damaged Goods" },
  { value: "return", label: "Return from Customer" },
  { value: "adjustment", label: "Manual Adjustment" },
];

function UpdateStock() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const successPath = isModeratorRoute ? "/moderator/stock-history" : "/StockHistory";
  const areaLabel = isModeratorRoute ? "MODERATOR / STOCK CONTROL" : "ADMIN / STOCK CONTROL";
  const productIdFromQuery = searchParams.get("id");
  const movementId = searchParams.get("movement_id");
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(productIdFromQuery || "");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("active");
  const [reason, setReason] = useState("restock");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStock() {
      try {
        const data = movementId ? await getStockEntry(movementId) : await getStockOverview();
        if (!active) {
          return;
        }

        if (movementId && data?.product) {
          setItems([
            {
              product_id: data.product.id,
              name: data.product.name,
              code: data.product.reference || data.product.slug,
              quantity: Number(data.product.stock || 0),
              status: data.product.status || "active",
              low_stock: Number(data.product.stock || 0) <= Number(data.product.min_stock || 0),
            },
          ]);
          setSelectedProductId(String(data.product.id));
          setQuantity(String(data.quantity ?? ""));
          setReason(data.type || "restock");
          setNote(data.note || "");
          setStatus(data.product.status || "active");
          return;
        }

        const normalizedItems = Array.isArray(data.items) ? data.items : [];
        setItems(normalizedItems);

        if (!productIdFromQuery && normalizedItems[0]) {
          setSelectedProductId(String(normalizedItems[0].product_id));
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load stock products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStock();

    return () => {
      active = false;
    };
  }, [productIdFromQuery, movementId]);

  const selectedItem = useMemo(() => {
    return items.find((item) => String(item.product_id) === String(selectedProductId)) || null;
  }, [items, selectedProductId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const numericQuantity = Number(quantity);

    try {
      const payload = {
        product_id: Number(selectedProductId),
        quantity: numericQuantity,
        type: reason,
        status,
        note: note.trim() || `${reasonOptions.find((option) => option.value === reason)?.label || reason}`,
      };

      if (movementId) {
        await updateStockEntry(movementId, payload);
      } else {
        await createStockEntry(payload);
      }

      navigate(successPath);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update inventory.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="stock-update-container">
        <div className="stock-card" />
      </div>
    );
  }

  return (
    <div className="stock-update-container">
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#888", fontWeight: "700" }}>
          {areaLabel}
        </span>
      </header>

      <div className="stock-card">
        <h2>Update Inventory</h2>

        {error && (
          <div style={{ marginBottom: "16px", color: "#b91c1c", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="current-stock-badge">
          <span>Currently in Stock</span>
          <strong>{selectedItem ? `${Number(selectedItem.quantity || 0)} Units` : "0 Units"}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          {!productIdFromQuery && (
            <div className="update-field-group">
              <label htmlFor="product">Product</label>
              <select
                id="product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
              >
                {items.map((item) => (
                  <option key={item.product_id} value={item.product_id}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="update-field-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              value={selectedItem?.name || ""}
              disabled
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          </div>

          <div className="update-field-group">
            <label htmlFor="code">Barcode / SKU</label>
            <input
              type="text"
              id="code"
              value={selectedItem?.code || ""}
              disabled
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div className="update-field-group">
            <label htmlFor="quantity">Add / Remove Stock</label>
            <input
              type="text"
              id="quantity"
              placeholder="e.g. +50 or -10"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

            <div className="update-field-group">
              <label htmlFor="status">Availability</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="update-field-group">
            <label htmlFor="reason">Reason for Update</label>
            <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="update-field-group">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for this stock adjustment"
            />
          </div>

          <button type="submit" className="btn-update-stock" disabled={saving || !selectedProductId}>
            {saving ? "Saving..." : "Confirm Update"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
        Inventory logs are tracked for security.
      </p>
    </div>
  );
}

export default UpdateStock;
