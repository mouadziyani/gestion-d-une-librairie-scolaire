import React from "react";
import DefaultImg from "@/assets/avatars/profile.jpg";

function Avatar({ src = DefaultImg, alt = "User avatar", size = 50, showCaption = false }) {
  return (
    <div className="avatar-container">
      <figure style={{ margin: 0 }}>
        <img 
          src={src} 
          alt={alt} 
          className="avatar-circle"
          style={{ width: size, height: size }} 
        />
        {showCaption && (
          <figcaption className="avatar-caption">
            {alt}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

export default Avatar;
