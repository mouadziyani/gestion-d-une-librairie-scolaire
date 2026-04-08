
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.cwd(), "src");
const pagesDir = path.join(root, "pages");
const componentsDir = path.join(root, "components");
const layoutsDir = path.join(root, "layouts");

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
};

const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const nameFromFile = (file) => {
  let base = path.basename(file, ".jsx");
  if (base[0] && base[0] === base[0].toLowerCase()) base = capitalize(base);
  return base;
};
const humanize = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const entityMap = [
  { key: /User/i, s: "User", p: "Users" },
  { key: /Product/i, s: "Product", p: "Products" },
  { key: /Order/i, s: "Order", p: "Orders" },
  { key: /Invoice/i, s: "Invoice", p: "Invoices" },
  { key: /School/i, s: "School", p: "Schools" },
  { key: /Supplier/i, s: "Supplier", p: "Suppliers" },
  { key: /Stock/i, s: "Stock Item", p: "Stock Items" },
  { key: /Category/i, s: "Category", p: "Categories" },
  { key: /SpecialOrder/i, s: "Special Order", p: "Special Orders" },
];
const entityFromName = (name) => {
  for (const m of entityMap) if (m.key.test(name)) return m;
  return { s: "Item", p: "Items" };
};
const areaLabel = (file) => {
  const parts = file.split(path.sep);
  const i = parts.findIndex((p) => p === "pages");
  const area = i >= 0 ? parts[i + 1] : "";
  if (area === "admin") return "Admin Area";
  if (area === "client") return "Client Area";
  if (area === "moderator") return "Moderator Area";
  if (area === "public") return "Public Area";
  if (area === "auth") return "Authentication";
  if (area === "errors") return "Error Pages";
  if (area === "notifications") return "Notifications";
  if (area === "schools") return "School Portal";
  return null;
};

const block = (lines) => lines.map((l) => `      ${l}`).join("\n");

const filters = (e) => [
  "<section>",
  "  <h3>Search and Filters</h3>",
  '  <form action="#">',
  "    <fieldset>",
  `      <legend>Filter ${e.p}</legend>`,
  "      <div>",
  '        <label htmlFor="search">Search:</label><br />',
  '        <input type="text" id="search" name="search" />',
  "      </div>",
  "      <div>",
  '        <label htmlFor="status">Status:</label><br />',
  '        <select id="status" name="status">',
  '          <option value="all">All</option>',
  '          <option value="active">Active</option>',
  '          <option value="inactive">Inactive</option>',
  "        </select>",
  "      </div>",
  "      <div>",
  '        <button type="submit">Apply Filters</button>',
  "      </div>",
  "    </fieldset>",
  "  </form>",
  "</section>",
];

const tableBlock = (e, label) => [
  "<section>",
  `  <h3>${label}</h3>`,
  "  <table>",
  "    <thead>",
  "      <tr>",
  "        <th>ID</th>",
  `        <th>${e.s} Name</th>`,
  "        <th>Status</th>",
  "        <th>Actions</th>",
  "      </tr>",
  "    </thead>",
  "    <tbody>",
  "      <tr>",
  "        <td>001</td>",
  `        <td>Sample ${e.s}</td>`,
  "        <td>Active</td>",
  "        <td>View | Edit | Delete</td>",
  "      </tr>",
  "    </tbody>",
  "  </table>",
  "</section>",
];

const detailBlock = (e) => [
  "<section>",
  `  <h3>${e.s} Details</h3>`,
  "  <dl>",
  "    <dt>ID</dt>",
  "    <dd>001</dd>",
  `    <dt>${e.s} Name</dt>`,
  `    <dd>Sample ${e.s}</dd>`,
  "    <dt>Status</dt>",
  "    <dd>Active</dd>",
  "  </dl>",
  "</section>",
  "<section>",
  "  <h3>Related Information</h3>",
  "  <ul>",
  "    <li>Recent activity</li>",
  "    <li>Linked documents</li>",
  "  </ul>",
  "</section>",
];

