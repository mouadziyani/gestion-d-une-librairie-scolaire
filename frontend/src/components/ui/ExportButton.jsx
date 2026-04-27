import React from "react";

function ExportButton({ onExport, format = "CSV" }) {
  return (
    <div style={{ display: "inline-block" }}>
      <button 
        type="button" 
        className="btn-export" 
        onClick={() => onExport && onExport(format)}
      >
        <span className="export-icon">downald</span>
        <span>Export {format}</span>
        <span className="export-dropdown-arrow">▼</span>
      </button>
    </div>
  );
}

export default ExportButton;