import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getSitePreferences, saveSitePreferences } from "../../../services/sitePreferencesService";

function GeneralSettings() {
  const { user } = useContext(AuthContext);
  const roleSlug = user?.role?.slug;
  const preferences = getSitePreferences();
  const [form, setForm] = useState({
    storeName: "Library BOUGDIM",
    legalName: "S.A.R.L. Bougdim & Co",
    address: "BD HASSAN II NR 07 ELAIOUN SIDI MELLOUK",
    email: "contact@bougdim.com",
    phone: "+212 536 66 66 66",
    ...preferences.general,
  });
  const [landingSections, setLandingSections] = useState(preferences.landingSections || {});
  const [footer, setFooter] = useState(preferences.footer || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handlePreferencesChange() {
      const next = getSitePreferences();
      setForm({
        storeName: "Library BOUGDIM",
        legalName: "S.A.R.L. Bougdim & Co",
        address: "BD HASSAN II NR 07 ELAIOUN SIDI MELLOUK",
        email: "contact@bougdim.com",
        phone: "+212 536 66 66 66",
        ...next.general,
      });
      setLandingSections(next.landingSections || {});
      setFooter(next.footer || {});
    }

    handlePreferencesChange();
    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setSaved(false);
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSectionToggle(key) {
    setSaved(false);
    setError("");
    setLandingSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleFooterFieldChange(event) {
    const { name, value } = event.target;
    setSaved(false);
    setError("");
    setFooter((current) => ({ ...current, [name]: value }));
  }

  function handleFooterToggle(key) {
    setSaved(false);
    setError("");
    setFooter((current) => ({
      ...current,
      columns: {
        ...(current.columns || {}),
        [key]: !(current.columns || {})[key],
      },
    }));
  }

  function handleFooterPageToggle(key) {
    setSaved(false);
    setError("");
    setFooter((current) => ({
      ...current,
      publicPages: {
        ...(current.publicPages || {}),
        [key]: !(current.publicPages || {})[key],
      },
    }));
  }

  function handleFooterLabelChange(key, value) {
    setSaved(false);
    setError("");
    setFooter((current) => ({
      ...current,
      columnLabels: {
        ...(current.columnLabels || {}),
        [key]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveSitePreferences({
        ...getSitePreferences(),
        general: form,
        landingSections,
        footer,
      });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-container">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">{roleSlug === "moderator" ? "MODERATOR / HOME" : "ADMIN / CONFIGURATION"}</span>
          <h1 className="page-shell-title">{roleSlug === "moderator" ? "Home Settings" : "General Settings"}</h1>
          <p className="page-shell-subtitle">
            {roleSlug === "moderator"
              ? "Control which homepage sections are visible on the public landing page."
              : "Store identity, contact details, and landing page sections."}
          </p>
        </div>
      </header>

      <div className="settings-card">
        <form onSubmit={handleSubmit}>
          {roleSlug === "admin" ? (
            <>
              <section className="settings-group">
                <h3>Library Identity</h3>
                <div className="settings-form-grid">
                  <div className="settings-input-wrapper">
                    <label htmlFor="storeName">Store Name</label>
                    <input id="storeName" name="storeName" type="text" className="settings-field" value={form.storeName} onChange={handleFieldChange} />
                  </div>
                  <div className="settings-input-wrapper">
                    <label htmlFor="legalName">Legal Name</label>
                    <input id="legalName" name="legalName" type="text" className="settings-field" value={form.legalName} onChange={handleFieldChange} />
                  </div>
                </div>
              </section>

              <section className="settings-group">
                <h3>Contact & Location</h3>
                <div className="settings-form-grid single-column">
                  <div className="settings-input-wrapper">
                    <label htmlFor="address">Full Address</label>
                    <input id="address" name="address" type="text" className="settings-field" value={form.address} onChange={handleFieldChange} />
                  </div>
                </div>
                <div className="settings-form-grid" style={{ marginTop: "20px" }}>
                  <div className="settings-input-wrapper">
                    <label htmlFor="email">Public Email</label>
                    <input id="email" name="email" type="email" className="settings-field" value={form.email} onChange={handleFieldChange} />
                  </div>
                  <div className="settings-input-wrapper">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="text" className="settings-field" value={form.phone} onChange={handleFieldChange} />
                  </div>
                </div>
              </section>
            </>
          ) : null}

          <section className="settings-group">
            <h3>Homepage Sections</h3>
            <div className="toggle-stack">
              {[
                ["hero", "Hero Banner", "Main landing banner and call-to-action."],
                ["features", "Features Strip", "Fast delivery, payments, and partner school message."],
                ["featuredEssentials", "Featured Essentials", "Highlighted products on the homepage."],
                ["discountBanner", "Discount Banner", "Promotional banner for active offers and savings."],
                ["bestSellers", "Best Sellers", "Top products based on order activity."],
                ["categoryHighlights", "Category Highlights", "Category cards and quick browsing entry points."],
                ["brandStory", "Brand Story", "Introductory store story block."],
                ["schoolPartners", "School Partners", "Block for school partnerships and services."],
                ["callToAction", "Call To Action", "Special order invitation section."],
              ].map(([key, title, description]) => (
                <label key={key} className="toggle-group">
                  <div className="toggle-info">
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="switch-input"
                    checked={landingSections[key] !== false}
                    onChange={() => handleSectionToggle(key)}
                  />
                </label>
              ))}
            </div>
          </section>

          {roleSlug === "admin" ? (
            <section className="settings-group">
              <h3>Footer Settings</h3>
              <div className="settings-form-grid">
                <div className="settings-input-wrapper">
                  <label htmlFor="footerBrandTitle">Footer Brand Title</label>
                  <input
                    id="footerBrandTitle"
                    name="brandTitle"
                    type="text"
                    className="settings-field"
                    value={footer.brandTitle || ""}
                    onChange={handleFooterFieldChange}
                  />
                </div>
                <div className="settings-input-wrapper">
                  <label htmlFor="footerBrandDescription">Footer Description</label>
                  <input
                    id="footerBrandDescription"
                    name="brandDescription"
                    type="text"
                    className="settings-field"
                    value={footer.brandDescription || ""}
                    onChange={handleFooterFieldChange}
                  />
                </div>
              </div>

              <div className="toggle-stack" style={{ marginTop: "20px" }}>
                {[
                  ["enabled", "Show Footer", "Display the footer on all public pages."],
                ].map(([key, title, description]) => (
                  <label key={key} className="toggle-group">
                    <div className="toggle-info">
                      <h4>{title}</h4>
                      <p>{description}</p>
                    </div>
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={footer[key] !== false}
                      onChange={() => setFooter((current) => ({ ...current, [key]: !(current[key] !== false) }))}
                    />
                  </label>
                ))}
              </div>

              <div className="settings-form-grid" style={{ marginTop: "20px" }}>
                {[
                  ["explore", "Explore Column"],
                  ["support", "Support Column"],
                  ["office", "Office Column"],
                ].map(([key, title]) => (
                  <label key={key} className="toggle-group">
                    <div className="toggle-info">
                      <h4>{title}</h4>
                      <p>Show or hide this footer column.</p>
                    </div>
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={(footer.columns || {})[key] !== false}
                      onChange={() => handleFooterToggle(key)}
                    />
                  </label>
                ))}
              </div>

              <div className="settings-form-grid" style={{ marginTop: "20px" }}>
                <div className="settings-input-wrapper">
                  <label htmlFor="footerExploreLabel">Explore Label</label>
                  <input
                    id="footerExploreLabel"
                    type="text"
                    className="settings-field"
                    value={footer.columnLabels?.explore || "Explore"}
                    onChange={(event) => handleFooterLabelChange("explore", event.target.value)}
                  />
                </div>
                <div className="settings-input-wrapper">
                  <label htmlFor="footerSupportLabel">Support Label</label>
                  <input
                    id="footerSupportLabel"
                    type="text"
                    className="settings-field"
                    value={footer.columnLabels?.support || "Support"}
                    onChange={(event) => handleFooterLabelChange("support", event.target.value)}
                  />
                </div>
                <div className="settings-input-wrapper">
                  <label htmlFor="footerOfficeLabel">Office Label</label>
                  <input
                    id="footerOfficeLabel"
                    type="text"
                    className="settings-field"
                    value={footer.columnLabels?.office || "Office"}
                    onChange={(event) => handleFooterLabelChange("office", event.target.value)}
                  />
                </div>
              </div>

              <div className="footer-pages-grid">
                {[
                  ["home", "Home"],
                  ["products", "Products"],
                  ["categories", "Categories"],
                  ["specialOrder", "Special Order"],
                  ["about", "About"],
                  ["contact", "Contact"],
                  ["support", "Support"],
                  ["login", "Login"],
                ].map(([key, title]) => (
                  <label key={key} className="permission-row">
                    <span>
                      <strong>{title}</strong>
                      <small>Show this page in the footer.</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={(footer.publicPages || {})[key] !== false}
                      onChange={() => handleFooterPageToggle(key)}
                    />
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          {error ? <p className="form-alert form-alert-error">{error}</p> : null}
          {saved ? <p className="form-alert form-alert-success">Settings saved successfully.</p> : null}

          <div className="settings-actions">
            <button type="submit" className="btn-save-settings" disabled={saving}>
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneralSettings;
