import { api } from "./api";

const STORAGE_KEY = "bougdim_site_preferences";

const DEFAULT_PREFERENCES = {
  general: {
    storeName: "Library BOUGDIM",
    legalName: "S.A.R.L. Bougdim & Co",
    address: "BD HASSAN II NR 07 ELAIOUN SIDI MELLOUK",
    email: "contact@bougdim.com",
    phone: "+212 536 XX XX XX",
  },
  publicPages: {
    home: true,
    products: true,
    categories: true,
    specialOrder: true,
    about: true,
    contact: true,
    support: true,
    login: true,
    register: true,
  },
  landingSections: {
    hero: true,
    features: true,
    featuredEssentials: true,
    discountBanner: true,
    bestSellers: true,
    categoryHighlights: true,
    brandStory: true,
    schoolPartners: true,
    callToAction: true,
  },
  footer: {
    enabled: true,
    brandTitle: "BOUGDIM.",
    brandDescription: "Your trusted library for school books, scientific equipment, and office supplies. Empowering education since 2026.",
    columns: {
      explore: true,
      support: true,
      office: true,
    },
    columnLabels: {
      explore: "Explore",
      support: "Support",
      office: "Office",
    },
    publicPages: {
      home: true,
      products: true,
      categories: true,
      specialOrder: true,
      about: true,
      contact: true,
      support: true,
      login: true,
    },
  },
  system: {
    registration: true,
    maintenance: false,
    twoFactor: false,
  },
  rolePages: {
    client: ["dashboard", "shop", "cart", "checkout", "orders", "invoices", "wishlist", "profile"],
    moderator: ["dashboard", "products", "stock", "orders", "schools", "invoices", "specialOrder", "reports"],
    admin: [
      "dashboard",
      "analytics",
      "products",
      "addProduct",
      "categories",
      "stock",
      "orders",
      "addUser",
      "users",
      "schools",
      "suppliers",
      "invoices",
      "specialOrder",
      "reports",
      "rolesPermissions",
      "settings",
      "systemConfig",
    ],
  },
};

let cachedPreferences = readStoredPreferences();

function readStoredPreferences() {
  if (typeof window === "undefined") {
    return normalizePreferences(DEFAULT_PREFERENCES);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizePreferences(raw ? JSON.parse(raw) : DEFAULT_PREFERENCES);
  } catch {
    return normalizePreferences(DEFAULT_PREFERENCES);
  }
}

function persistCache(preferences) {
  cachedPreferences = normalizePreferences(preferences);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedPreferences));
    window.dispatchEvent(new Event("bougdim:site-preferences-changed"));
  }

  return cachedPreferences;
}

function mergePreferences(saved = {}) {
  return normalizePreferences({
    general: { ...DEFAULT_PREFERENCES.general, ...(saved.general || {}) },
    publicPages: { ...DEFAULT_PREFERENCES.publicPages, ...(saved.publicPages || {}) },
    landingSections: { ...DEFAULT_PREFERENCES.landingSections, ...(saved.landingSections || {}) },
    footer: {
      ...DEFAULT_PREFERENCES.footer,
      ...(saved.footer || {}),
      columns: {
        ...DEFAULT_PREFERENCES.footer.columns,
        ...((saved.footer || {}).columns || {}),
      },
      columnLabels: {
        ...DEFAULT_PREFERENCES.footer.columnLabels,
        ...((saved.footer || {}).columnLabels || {}),
      },
      publicPages: {
        ...DEFAULT_PREFERENCES.footer.publicPages,
        ...((saved.footer || {}).publicPages || {}),
      },
    },
    system: { ...DEFAULT_PREFERENCES.system, ...(saved.system || {}) },
    rolePages: { ...DEFAULT_PREFERENCES.rolePages, ...(saved.rolePages || {}) },
  });
}

function normalizePreferences(source = {}) {
  const footer = source.footer || {};

  return {
    general: {
      ...DEFAULT_PREFERENCES.general,
      ...(source.general || {}),
    },
    publicPages: {
      ...DEFAULT_PREFERENCES.publicPages,
      ...(source.publicPages || source.public_pages || {}),
    },
    landingSections: {
      ...DEFAULT_PREFERENCES.landingSections,
      ...(source.landingSections || source.landing_sections || {}),
    },
    footer: {
      ...DEFAULT_PREFERENCES.footer,
      ...footer,
      columns: {
        ...DEFAULT_PREFERENCES.footer.columns,
        ...(footer.columns || {}),
      },
      columnLabels: {
        ...DEFAULT_PREFERENCES.footer.columnLabels,
        ...(footer.columnLabels || {}),
      },
      publicPages: {
        ...DEFAULT_PREFERENCES.footer.publicPages,
        ...(footer.publicPages || {}),
      },
    },
    system: {
      ...DEFAULT_PREFERENCES.system,
      ...(source.system || {}),
    },
    rolePages: {
      ...DEFAULT_PREFERENCES.rolePages,
      ...(source.rolePages || source.role_pages || {}),
    },
  };
}

function toApiPayload(preferences) {
  const normalized = mergePreferences(preferences);

  return {
    general: normalized.general,
    publicPages: normalized.publicPages,
    landingSections: normalized.landingSections,
    footer: normalized.footer,
    system: normalized.system,
    rolePages: normalized.rolePages,
  };
}

function fromApiPayload(payload) {
  return normalizePreferences({
    general: payload?.general,
    publicPages: payload?.public_pages || payload?.publicPages,
    landingSections: payload?.landing_sections || payload?.landingSections,
    footer: payload?.footer,
    system: payload?.system,
    rolePages: payload?.role_pages || payload?.rolePages,
  });
}

export async function loadSitePreferences() {
  if (typeof window === "undefined") {
    return cachedPreferences;
  }

  try {
    const response = await api.get("/site-preferences");
    const next = fromApiPayload(response.data?.data);
    return persistCache(next);
  } catch {
    return cachedPreferences;
  }
}

export function getSitePreferences() {
  return cachedPreferences;
}

export async function saveSitePreferences(preferences) {
  const next = mergePreferences(preferences);
  const response = await api.put("/site-preferences", toApiPayload(next));
  const updated = fromApiPayload(response.data?.data);
  return persistCache(updated);
}

export async function updateSitePreferences(section, key, value) {
  const current = getSitePreferences();
  const next = {
    ...current,
    [section]: {
      ...current[section],
      [key]: value,
    },
  };

  return saveSitePreferences(next);
}

export async function updateRolePages(roleSlug, pages) {
  const current = getSitePreferences();
  const next = {
    ...current,
    rolePages: {
      ...current.rolePages,
      [roleSlug]: Array.isArray(pages) ? pages : [],
    },
  };

  return saveSitePreferences(next);
}

export async function resetSitePreferences() {
  return saveSitePreferences(DEFAULT_PREFERENCES);
}

export { DEFAULT_PREFERENCES };
