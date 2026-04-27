import React from "react";

function Button({ 
  children, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  disabled = false,
  onClick,
  icon
}) {
  const className = `btn-base btn-${variant} btn-${size}`;

  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick} 
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;