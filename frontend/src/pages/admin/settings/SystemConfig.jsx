import { useEffect, useState } from "react";
import { DEFAULT_PREFERENCES, getSitePreferences, saveSitePreferences } from "../../../services/sitePreferencesService";

const PUBLIC_PAGE_OPTIONS = [
  { key: "home", label: "Home" },
  { key: "products", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "specialOrder", label: "Special Order" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
  { key: "support", label: "Support" },
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];

function SystemConfig() {
  const preferences = getSitePreferences();
  const [publicPages, setPublicPages] = useState(preferences.publicPages || DEFAULT_PREFERENCES.publicPages);
  const [system, setSystem] = useState(preferences.system || DEFAULT_PREFERENCES.system);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handlePreferencesChange() {
      const next = getSitePreferences();
      setPublicPages(next.publicPages || DEFAULT_PREFERENCES.publicPages);
      setSystem(next.system || DEFAULT_PREFERENCES.system);
    }

    handlePreferencesChange();
    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  function handlePublicToggle(key) {
    setSaved(false);
    setError("");
    setPublicPages((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleSystemToggle(key) {
    setSaved(false);
    setError("");
    setSystem((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveSitePreferences({
        ...getSitePreferences(),
        publicPages,
        system,
      });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save system settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="config-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SETTINGS</span>
          <h1 className="page-shell-title">System Configuration</h1>
          <p className="page-shell-subtitle">Control public page visibility and system switches.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="config-section">
          <h3>Public Pages Visibility</h3>
          <div className="config-grid">
            {PUBLIC_PAGE_OPTIONS.map((page) => (
              <label key={page.key} className="toggle-group">
                <div className="toggle-info">
                  <h4>{page.label}</h4>
                  <p>Show this entry in the public navbar pages list.</p>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={publicPages[page.key] !== false}
                  onChange={() => handlePublicToggle(page.key)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="config-section">
          <h3>System Switches</h3>
          <label className="toggle-group">
            <div className="toggle-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to admin logins.</p>
            </div>
            <input type="checkbox" className="switch-input" checked={system.twoFactor} onChange={() => handleSystemToggle("twoFactor")} />
          </label>

          <label className="toggle-group">
            <div className="toggle-info">
              <h4>Maintenance Mode</h4>
              <p>Disable the public front-end while making changes.</p>
            </div>
            <input type="checkbox" className="switch-input" checked={system.maintenance} onChange={() => handleSystemToggle("maintenance")} />
          </label>

          <label className="toggle-group" style={{ border: "none" }}>
            <div className="toggle-info">
              <h4>New User Registration</h4>
              <p>Allow new customers to create accounts.</p>
            </div>
            <input type="checkbox" className="switch-input" checked={system.registration} onChange={() => handleSystemToggle("registration")} />
          </label>
        </section>

        {error ? <p className="form-alert form-alert-error">{error}</p> : null}
        {saved ? <p className="form-alert form-alert-success">System settings saved successfully.</p> : null}

        <button type="submit" className="btn-save-config" disabled={saving}>
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </form>
    </div>
  );
}

export default SystemConfig;
