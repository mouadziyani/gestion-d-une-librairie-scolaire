import { getSitePreferences } from "../services/sitePreferencesService";

export function getRoleHomePath(roleSlug) {
  switch ((roleSlug || "").toLowerCase()) {
    case "admin":
      return "/dashboard";
    case "moderator":
      return "/moderator/dashboard";
    case "client":
      return "/client/dashboard";
    default:
      return "/";
  }
}

export function hasAllowedRole(userRole, allowedRoles = []) {
  if (!allowedRoles.length) {
    return true;
  }

  const role = (userRole || "").toLowerCase();

  if (role === "admin") {
    return true;
  }

  return allowedRoles.includes(role);
}

const PUBLIC_NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Categories", path: "/categories" },
  { label: "Shop", path: "/products" },
  { label: "Special Order", path: "/special-order" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const PAGE_SECTIONS = {
  public: {
    label: "Public Pages",
    links: [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "Categories", path: "/categories" },
      { label: "Special Order", path: "/special-order" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
      { label: "Support", path: "/faq" },
      { label: "Login", path: "/login" },
      { label: "Register", path: "/register" },
    ],
  },
  client: {
    label: "Client Pages",
    links: [
      { label: "Client Dashboard", path: "/client/dashboard" },
      { label: "Cart", path: "/Cart" },
      { label: "Checkout", path: "/Checkout" },
      { label: "Orders", path: "/Orders" },
      { label: "Invoices", path: "/MyInvoices" },
      { label: "Wishlist", path: "/Wishlist" },
      { label: "Profile", path: "/client/profile" },
      { label: "Notifications", path: "/client/notifications" },
    ],
  },
  moderator: {
    label: "Moderator Pages",
    links: [
      { label: "Moderator Dashboard", path: "/moderator/dashboard" },
      { label: "Products", path: "/moderator/products" },
      { label: "Stock", path: "/moderator/stock" },
      { label: "Orders", path: "/moderator/orders" },
      { label: "Schools", path: "/moderator/schools" },
      { label: "Invoices", path: "/moderator/invoices" },
      { label: "Special Orders", path: "/moderator/special-orders" },
      { label: "Reports", path: "/moderator/reports" },
    ],
  },
  admin: {
    label: "Admin Pages",
    links: [
      { label: "Admin Dashboard", path: "/admin/dashboard" },
      { label: "Analytics", path: "/admin/analytics" },
      { label: "Products", path: "/ProductsListAdmin" },
      { label: "Add Product", path: "/AddProductAdmin" },
      { label: "Categories", path: "/CategoriesAdmin" },
      { label: "Stock", path: "/StockList" },
      { label: "Orders", path: "/admin/orders" },
      { label: "Add User", path: "/admin/users/create" },
      { label: "Users List", path: "/admin/users" },
      { label: "Schools", path: "/admin/schools" },
      { label: "Suppliers", path: "/admin/suppliers" },
      { label: "Invoices", path: "/AdminInvoiceList" },
      { label: "Special Orders", path: "/admin/special-orders" },
      { label: "Reports", path: "/admin/reports/sales" },
      { label: "Roles & Permissions", path: "/RolesPermissions" },
      { label: "Settings", path: "/GeneralSettings" },
      { label: "System Config", path: "/SystemConfig" },
    ],
  },
};

const SIDEBAR_LINKS = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Products", path: "/ProductsListAdmin" },
    { label: "Add Product", path: "/AddProductAdmin" },
    { label: "Categories", path: "/CategoriesAdmin" },
    { label: "Stock", path: "/StockList" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Users", path: "/admin/users" },
    { label: "Add User", path: "/admin/users/create" },
    { label: "Schools", path: "/admin/schools" },
    { label: "Suppliers", path: "/admin/suppliers" },
    { label: "Invoices", path: "/AdminInvoiceList" },
    { label: "Special Orders", path: "/admin/special-orders" },
    { label: "Reports", path: "/admin/reports/sales" },
    { label: "Roles & Permissions", path: "/RolesPermissions" },
    { label: "Settings", path: "/GeneralSettings" },
    { label: "System Config", path: "/SystemConfig" },
  ],
  moderator: [
    { label: "Dashboard", path: "/moderator/dashboard" },
    { label: "Products", path: "/moderator/products" },
    { label: "Stock", path: "/moderator/stock" },
    { label: "Orders", path: "/moderator/orders" },
    { label: "Schools", path: "/moderator/schools" },
    { label: "Invoices", path: "/moderator/invoices" },
    { label: "Special Orders", path: "/moderator/special-orders" },
    { label: "Reports", path: "/moderator/reports" },
  ],
  client: [
    { label: "Dashboard", path: "/client/dashboard" },
    { label: "Shop", path: "/products" },
    { label: "Cart", path: "/Cart" },
    { label: "Checkout", path: "/Checkout" },
    { label: "Orders", path: "/Orders" },
    { label: "Invoices", path: "/MyInvoices" },
    { label: "Wishlist", path: "/Wishlist" },
    { label: "Profile", path: "/client/profile" },
  ],
};

