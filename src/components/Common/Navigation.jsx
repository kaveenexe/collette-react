import React, { useState, useEffect, useContext } from "react";
import { FaBell } from "react-icons/fa"; // Import bell icon for notifications
import axios from "axios";
import SearchBar from "./SearchBar";
import { AuthContext } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown"; // Import NotificationDropdown component
import "./Dashboard.css"; // Create this CSS file for styling

const NavBar = ({ onSearch }) => {
  const { user } = useContext(AuthContext); // Get logged-in user details
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown visibility
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch notifications based on the user role (CSR, Admin, or Vendor)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (userData && userData.role) {
          if (userData.role === "CSR") {
            const response = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/notifications/csr`
            );
            setNotifications(response.data); // Store CSR notifications
          } else if (userData.role === "Administrator") {
            const response = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/notifications/admin`
            );
            setNotifications(response.data); // Store Admin notifications
          } else if (userData.role === "Vendor") {
            // Use userId as vendorId for fetching notifications
            const response = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/notifications/${userData.userId}`
            );
            setNotifications(response.data); // Store Vendor notifications
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setErrorMessage("Error fetching notifications.");
      }
    };

    fetchNotifications();
  }, [user]);

  // Toggle the notification dropdown
  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown); // Toggle visibility of the dropdown
  };

  // Clear all notifications locally
  const handleClearAll = () => {
    setNotifications([]); // Clear the notifications from the state
  };

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
        {(user?.role === "CSR" || user?.role === "Administrator" || user?.role === "Vendor") && (
          <div className="notification-icon" onClick={handleNotificationClick}>
            <FaBell />
            <span className="notification-badge">{notifications.length}</span>
          </div>
        )}

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

      {/* Notification Dropdown */}
      {showDropdown && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setShowDropdown(false)}
          onClearAll={handleClearAll}
        />
      )}

      {errorMessage && (
        <div className="alert alert-danger notification-error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default NavBar;
