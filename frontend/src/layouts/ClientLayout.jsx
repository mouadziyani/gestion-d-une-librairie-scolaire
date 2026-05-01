import React from "react";
import { useUiPreferences } from "@/shared/context/UIContext";

function ClientLayout() {
  const { t } = useUiPreferences();
  return (
    <div>
      <header>
        <h1>{t("common.brandName")}</h1>
        <h2>Client Layout</h2>
      </header>
      <nav aria-label="Layout Navigation">
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Management</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
      <main>
        <section>
          <h3>Main Content Area</h3>
          <p>Page content will be displayed here.</p>
        </section>
      </main>
      <footer>
        <p>{t("common.brandName")} - Layout Footer</p>
      </footer>
    </div>
  );
}

export default ClientLayout;
