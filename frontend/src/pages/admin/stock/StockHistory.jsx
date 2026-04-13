import React from "react";

function StockHistory() {
  
  const logs = [
    { id: 1, date: "2026-04-10", item: "Stylo BIC Bleu", action: "Restock", change: "+500", user: "Admin_Ahmed" },
    { id: 2, date: "2026-04-09", item: "Mathematics Grade 6", action: "Sale #992", change: "-2", user: "System" },
    { id: 3, date: "2026-04-08", item: "Scientific Calculator", action: "Damage Correction", change: "-1", user: "Admin_Sara" },
    { id: 4, date: "2026-04-07", item: "Stylo BIC Rouge", action: "Initial Entry", change: "+1000", user: "Admin_Ahmed" },
  ];

  return (
    <div className="history-wrapper">
      <header style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', fontWeight: 'bold' }}>ADMIN / LOGS</span>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', marginTop: '10px' }}>Stock Activity History</h1>
        <p style={{ color: '#666' }}>Track every change made to your library inventory.</p>
      </header>

      <section className="history-filters">
        <input type="date" className="admin-input" style={{ flex: 1 }} />
        <select className="admin-input" style={{ flex: 1 }}>
          <option>All Actions</option>
          <option>Restock</option>
          <option>Sales</option>
          <option>Adjustments</option>
        </select>
        <button className="btn-filled" style={{ padding: '0 30px' }}>Filter Logs</button>
      </section>

      
      <section className="log-timeline">
        {logs.map((log) => (
          <div className="log-item" key={log.id}>
            <div className="log-date">{log.date}</div>
            
            <div className="log-details">
              <strong>{log.item}</strong>
              <span>{log.action}</span>
            </div>

            <div className={`log-change ${log.change.startsWith('+') ? 'change-positive' : 'change-negative'}`}>
              {log.change} Units
            </div>

            <div className="log-admin">
              by {log.user}
            </div>
          </div>
        ))}
      </section>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="btn-outline" style={{ fontSize: '12px' }}>Load More History</button>
      </div>
    </div>
  );
}

export default StockHistory;