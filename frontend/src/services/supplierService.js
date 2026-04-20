const STORAGE_KEY = "bougdim_suppliers";

const DEFAULT_SUPPLIERS = [
  {
    id: 1,
    name: "Atlas Paper",
    code: "ATLAS-01",
    status: "active",
    email: "hello@atlaspaper.ma",
    phone: "+212 600 000 001",
    address: "Casablanca, Morocco",
  },
  {
    id: 2,
    name: "School Stationery Pro",
    code: "SSP-02",
    status: "active",
    email: "contact@ssp.ma",
    phone: "+212 600 000 002",
    address: "Rabat, Morocco",
  },
];

function readSuppliers() {
  if (typeof window === "undefined") {
    return DEFAULT_SUPPLIERS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SUPPLIERS;
  } catch (error) {
    return DEFAULT_SUPPLIERS;
  }
}

function writeSuppliers(suppliers) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  }

  return suppliers;
}

export async function listSuppliers() {
  return readSuppliers();
}

export async function getSupplier(id) {
  return readSuppliers().find((supplier) => String(supplier.id) === String(id)) || null;
}

export async function createSupplier(payload) {
  const suppliers = readSuppliers();
  const next = {
    id: Date.now(),
    ...payload,
  };

  return writeSuppliers([next, ...suppliers]);
}

export async function updateSupplier(id, payload) {
  const suppliers = readSuppliers();
  const next = suppliers.map((supplier) =>
    String(supplier.id) === String(id) ? { ...supplier, ...payload } : supplier,
  );

  writeSuppliers(next);
  return next.find((supplier) => String(supplier.id) === String(id)) || null;
}

export async function deleteSupplier(id) {
  const suppliers = readSuppliers().filter((supplier) => String(supplier.id) !== String(id));
  writeSuppliers(suppliers);
  return true;
}
