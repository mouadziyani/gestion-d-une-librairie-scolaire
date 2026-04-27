import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES, getSitePreferences, saveSitePreferences } from "@/shared/services/sitePreferencesService";

const ROLE_DEFINITIONS = [
  {
    slug: "client",
    name: "Client",
    description: "Can browse the shop, place orders, and follow their own account pages.",
    pages: [
      { key: "dashboard", label: "Client Dashboard" },
      { key: "shop", label: "Shop" },
      { key: "cart", label: "Cart" },
      { key: "checkout", label: "Checkout" },
      { key: "orders", label: "Orders" },
      { key: "invoices", label: "Invoices" },
      { key: "wishlist", label: "Wishlist" },
      { key: "profile", label: "Profile" },
    ],
  },
  {
    slug: "moderator",
    name: "Moderator",
    description: "Can manage operational content without full admin access.",
    pages: [
      { key: "dashboard", label: "Moderator Dashboard" },
      { key: "products", label: "Products" },
      { key: "stock", label: "Stock" },
      { key: "orders", label: "Orders" },
      { key: "schools", label: "Schools" },
      { key: "invoices", label: "Invoices" },
      { key: "specialOrder", label: "Special Orders" },
      { key: "reports", label: "Reports" },
    ],
  },
  {
    slug: "admin",
    name: "Admin",
    description: "Full access to all operational, configuration, and management screens.",
    pages: [
      { key: "dashboard", label: "Admin Dashboard" },
      { key: "analytics", label: "Analytics" },
      { key: "products", label: "Products" },
      { key: "addProduct", label: "Add Product" },
      { key: "categories", label: "Categories" },
      { key: "stock", label: "Stock" },
      { key: "orders", label: "Orders" },
      { key: "addUser", label: "Add User" },
      { key: "users", label: "Users List" },
      { key: "schools", label: "Schools" },
      { key: "suppliers", label: "Suppliers" },
      { key: "invoices", label: "Invoices" },
      { key: "specialOrder", label: "Special Orders" },
      { key: "reports", label: "Reports" },
      { key: "rolesPermissions", label: "Roles & Permissions" },
      { key: "settings", label: "Settings" },
      { key: "systemConfig", label: "System Config" },
    ],
  },
];

function RolesPermissions() {
  const stored = getSitePreferences();
  const [rolePages, setRolePages] = useState(stored.rolePages || DEFAULT_PREFERENCES.rolePages);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handlePreferencesChange() {
      const next = getSitePreferences();
      setRolePages(next.rolePages || DEFAULT_PREFERENCES.rolePages);
    }

    handlePreferencesChange();
    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  const counts = useMemo(
    () =>
      ROLE_DEFINITIONS.map((role) => ({
        ...role,
        enabledCount: (rolePages[role.slug] || []).length,
        totalCount: role.pages.length,
      })),
    [rolePages],
  );

  function handleToggle(roleSlug, pageKey) {
    setSaved(false);
    setRolePages((current) => {
      const currentPages = current[roleSlug] || [];
      const nextPages = currentPages.includes(pageKey)
        ? currentPages.filter((item) => item !== pageKey)
        : [...currentPages, pageKey];

      return { ...current, [roleSlug]: nextPages };
    });
  }

  function handleReset(roleSlug) {
    setSaved(false);
    setRolePages((current) => ({
      ...current,
      [roleSlug]: DEFAULT_PREFERENCES.rolePages[roleSlug] || [],
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await saveSitePreferences({
        ...getSitePreferences(),
        rolePages,
      });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="roles-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SECURITY</span>
          <h1 className="page-shell-title">Roles & Permissions</h1>
          <p className="page-shell-subtitle">
            Control which pages appear in the dashboard and navbar menus for each role.
          </p>
        </div>
        <button type="button" className="btn-add-role" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}
      {saved ? <p className="form-alert form-alert-success">Permissions saved in browser preferences.</p> : null}

      <div className="roles-grid">
        {counts.map((role) => (
          <article className="roles-card" key={role.slug}>
            <div className="roles-card-header">
              <div>
                <h3>{role.name}</h3>
                <p>{role.description}</p>
              </div>
              <div className="roles-card-actions">
                <span className="role-counter">
                  {role.enabledCount}/{role.totalCount}
                </span>
                <button type="button" className="btn-link" onClick={() => handleReset(role.slug)}>
                  Reset
                </button>
              </div>
            </div>

            <div className="permissions-list">
              {role.pages.map((page) => (
                <label key={page.key} className="permission-row">
                  <span>
                    <strong>{page.label}</strong>
                    <small>{page.key}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={(rolePages[role.slug] || []).includes(page.key)}
                    onChange={() => handleToggle(role.slug, page.key)}
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default RolesPermissions;
