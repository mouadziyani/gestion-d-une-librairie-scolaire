import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSupplier, listSuppliers } from "../../../services/supplierService";

function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadSuppliers() {
      try {
        const data = await listSuppliers();
        if (active) {
          setSuppliers(Array.isArray(data) ? data : []);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      active = false;
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        [supplier.name, supplier.code, supplier.email, supplier.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = status === "all" || supplier.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, status]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this supplier?");
    if (!confirmed) {
      return;
    }

    await deleteSupplier(id);
    setSuppliers((current) => current.filter((supplier) => String(supplier.id) !== String(id)));
  }

  return (
    <div className="admin-list-wrapper">
      <header className="admin-list-header">
        <div>
          <span className="eyebrow-label">ADMIN / SUPPLIERS</span>
          <h2>Suppliers List</h2>
        </div>
        <Link to="/admin/suppliers/create" className="btn-add-role">
          + Add Supplier
        </Link>
      </header>

      <div className="filter-bar-admin">
        <div className="filter-field">
          <label htmlFor="supplier-search">Search</label>
          <input id="supplier-search" type="search" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label htmlFor="supplier-status">Status</label>
          <select id="supplier-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <section className="admin-table-card">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                filteredSuppliers.length ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>#{supplier.id}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.code || "-"}</td>
                      <td>{supplier.status || "-"}</td>
                      <td>
                        <Link to={`/admin/suppliers/details?id=${supplier.id}`} className="action-link">
                          View
                        </Link>
                        <Link to={`/admin/suppliers/edit?id=${supplier.id}`} className="action-link">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="action-link delete-link action-button-link"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No suppliers found.</td>
                  </tr>
                )
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default SuppliersList;
