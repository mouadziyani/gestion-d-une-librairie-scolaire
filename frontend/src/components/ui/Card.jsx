import React from "react";
import Button from "./Button"; 

function Card({ 
  title = "Card Title", 
  description = "Short description for this card.", 
  image, 
  onBtnClick, 
  btnText = "View Details",
  badge
}) {
  return (
    <div className="card-container">
      {image && (
        <div className="card-image-box">
          <img src={image} alt={title} />
          {badge && (
            <span className="card-badge">
              {badge}
            </span>
          )}
        </div>
      )}
      
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{description}</p>
      </div>

      <div className="card-footer">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBtnClick} 
          className="card-action-button"
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
}

export default Card;
