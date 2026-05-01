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
                    <div className="table-actions">
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="table-empty-cell">
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
