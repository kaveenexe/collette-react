// NavBar.js
import React from "react";
import { FaBell } from "react-icons/fa"; // Import bell icon for notifications
import SearchBar from "./SearchBar";
import "./Dashboard.css"; // Create this CSS file for styling

const NavBar = ({ onSearch, user }) => {
  return (
    <div className="navbar">
      <div className="searchbar">
        <SearchBar onSearch={onSearch} />
      </div>
      <div className="navbar-items">
        {/* Language Icon */}
        <img
          src="https://flagcdn.com/w320/gb.png"
          alt="Language"
          className="navbar-icon"
        />

        {/* Notification Button */}
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">2</span>{" "}
          {/* Example notification count */}
        </div>

        {/* Profile Picture */}
        <div className="profile-picture">
          <img
            src={
              user?.profilePicture ||
              "https://png.pngtree.com/png-clipart/20240314/original/pngtree-avatar-with-flat-style-png-image_14587877.png"
            }
            alt="Profile"
            className="navbar-profile-img"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
