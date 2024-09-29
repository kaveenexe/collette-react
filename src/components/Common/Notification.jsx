import React, { useState, useEffect, useContext } from "react";
import { IoIosNotifications } from "react-icons/io";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Assuming you have AuthContext to get the user role
import "./Notification.css";

const Notification = () => {
  const { user } = useContext(AuthContext); // Get user role from AuthContext
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch pending customer accounts (only for CSR role)
  useEffect(() => {
    if (user?.role === "CSR") {
      const fetchPendingCustomers = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/pending-customers`);
          setPendingCustomers(response.data); // Store pending customers
        } catch (error) {
          console.error("Error fetching pending customers:", error);
        }
      };

      fetchPendingCustomers();
    }
  }, [user]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-container">
      <div onClick={toggleDropdown} style={{ position: "relative", cursor: "pointer" }}>
        <IoIosNotifications size={24} />
        {/* Show count of pending customers if any */}
        {pendingCustomers.length > 0 && (
          <span className="notification-badge">{pendingCustomers.length}</span>
        )}
      </div>

      {/* Show dropdown with pending customer accounts */}
      {showDropdown && pendingCustomers.length > 0 && (
        <div className="notification-dropdown">
          <ul>
            {pendingCustomers.map((customer) => (
              <li key={customer.id}>
                <span className="fw-bold">{customer.firstName}</span> <span className="fw-bold">{customer.lastName}</span> ({customer.email}) - Pending Activation
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
