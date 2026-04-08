import React from "react";

function ModeratorLayout() {
  return (
    <div>
      <header>
        <h1>Library BOUGDIM</h1>
        <h2>Moderator Layout</h2>
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
        <p>Library BOUGDIM - Layout Footer</p>
      </footer>
    </div>
  );
}

export default ModeratorLayout;
