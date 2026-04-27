import React, { useId } from "react";

function Dropdown({ 
  label, 
  name, 
  options = [], 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Select an option",
  children,
  className = "",
  wrapperClassName = "",
  labelClassName = "",
  selectClassName = "",
}) {
  const autoId = useId();
  const selectId = name || autoId;

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: opt };
    }

    return {
      value: opt?.value ?? opt?.id ?? opt?.name ?? "",
      label: opt?.label ?? opt?.name ?? String(opt?.value ?? opt?.id ?? ""),
      disabled: opt?.disabled ?? false,
    };
  });

  return (
    <div className={`dropdown-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className={`dropdown-label ${labelClassName}`.trim()}>
          {label}
        </label>
      )}

      <div className={`dropdown-wrapper ${wrapperClassName}`.trim()}>
        <select
          id={selectId}
          name={name || selectId}
          className={`dropdown-select ${selectClassName}`.trim()}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {children || normalizedOptions.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
