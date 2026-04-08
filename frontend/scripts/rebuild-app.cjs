
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.cwd(), "src");
const pagesDir = path.join(root, "pages");

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

const pageFiles = walk(pagesDir).sort();
const imports = [];
const renders = [];

for (const file of pageFiles) {
  const relPath = "./" + path.relative(root, file).replace(/\\/g, "/").replace(/\.jsx$/, "");
  const name = nameFromFile(file);
  const relToPages = path.relative(pagesDir, file).replace(/\\/g, "/");
  const topFolder = relToPages.split("/")[0];
  const prefix = capitalize(topFolder);
  const alias = `${prefix}${name}`;
  imports.push(`import ${alias} from "${relPath}";`);
  renders.push(`      <section>\n        <${alias} />\n      </section>\n      <hr />`);
}

const appContent = `import React from "react";\n${imports.join("\n")}\n\nfunction App() {\n  return (\n    <div>\n      <h1>Library BOUGDIM</h1>\n      <p>All pages rendered below for layout review.</p>\n      <hr />\n${renders.join("\n")}\n    </div>\n  );\n}\n\nexport default App;\n`;

fs.writeFileSync(path.join(root, "App.jsx"), appContent, "utf8");
console.log(`Rebuilt App.jsx with ${pageFiles.length} page imports.`);
