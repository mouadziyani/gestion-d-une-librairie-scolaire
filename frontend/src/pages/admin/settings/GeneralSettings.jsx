import React from "react";

function GeneralSettings() {
  return (
    <div>
      <h1>Library BOUGDIM</h1>
      <h2>General Settings</h2>
      <p>Section: Admin Area</p>
      <section>
        <h3>System Settings</h3>
        <form action="#">
          <fieldset>
            <legend>General</legend>
            <div>
              <label htmlFor="siteName">Site Name:</label><br />
              <input type="text" id="siteName" name="siteName" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Access</legend>
            <div>
              <input type="checkbox" id="twoFactor" />
              <label htmlFor="twoFactor"> Enable two-factor</label>
            </div>
          </fieldset>
          <div>
            <button type="submit">Save Settings</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default GeneralSettings;
