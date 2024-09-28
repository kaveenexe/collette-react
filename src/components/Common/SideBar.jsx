import React, { useContext } from "react";
import Logo from "../../images/white_logo.jpg";
import "./SideBar.css";
import {
  AiOutlineShoppingCart,
  AiOutlineLogout,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineWarehouse, MdOutlineDashboard } from "react-icons/md";
import { PiDress } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

const SideBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Get user and logout from AuthContext

  // Define menu items conditionally based on user role
  const menuItems = [
    {
      key: "dashboard",  // Unique key for each item
      icon: <MdOutlineDashboard className="fs-4" />,
      label: "Dashboard",
    },
    user && user.role === "Administrator" && {
      key: "users",  // Unique key for Users menu
      icon: <AiOutlineUserAdd className="fs-4" />,
      label: "Users",
    },
    (user && (user.role === "Administrator" || user.role === "Vendor")) && {
      key: "products",  // Unique key for Products menu
      icon: <PiDress className="fs-4" />,
      label: "Products",
    },
    {
      key: "orders",  // Unique key for Orders menu
      icon: <AiOutlineShoppingCart className="fs-4" />,
      label: "Orders",
    },
    user && user.role === "Administrator" && {
      key: "inventory",  // Unique key for Inventory menu
      icon: <MdOutlineWarehouse className="fs-4" />,
      label: "Inventory",
    },
    user && user.role === "Administrator" && {
      key: "vendors",  // Unique key for Vendors menu
      icon: <IoBusinessOutline className="fs-4" />,
      label: "Vendors",
    },
    {
      key: "signout",  // Unique key for Logout
      icon: <AiOutlineLogout className="fs-4" />,
      label: "Logout",
    },
  ];

  return (
    <div className="sidebar">
      <img
        src={Logo}
        alt="Logo"
        style={{
          width: "15.5rem",
          marginRight: "0.6rem",
          marginBottom: "0.8rem",
        }}
      />
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        className="my-custom-menu"
        items={menuItems.filter(item => item)} // Use 'items' prop with Ant Design
        onClick={(item) => {
          if (item.key === "signout") {
            logout(); // Call logout function from AuthContext
          } else if (item.key === "dashboard") {
            navigate("/dashboard"); // Navigate directly to /dashboard
          } else {
            navigate(`/dashboard/${item.key}`);
          }
        }}
      />
    </div>
  );
};

export default SideBar;