const formBlock = (e, action) => [
  "<section>",
  `  <h3>${action} ${e.s}</h3>`,
  '  <form action="#">',
  "    <fieldset>",
  `      <legend>${action} Details</legend>`,
  "      <div>",
  '        <label htmlFor="name">Name:</label><br />',
  '        <input type="text" id="name" name="name" required />',
  "      </div>",
  "      <div>",
  '        <label htmlFor="code">Code:</label><br />',
  '        <input type="text" id="code" name="code" required />',
  "      </div>",
  "      <div>",
  '        <label htmlFor="status">Status:</label><br />',
  '        <select id="status" name="status">',
  '          <option value="active">Active</option>',
  '          <option value="inactive">Inactive</option>',
  "        </select>",
  "      </div>",
  "      <div>",
  `        <button type="submit">${action}</button>`,
  "      </div>",
  "    </fieldset>",
  "  </form>",
  "</section>",
];
function pageBodyFor(file, name) {
  const title = humanize(name);
  const area = areaLabel(file);
  const e = entityFromName(name);
  const lc = name.toLowerCase();
  const lines = [];
  if (area) lines.push(`<p>Section: ${area}</p>`);

  if (lc.includes("dashboard")) {
    lines.push("<section>");
    lines.push("  <h3>Quick Stats</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Total Users: 1,245</li>");
    lines.push("    <li>Active Orders: 38</li>");
    lines.push("    <li>Low Stock Items: 12</li>");
    lines.push("  </ul>");
    lines.push("</section>");
    lines.push(...tableBlock(e, "Recent Activity"));
    lines.push("<section>");
    lines.push("  <h3>Charts</h3>");
    lines.push("  <p>Placeholder for charts</p>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("analytics") || lc.includes("report")) {
    lines.push("<section>");
    lines.push("  <h3>Report Filters</h3>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>Date Range</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="from">From:</label><br />');
    lines.push('        <input type="date" id="from" name="from" />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="to">To:</label><br />');
    lines.push('        <input type="date" id="to" name="to" />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <button type="submit">Run Report</button>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("  </form>");
    lines.push("</section>");
    lines.push(...tableBlock(e, "Report Results"));
    lines.push("<section>");
    lines.push("  <h3>Charts</h3>");
    lines.push("  <p>Placeholder for analytics charts</p>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("setting") || lc.includes("config") || lc.includes("roles")) {
    lines.push("<section>");
    lines.push("  <h3>System Settings</h3>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>General</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="siteName">Site Name:</label><br />');
    lines.push('        <input type="text" id="siteName" name="siteName" />');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("    <fieldset>");
    lines.push("      <legend>Access</legend>");
    lines.push("      <div>");
    lines.push('        <input type="checkbox" id="twoFactor" />');
    lines.push('        <label htmlFor="twoFactor"> Enable two-factor</label>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("    <div>");
    lines.push('      <button type="submit">Save Settings</button>');
    lines.push("    </div>");
    lines.push("  </form>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("profile")) {
    lines.push("<section>");
    lines.push("  <h3>Profile Summary</h3>");
    lines.push("  <dl>");
    lines.push("    <dt>Name</dt>");
    lines.push("    <dd>Alex Example</dd>");
    lines.push("    <dt>Email</dt>");
    lines.push("    <dd>alex@example.com</dd>");
    lines.push("  </dl>");
    lines.push("</section>");
    lines.push(...formBlock(e, "Update"));
    return { title, body: block(lines) };
  }

  if (lc.includes("login")) {
    lines.push("<section>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>Sign In</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="username">Username:</label><br />');
    lines.push('        <input type="text" id="username" name="username" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="password">Password:</label><br />');
    lines.push('        <input type="password" id="password" name="password" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <button type="submit">Login</button>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("  </form>");
    lines.push("</section>");
    lines.push('<p>Forgot your password? <a href="#">Reset it here</a></p>');
    return { title, body: block(lines) };
  }

  if (lc.includes("register")) {
    lines.push("<section>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>Create an Account</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="fullName">Full Name:</label><br />');
    lines.push('        <input type="text" id="fullName" name="fullName" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="email">Email:</label><br />');
    lines.push('        <input type="email" id="email" name="email" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="password">Password:</label><br />');
    lines.push('        <input type="password" id="password" name="password" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <button type="submit">Register</button>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("  </form>");
    lines.push("</section>");
    lines.push('<p>Already have an account? <a href="#">Login</a></p>');
    return { title, body: block(lines) };
  }

  if (lc.includes("forgot")) {
    lines.push("<section>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>Reset Link</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="email">Email:</label><br />');
    lines.push('        <input type="email" id="email" name="email" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <button type="submit">Send Link</button>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("  </form>");
    lines.push("</section>");
    lines.push('<p>Back to <a href="#">Login</a></p>');
    return { title, body: block(lines) };
  }

  if (lc.includes("reset")) {
    lines.push("<section>");
    lines.push('  <form action="#">');
    lines.push("    <fieldset>");
    lines.push("      <legend>Create a new password</legend>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="newPassword">New Password:</label><br />');
    lines.push('        <input type="password" id="newPassword" name="newPassword" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <label htmlFor="confirmPassword">Confirm Password:</label><br />');
    lines.push('        <input type="password" id="confirmPassword" name="confirmPassword" required />');
    lines.push("      </div>");
    lines.push("      <div>");
    lines.push('        <button type="submit">Reset Password</button>');
    lines.push("      </div>");
    lines.push("    </fieldset>");
    lines.push("  </form>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("cart")) {
    lines.push(...tableBlock(e, "Cart Items"));
    lines.push("<section>");
    lines.push("  <h3>Summary</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Subtotal: $40</li>");
    lines.push("    <li>Total: $45</li>");
    lines.push("  </ul>");
    lines.push('  <button type="button">Proceed to Checkout</button>');
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("checkout")) {
    lines.push(...formBlock(e, "Checkout"));
    lines.push("<section>");
    lines.push("  <h3>Order Summary</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Items: 3</li>");
    lines.push("    <li>Total: $45</li>");
    lines.push("  </ul>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("home")) {
    lines.push("<section>");
    lines.push("  <h3>Welcome</h3>");
    lines.push("  <p>Discover textbooks, supplies, and special orders.</p>");
    lines.push("</section>");
    lines.push("<section>");
    lines.push("  <h3>Featured Items</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Mathematics Grade 6</li>");
    lines.push("    <li>Science Starter Kit</li>");
    lines.push("  </ul>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("productdetail")) {
    lines.push("<section>");
    lines.push("  <h3>Product Overview</h3>");
    lines.push("  <p>Detailed description and usage.</p>");
    lines.push("</section>");
    lines.push("<section>");
    lines.push("  <h3>Actions</h3>");
    lines.push('  <button type="button">Add to Cart</button>');
    lines.push('  <button type="button">Add to Wishlist</button>');
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("products")) {
    lines.push(...filters(e));
    lines.push("<section>");
    lines.push("  <h3>Product List</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Product A - $10</li>");
    lines.push("    <li>Product B - $12</li>");
    lines.push("  </ul>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("orderdetail") || lc.includes("orderdetails")) {
    lines.push(...detailBlock(e));
    lines.push(...tableBlock(e, "Order Items"));
    return { title, body: block(lines) };
  }

  if (lc.includes("invoice") && lc.includes("detail")) {
    lines.push(...detailBlock(e));
    lines.push(...tableBlock(e, "Invoice Lines"));
    return { title, body: block(lines) };
  }

  if (lc.includes("notifications")) {
    lines.push("<section>");
    lines.push("  <h3>Notification Center</h3>");
    lines.push("  <ul>");
    lines.push("    <li>New order received</li>");
    lines.push("    <li>Stock level alert</li>");
    lines.push("  </ul>");
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("wishlist")) {
    lines.push("<section>");
    lines.push("  <h3>Wishlist Items</h3>");
    lines.push("  <ul>");
    lines.push("    <li>Book A</li>");
    lines.push("    <li>Science Kit</li>");
    lines.push("  </ul>");
    lines.push('  <button type="button">Move to Cart</button>');
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("notfound") || lc.includes("unauthorized") || lc.includes("servererror")) {
    lines.push("<section>");
    lines.push("  <h3>Page Status</h3>");
    lines.push("  <p>We could not load the requested page.</p>");
    lines.push('  <a href="#">Return to Home</a>');
    lines.push("</section>");
    return { title, body: block(lines) };
  }

  if (lc.includes("add") || lc.includes("create")) {
    lines.push(...formBlock(e, "Create"));
    return { title, body: block(lines) };
  }

  if (lc.includes("edit") || lc.includes("update")) {
    lines.push(...formBlock(e, "Update"));
    return { title, body: block(lines) };
  }

  if (lc.includes("detail")) {
    lines.push(...detailBlock(e));
    return { title, body: block(lines) };
  }

  if (lc.includes("list") || lc.includes("orders") || lc.includes("invoices")) {
    lines.push(...filters(e));
    lines.push(...tableBlock(e, `${e.p} Table`));
    return { title, body: block(lines) };
  }

  lines.push("<section>");
  lines.push("  <h3>Overview</h3>");
  lines.push("  <p>This section provides a summary of the page content.</p>");
  lines.push("</section>");
  lines.push("<section>");
  lines.push("  <h3>Details</h3>");
  lines.push("  <ul>");
  lines.push("    <li>Primary information</li>");
  lines.push("    <li>Secondary information</li>");
  lines.push("  </ul>");
  lines.push("</section>");
  return { title, body: block(lines) };
}

function writePage(file) {
  const name = nameFromFile(file);
  const { title, body } = pageBodyFor(file, name);
  const content = `import React from "react";\n\nfunction ${name}() {\n  return (\n    <div>\n      <h1>Library BOUGDIM</h1>\n      <h2>${title}</h2>\n${body}\n    </div>\n  );\n}\n\nexport default ${name};\n`;
  fs.writeFileSync(file, content, "utf8");
}

function writeComponent(file) {
  const name = nameFromFile(file);
  const title = humanize(name);
  const lower = name.toLowerCase();
  let body = "";
  if (lower.includes("nav")) {
    body = `      <nav aria-label="Primary">\n        <h3>${title}</h3>\n        <ul>\n          <li><a href=\"#\">Home</a></li>\n          <li><a href=\"#\">Products</a></li>\n          <li><a href=\"#\">Orders</a></li>\n          <li><a href=\"#\">Profile</a></li>\n        </ul>\n      </nav>`;
  } else if (lower.includes("footer")) {
    body = `      <footer>\n        <h3>${title}</h3>\n        <ul>\n          <li>Address: 123 Library Street</li>\n          <li>Phone: +212 000 000 000</li>\n          <li>Email: contact@bougdim.ma</li>\n        </ul>\n      </footer>`;
  } else if (lower.includes("header")) {
    body = `      <header>\n        <h1>Library BOUGDIM</h1>\n        <p>Manage schools, orders, and inventory.</p>\n      </header>`;
  } else if (lower.includes("button")) {
    body = `      <button type="button">${title}</button>`;
  } else if (lower.includes("card")) {
    body = `      <section>\n        <h3>${title}</h3>\n        <p>Short description for this card.</p>\n        <button type=\"button\">View Details</button>\n      </section>`;
  } else if (lower.includes("dropdown")) {
    body = `      <div>\n        <label htmlFor=\"${name}Select\">${title}:</label><br />\n        <select id=\"${name}Select\" name=\"${name}Select\">\n          <option value=\"one\">Option One</option>\n          <option value=\"two\">Option Two</option>\n        </select>\n      </div>`;
  } else if (lower.includes("filter")) {
    body = `      <form action="#">\n        <fieldset>\n          <legend>${title}</legend>\n          <div>\n            <label htmlFor=\"filter\">Keyword:</label><br />\n            <input type=\"text\" id=\"filter\" name=\"filter\" />\n          </div>\n          <div>\n            <button type=\"submit\">Apply</button>\n          </div>\n        </fieldset>\n      </form>`;
  } else if (lower.includes("breadcrumb")) {
    body = `      <nav aria-label="Breadcrumb">\n        <ol>\n          <li><a href=\"#\">Home</a></li>\n          <li><a href=\"#\">Section</a></li>\n          <li aria-current=\"page\">${title}</li>\n        </ol>\n      </nav>`;
  } else if (lower.includes("avatar")) {
    body = `      <figure>\n        <img src=\"avatar.png\" alt=\"User avatar\" />\n        <figcaption>Profile Avatar</figcaption>\n      </figure>`;
  } else if (lower.includes("loader")) {
    body = `      <div><p>Loading, please wait...</p></div>`;
  } else if (lower.includes("modal")) {
    body = `      <section>\n        <h3>${title}</h3>\n        <p>Modal placeholder for confirmations.</p>\n        <button type=\"button\">Confirm</button>\n        <button type=\"button\">Cancel</button>\n      </section>`;
  } else if (lower.includes("notification")) {
    body = `      <section>\n        <h3>${title}</h3>\n        <ul>\n          <li>New order received</li>\n          <li>Invoice generated</li>\n        </ul>\n      </section>`;
  } else if (lower.includes("pagination")) {
    body = `      <nav aria-label=\"Pagination\">\n        <ul>\n          <li><button type=\"button\">Previous</button></li>\n          <li><button type=\"button\">1</button></li>\n          <li><button type=\"button\">2</button></li>\n          <li><button type=\"button\">Next</button></li>\n        </ul>\n      </nav>`;
  } else if (lower.includes("productcard")) {
    body = `      <article>\n        <h3>${title}</h3>\n        <p>Short product description.</p>\n        <button type=\"button\">Add to Cart</button>\n      </article>`;
  } else if (lower.includes("report")) {
    body = `      <form action="#">\n        <fieldset>\n          <legend>${title}</legend>\n          <div>\n            <label htmlFor=\"reportRange\">Date Range:</label><br />\n            <input type=\"month\" id=\"reportRange\" name=\"reportRange\" />\n          </div>\n          <div>\n            <button type=\"submit\">Generate Report</button>\n          </div>\n        </fieldset>\n      </form>`;
  } else if (lower.includes("search")) {
    body = `      <form action="#">\n        <label htmlFor=\"searchInput\">Search:</label><br />\n        <input type=\"text\" id=\"searchInput\" name=\"searchInput\" />\n        <button type=\"submit\">Search</button>\n      </form>`;
  } else if (lower.includes("sidebar")) {
    body = `      <aside>\n        <h3>${title}</h3>\n        <ul>\n          <li><a href=\"#\">Dashboard</a></li>\n          <li><a href=\"#\">Users</a></li>\n          <li><a href=\"#\">Reports</a></li>\n        </ul>\n      </aside>`;
  } else if (lower.includes("sort")) {
    body = `      <form action="#">\n        <label htmlFor=\"sortBy\">Sort By:</label><br />\n        <select id=\"sortBy\" name=\"sortBy\">\n          <option value=\"name\">Name</option>\n          <option value=\"date\">Date</option>\n        </select>\n      </form>`;
  } else if (lower.includes("table")) {
    body = `      <table>\n        <thead>\n          <tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>Data A</td><td>Data B</td><td>Data C</td></tr>\n        </tbody>\n      </table>`;
  } else {
    body = `      <section>\n        <h3>${title}</h3>\n        <p>Reusable component placeholder.</p>\n      </section>`;
  }

  const content = `import React from "react";\n\nfunction ${name}() {\n  return (\n    <div>\n${body}\n    </div>\n  );\n}\n\nexport default ${name};\n`;
  fs.writeFileSync(file, content, "utf8");
}

function writeLayout(file) {
  const name = nameFromFile(file);
  const title = humanize(name);
  const content = `import React from "react";\n\nfunction ${name}() {\n  return (\n    <div>\n      <header>\n        <h1>Library BOUGDIM</h1>\n        <h2>${title}</h2>\n      </header>\n      <nav aria-label=\"Layout Navigation\">\n        <ul>\n          <li><a href=\"#\">Dashboard</a></li>\n          <li><a href=\"#\">Management</a></li>\n          <li><a href=\"#\">Reports</a></li>\n          <li><a href=\"#\">Settings</a></li>\n        </ul>\n      </nav>\n      <main>\n        <section>\n          <h3>Main Content Area</h3>\n          <p>Page content will be displayed here.</p>\n        </section>\n      </main>\n      <footer>\n        <p>Library BOUGDIM - Layout Footer</p>\n      </footer>\n    </div>\n  );\n}\n\nexport default ${name};\n`;
  fs.writeFileSync(file, content, "utf8");
}
const pageFiles = walk(pagesDir);
const componentFiles = walk(componentsDir);
const layoutFiles = walk(layoutsDir);

pageFiles.forEach(writePage);
componentFiles.forEach(writeComponent);
layoutFiles.forEach(writeLayout);

const appPath = path.join(root, "App.jsx");
const pageImports = pageFiles.map((file) => {
  const rel =
    "./" +
    path
      .relative(root, file)
      .replace(/\\/g, "/")
      .replace(/\.jsx$/, "");
  return { name: nameFromFile(file), rel };
});

const importLines = pageImports
  .map((p) => `import ${p.name} from "${p.rel}";`)
  .join("\n");

const renderLines = pageImports
  .map(
    (p) =>
      `      <section>\n        <${p.name} />\n      </section>\n      <hr />`
  )
  .join("\n");

const appContent = `import React from "react";\n${importLines}\n\nfunction App() {\n  return (\n    <div>\n      <h1>Library BOUGDIM</h1>\n      <p>All pages rendered below for layout review.</p>\n      <hr />\n${renderLines}\n    </div>\n  );\n}\n\nexport default App;\n`;

fs.writeFileSync(appPath, appContent, "utf8");

console.log(
  `Updated ${pageFiles.length} pages, ${componentFiles.length} components, and ${layoutFiles.length} layouts.`
);
