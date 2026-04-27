import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { deleteAdminUser, getAdminUser } from "@/features/admin/services/adminUserService";
import DefaultProfileImage from "@/assets/avatars/profile.jpg";
import { resolveMediaUrl } from "@/shared/utils/common/media";

function UserDetails() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const data = await getAdminUser(userId);
        if (active) {
          setUser(data);
          setPhotoFailed(false);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load user.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!userId) {
      setError("Missing user id.");
      setLoading(false);
      return () => {};
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this user permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      window.location.href = "/admin/users";
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    }
  }

  const profilePhotoSrc = !photoFailed
    ? resolveMediaUrl(user?.profile_photo_url || user?.profile_photo || "") || DefaultProfileImage
    : DefaultProfileImage;

  if (loading) {
    return null;
  }

  return (
    <div className="admin-detail-wrapper">
      <header className="page-shell-header">
        <div>
          <span className="eyebrow-label">ADMIN / USERS</span>
          <h1 className="page-shell-title">User Details</h1>
          <p className="page-shell-subtitle">View the account information and access role.</p>
        </div>
        {user ? (
          <div className="admin-actions-bar">
            <Link to={`/admin/users/edit?id=${user.id}`} className="btn-save">
              Edit
            </Link>
            <button type="button" className="btn-archive" onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : null}
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <section className="admin-card" style={{ gridTemplateColumns: "220px 1fr" }}>
        <div className="admin-product-img">
          <img
            src={profilePhotoSrc}
            alt={user?.name || "User"}
            onError={() => setPhotoFailed(true)}
          />
        </div>

        <div className="admin-detail-content">
          <h2>{user?.name || "Unknown User"}</h2>
          <p>{user?.email}</p>

          <div className="admin-stats-strip">
            <div className="stat-item">
              <span>Role</span>
              <strong>{user?.role?.name || "-"}</strong>
            </div>
            <div className="stat-item">
              <span>Phone</span>
              <strong>{user?.phone || "-"}</strong>
            </div>
            <div className="stat-item">
              <span>Address</span>
              <strong>{user?.address || "-"}</strong>
            </div>
          </div>

          <div className="table-container" style={{ marginTop: "0" }}>
            <table className="custom-table">
              <tbody>
                <tr>
                  <td>Id</td>
                  <td>#{user?.id}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>{user?.role?.slug || "-"}</td>
                </tr>
                <tr>
                  <td>Created</td>
                  <td>{user?.created_at || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserDetails;
