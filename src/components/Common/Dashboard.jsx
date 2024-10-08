import React, { useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./Navigation"; // Import the NavBar component
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import AdminDashboard from "../MainDashboards/AdminDashboard";
import VendorDashboard from "../MainDashboards/VendorDashboard";
import CSRDashboard from "../MainDashboards/CSRDashboard";
import "./Dashboard.css"; // Add relevant styles here

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const location = useLocation(); // Get current location (route)

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  // Render different dashboards based on the user's role
  const renderDashboardContent = () => {
    switch (user?.role) {
      case "Administrator":
        return <AdminDashboard />;
      case "Vendor":
        return <VendorDashboard />;
      case "CSR":
        return <CSRDashboard />;
      default:
        return <p>No specific dashboard available for this role.</p>;
    }
  };

  return (
    <div className="dashboard">
      <SideBar />
      <div className="content">
        {/* Add the new NavBar */}
        <NavBar onSearch={handleSearch} user={user} />

        {/* Only render the role-specific dashboard on the main /dashboard route */}
        {location.pathname === "/dashboard" && renderDashboardContent()}

        {/* Outlet will render the child route components (e.g., Users, Orders, etc.) */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
