import React from "react";
import { useUiPreferences } from "@/shared/context/UIContext";

function Button({ 
  children, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  disabled = false,
  onClick,
  icon,
  className = "",
  ...rest
}) {
  const { t } = useUiPreferences();
  const buttonClassName = `btn-base btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button 
      type={type} 
      className={buttonClassName} 
      onClick={onClick} 
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          <span>{t("ui.loading")}</span>
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
