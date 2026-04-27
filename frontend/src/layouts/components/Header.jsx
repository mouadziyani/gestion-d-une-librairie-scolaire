import React from "react";
import { Bell } from "lucide-react"; 
import Avatar from "./Avatar"; 
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="main-header">
      <div className="header-actions">
        
        <Link to="/notifications" className="notif-link-wrapper">
          <div className="notif-badge-wrapper" title="View Notifications">
            <span className="notif-icon-span">
              <Bell size={22} strokeWidth={2} />
            </span>
            
            <div className="badge-dot"></div>
          </div>
        </Link>

        <Link to="/profile" className="profile-link-header">
          <Avatar size={40} />
        </Link>
        
      </div>
    </header>
  );
}

export default Header;
