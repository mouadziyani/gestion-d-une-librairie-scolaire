import React from "react";
import { useUiPreferences } from "@/shared/context/UIContext";

function AdminLayout() {
  const { t } = useUiPreferences();
  return (
    <div>
      <header>
        <h1>{t("common.brandName")}</h1>
        <h2>Admin Layout</h2>
      </header>
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

export default AdminLayout;
