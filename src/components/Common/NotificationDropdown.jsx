// NotificationDropdown.js
import React from "react";
import "./NotificationDropdown.css"; // Add custom styles for the dropdown

const NotificationDropdown = ({ notifications, onClose }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h5>Notifications</h5>
        <button onClick={onClose} className="close-btn">x</button>
      </div>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index}>
              <p>{notification.message}</p>
            </li>
          ))
        ) : (
          <li>No new notifications</li>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
