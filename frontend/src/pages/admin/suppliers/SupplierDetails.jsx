import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getSupplier } from "../../../services/supplierService";

function SupplierDetails() {
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("id");
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSupplier() {
      const data = await getSupplier(supplierId);
      if (active) {
        setSupplier(data);
        setLoading(false);
      }
    }

    loadSupplier();

    return () => {
      active = false;
    };
  }, [supplierId]);

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / SUPPLIERS</span>
          <h1 className="page-shell-title">Supplier Details</h1>
          <p className="page-shell-subtitle">View supplier information from the central database.</p>
        </div>
        <Link to="/admin/suppliers" className="btn-archive">Back to list</Link>
      </header>

      <section className="admin-card">
        {!loading ? (
          supplier ? (
          <>
            <div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", marginBottom: "8px" }}>{supplier.name}</h2>
              <p>{supplier.code || "-"}</p>
            </div>

            <div className="admin-stats-strip">
              <div className="stat-item">
                <span>Status</span>
                <strong>{supplier.status || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Email</span>
                <strong>{supplier.email || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>Phone</span>
                <strong>{supplier.phone || "-"}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <tbody>
                  <tr>
                    <td>Id</td>
                    <td>#{supplier.id}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{supplier.address || "-"}</td>
                  </tr>
                  <tr>
                    <td>Code</td>
                    <td>{supplier.code || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Supplier not found.</p>
        )) : null}
      </section>
    </div>
  );
}

export default SupplierDetails;
