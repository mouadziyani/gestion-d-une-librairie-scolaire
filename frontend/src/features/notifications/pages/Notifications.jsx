import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/features/notifications/services/notificationService";
import { useUiPreferences } from "@/shared/context/UIContext";

function getIcon(type) {
  if (type === "order") return { icon: "ORD", className: "icon-order" };
  if (type === "stock") return { icon: "STK", className: "icon-stock" };
  if (type === "special_order") return { icon: "REQ", className: "icon-system" };
  return { icon: "SYS", className: "icon-system" };
}

function Notifications() {
  const { t } = useUiPreferences();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || t("notificationsPage.failedLoadNotifications"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [t]);

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
          <span className="notif-eyebrow">{t("notificationsPage.eyebrow")}</span>
          <h2 className="notif-title">{t("notificationsPage.title")}</h2>
        </div>
        <button className="btn-mark-all" onClick={handleMarkAll} type="button">
          {t("notificationsPage.markAllAsRead")}
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
                    <h4>{notification.type?.replace(/_/g, " ") || t("notificationsPage.notificationFallback")}</h4>
                    <p>{notification.message}</p>
                    <span className="notif-time">{notification.created_at || t("notificationsPage.justNow")}</span>
                  </div>
                  {!notification.is_read ? (
                    <button
                      type="button"
                      className="btn-mark-all notif-mark-one"
                      onClick={() => handleMarkOne(notification.id)}
                    >
                      {t("notificationsPage.markRead")}
                    </button>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="notif-card">
              <div className="notif-content">
                <h4>{t("notificationsPage.emptyTitle")}</h4>
                <p>{t("notificationsPage.emptyDescription")}</p>
              </div>
            </div>
          )
        ) : (
          <div className="notif-card">
            <div className="notif-content">
              <h4>{t("ui.loading")}</h4>
              <p>{t("ui.pleaseWait")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
