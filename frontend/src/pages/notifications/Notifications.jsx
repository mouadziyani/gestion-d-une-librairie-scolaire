import React from "react";

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      msg: "Customer #2901 placed an order for 5 'Stylo BIC' and 2 'Cahier Selecta'.",
      time: "2 mins ago",
      isUnread: true
    },
    {
      id: 2,
      type: "stock",
      title: "Low Stock Alert",
      msg: "Scientific Calculators (Casio fx-991) are below threshold (2 items left).",
      time: "1 hour ago",
      isUnread: true
    },
    {
      id: 3,
      type: "system",
      title: "System Backup Complete",
      msg: "Cloud backup for Library BOUGDIM database was successful.",
      time: "5 hours ago",
      isUnread: false
    }
  ];

  const getIcon = (type) => {
    if (type === "order") return { icon: "📦", class: "icon-order" };
    if (type === "stock") return { icon: "⚠️", class: "icon-stock" };
    return { icon: "⚙️", class: "icon-system" };
  };

  return (
    <div className="notif-wrapper">
      <header className="notif-header">
        <div>
          <span className="notif-eyebrow">
            ADMIN / UPDATES
          </span>
          <h2 className="notif-title">Notifications</h2>
        </div>
        <button className="btn-mark-all">Mark all as read</button>
      </header>

      <div className="notif-list">
        {notifications.map((n) => {
          const config = getIcon(n.type);
          return (
            <div key={n.id} className={`notif-card ${n.isUnread ? 'unread' : ''}`}>
              <div className={`notif-icon ${config.class}`}>
                {config.icon}
              </div>
              <div className="notif-content">
                <h4>{n.title}</h4>
                <p>{n.msg}</p>
                <span className="notif-time">{n.time}</span>
              </div>
              {n.isUnread && <div className="notif-unread-dot"></div>}
            </div>
          );
        })}
      </div>

      <div className="notif-load-more">
        <button className="notif-load-more-button">
          Load Older Notifications
        </button>
      </div>
    </div>
  );
}

export default Notifications;