export function getNavLinks() {
  return PUBLIC_NAV_LINKS;
}

export function getNavbarPageSections(roleSlug) {
  const role = (roleSlug || "").toLowerCase();
  const preferences = getSitePreferences();
  const publicPreferences = preferences.publicPages;
  const systemPreferences = preferences.system;
  const sections = [
    {
      ...PAGE_SECTIONS.public,
      links: PAGE_SECTIONS.public.links.filter((link) => {
        const key = normalizePageKey(link.path);
        if (key === "register" && systemPreferences.registration === false) {
          return false;
        }

        return publicPreferences[key] !== false;
      }),
    },
  ];

  if (role === "client" || role === "admin") {
    const rolePages = preferences.rolePages?.client || [];
    sections.push({
      ...PAGE_SECTIONS.client,
      links: PAGE_SECTIONS.client.links.filter((link) => rolePages.includes(normalizeNavKey(link.path, link.label))),
    });
  }

  if (role === "moderator" || role === "admin") {
    const rolePages = preferences.rolePages?.moderator || [];
    sections.push({
      ...PAGE_SECTIONS.moderator,
      links: PAGE_SECTIONS.moderator.links.filter((link) => rolePages.includes(normalizeNavKey(link.path, link.label))),
    });
  }

  if (role === "admin") {
    const rolePages = preferences.rolePages?.admin || [];
    sections.push({
      ...PAGE_SECTIONS.admin,
      links: PAGE_SECTIONS.admin.links.filter((link) => rolePages.includes(normalizeNavKey(link.path, link.label))),
    });
  }

  return sections.filter((section) => section.links.length > 0);
}

export function getSidebarLinks(roleSlug) {
  return SIDEBAR_LINKS[(roleSlug || "").toLowerCase()] || [];
}

function normalizePageKey(path) {
  const cleanPath = (path || "").toLowerCase();

  if (cleanPath === "/") return "home";
  if (cleanPath.includes("product")) return "products";
  if (cleanPath.includes("categorie")) return "categories";
  if (cleanPath.includes("special-order")) return "specialOrder";
  if (cleanPath.includes("about")) return "about";
  if (cleanPath.includes("contact")) return "contact";
  if (cleanPath.includes("faq") || cleanPath.includes("support")) return "support";
  if (cleanPath.includes("login")) return "login";
  if (cleanPath.includes("register")) return "register";

  return cleanPath.replace(/\W+/g, "");
}

function normalizeNavKey(path, label) {
  const labelKey = (label || "").toLowerCase();
  const pathKey = normalizePageKey(path);

  if (labelKey.includes("dashboard")) return "dashboard";
  if (labelKey.includes("analytics")) return "analytics";
  if (labelKey.includes("add product")) return "addProduct";
  if (labelKey.includes("add user")) return "addUser";
  if (labelKey.includes("products")) return "products";
  if (labelKey === "shop") return "shop";
  if (labelKey.includes("categories")) return "categories";
  if (labelKey.includes("shop")) return "shop";
  if (labelKey.includes("cart")) return "cart";
  if (labelKey.includes("checkout")) return "checkout";
  if (labelKey.includes("special")) return "specialOrder";
  if (labelKey.includes("order")) return "orders";
  if (labelKey.includes("invoice")) return "invoices";
  if (labelKey.includes("wishlist")) return "wishlist";
  if (labelKey.includes("profile")) return "profile";
  if (labelKey.includes("stock")) return "stock";
  if (labelKey.includes("school")) return "schools";
  if (labelKey.includes("supplier")) return "suppliers";
  if (labelKey.includes("report")) return "reports";
  if (labelKey.includes("system config") || labelKey.includes("config")) return "systemConfig";
  if (labelKey.includes("setting")) return "settings";
  if (labelKey.includes("role")) return "rolesPermissions";
  if (labelKey.includes("users")) return "users";
  if (labelKey.includes("home")) return "home";
  if (labelKey.includes("about")) return "about";
  if (labelKey.includes("contact")) return "contact";
  if (labelKey.includes("support") || labelKey.includes("faq")) return "support";
  if (labelKey.includes("login")) return "login";
  if (labelKey.includes("register")) return "register";

  return pathKey;
}
