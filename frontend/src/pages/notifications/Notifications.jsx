import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService";

function getIcon(type) {
  if (type === "order") return { icon: "ORD", className: "icon-order" };
  if (type === "stock") return { icon: "STK", className: "icon-stock" };
  if (type === "special_order") return { icon: "REQ", className: "icon-system" };
  return { icon: "SYS", className: "icon-system" };
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkAll() {
    await markAllNotificationsRead();
    await loadNotifications();
    window.dispatchEvent(new Event("bougdim:notifications-changed"));
  }

  async function handleMarkOne(id) {
    await markNotificationRead(id);
    await loadNotifications();
    window.dispatchEvent(new Event("bougdim:notifications-changed"));
  }

  return (
    <div className="notif-wrapper">
      <header className="notif-header">
        <div>
          <span className="notif-eyebrow">ACCOUNT / UPDATES</span>
          <h2 className="notif-title">Notifications</h2>
        </div>
        <button className="btn-mark-all" onClick={handleMarkAll} type="button">
          Mark all as read
        </button>
      </header>

      {error ? <p className="form-alert form-alert-error">{error}</p> : null}

      <div className="notif-list">
        {!loading ? (
          notifications.length ? (
            notifications.map((notification) => {
              const config = getIcon(notification.type);

              return (
                <div key={notification.id} className={`notif-card ${notification.is_read ? "" : "unread"}`}>
                  <div className={`notif-icon ${config.className}`}>{config.icon}</div>
                  <div className="notif-content">
                    <h4>{notification.type?.replace(/_/g, " ") || "Notification"}</h4>
                    <p>{notification.message}</p>
                    <span className="notif-time">{notification.created_at || "Just now"}</span>
                  </div>
                  {!notification.is_read ? (
                    <button
                      type="button"
                      className="btn-mark-all notif-mark-one"
                      onClick={() => handleMarkOne(notification.id)}
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="notif-card">
              <div className="notif-content">
                <h4>No notifications yet</h4>
                <p>You will see order, stock, and system updates here.</p>
              </div>
            </div>
          )
        ) : (
          <div className="notif-card">
            <div className="notif-content">
              <h4>Loading...</h4>
              <p>Please wait.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
