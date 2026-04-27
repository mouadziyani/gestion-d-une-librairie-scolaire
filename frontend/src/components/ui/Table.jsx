import React from "react";

function Table({ columns = [], data = [], actions }) {
  return (
    <div className="table-container">
      <table className="custom-table responsive-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(item).map((val, colIndex) => (
                  <td key={colIndex} data-label={columns[colIndex] || ""}>{val}</td>
                ))}
                {actions && (
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                No data available in this section.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
