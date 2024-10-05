import React from "react";
import "./NotificationDropdown.css"; // Add custom styles for the dropdown

const NotificationDropdown = ({ notifications, onClose, onClearAll }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h5>Notifications</h5>
        {notifications.length > 0 && (
          <div className="notification-footer">
            <button className="clear-btn" onClick={onClearAll}>
              Clear All
            </button>
          </div>
        )}
        <button onClick={onClose} className="close-btn">
          x
        </button>
      </div>

      <ul>
        {notifications.length > 0 ? (
          [...notifications].reverse().map((notification, index) => (
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
