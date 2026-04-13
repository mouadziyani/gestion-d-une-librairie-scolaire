import React from "react";

function Dropdown({ 
  label, 
  name, 
  options = [], 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Select an option" 
}) {
  return (
    <div className="dropdown-group">
      {label && (
        <label htmlFor={name} className="dropdown-label">
          {label}
        </label>
      )}
      <select 
        id={name} 
        name={name} 
        className="dropdown-select"
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;