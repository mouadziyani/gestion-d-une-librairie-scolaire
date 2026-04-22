import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";

const statusClassMap = {
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
  completed: "status-completed",
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SpecialOrderDetails() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isModeratorRoute = location.pathname.startsWith("/moderator");
  const listPath = isModeratorRoute ? "/moderator/special-orders" : "/admin/special-orders";
  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const statusClass = statusClassMap[String(item?.status || "pending").toLowerCase()] || "status-pending";

  useEffect(() => {
    let active = true;

    async function loadItem() {
      try {
        const response = await api.get(`/special-orders/${id}`);
        if (active) {
          const data = response.data?.data ?? null;
          setItem(data);
          setForm(
            data
              ? {
                  user_id: data.user_id,
                  school_id: data.school_id ?? null,
                  item_name: data.item_name || "",
                  category_id: data.category_id ?? null,
                  quantity: data.quantity || 1,
                  details: data.details || "",
                  status: data.status || "pending",
                  admin_note: data.admin_note || "",
                }
              : null,
          );
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load special order.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!id) {
      setError("Missing special order id.");
      setLoading(false);
      return () => {};
    }

    loadItem();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSave(event) {
    event.preventDefault();
    if (!form || !item) {
      return;
    }

    setSaving(true);
    setError("");
    setSaved("");

    try {
      const response = await api.put(`/special-orders/${item.id}`, form);
      const data = response.data?.data ?? null;
      setItem(data);
      setForm(
        data
          ? {
              user_id: data.user_id,
              school_id: data.school_id ?? null,
              item_name: data.item_name || "",
              category_id: data.category_id ?? null,
              quantity: data.quantity || 1,
              details: data.details || "",
              status: data.status || "pending",
              admin_note: data.admin_note || "",
            }
          : form,
      );
      setSaved("Special order updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update special order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">{isModeratorRoute ? "MODERATOR" : "ADMIN"} / SPECIAL ORDERS</span>
          <h1 className="page-shell-title">Special Order Details</h1>
          <p className="page-shell-subtitle">Track the item request and its current state.</p>
        </div>
        <Link to={listPath} className="btn-archive">
          Back to list
        </Link>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}
      {saved ? <p className="form-alert form-alert-success">{saved}</p> : null}

      <section className="admin-card special-order-details-card">
        {loading ? <p className="page-shell-state">Loading special order...</p> : null}

        {!loading && !item ? <p className="page-shell-state">No special order found.</p> : null}

        {!loading && item ? (
          <form onSubmit={handleSave} className="special-order-details-form">
            <div className="special-order-details-hero">
              <div className="special-order-title-block">
                <span className="special-order-kicker">Request #{item.id}</span>
                <h2>{item.item_name || "Special order"}</h2>
                <p>{item.school?.name || "No school linked"}</p>
              </div>
              <span className={`status-pill special-status-pill ${statusClass}`}>{item.status || "pending"}</span>
            </div>

            <div className="special-order-info-grid">
              <div className="stat-item">
                <span>Item</span>
                <strong>{item.item_name || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Category</span>
                <strong>{item.category?.name || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Quantity</span>
                <strong>{item.quantity || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Created</span>
                <strong>{formatDate(item.created_at)}</strong>
              </div>
            </div>

            <div className="special-order-edit-panel">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="special-status">Status</label>
                  <select
                    id="special-status"
                    value={form.status}
                    onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="special-admin-note">Admin Note</label>
                  <input
                    id="special-admin-note"
                    type="text"
                    value={form.admin_note}
                    onChange={(e) => setForm((current) => ({ ...current, admin_note: e.target.value }))}
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="special-details">Details</label>
                <textarea
                  id="special-details"
                  rows="5"
                  value={form.details}
                  onChange={(e) => setForm((current) => ({ ...current, details: e.target.value }))}
                />
              </div>
            </div>

            <div className="special-order-hidden-fields" aria-hidden="true">
              <input type="number" value={form.user_id} readOnly />
              <input type="text" value={form.school_id ?? ""} readOnly />
              <input type="text" value={form.item_name} readOnly />
              <input type="text" value={form.category_id ?? ""} readOnly />
              <input type="number" value={form.quantity} readOnly />
            </div>

            <div className="special-order-actions">
              <button type="submit" className="btn-elegant" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <Link to={listPath} className="btn-archive">
                Back to list
              </Link>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}

export default SpecialOrderDetails;
