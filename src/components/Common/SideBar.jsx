import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../images/white_logo.jpg";
import "./SideBar.css";
import {
  AiOutlineShoppingCart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineUserAdd,
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
import { MdOutlineWarehouse, MdOutlineDashboard } from "react-icons/md";
import { PiDress } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { FaBuildingUser } from "react-icons/fa6";
import { BsDiagram3 } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Menu } from "antd";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

const SideBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Get user and logout from AuthContext
  const location = useLocation(); // Use location to track current path
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedKey, setSelectedKey] = useState("");

  // Define menu items conditionally based on user role
  const menuItems = [
    {
      key: "dashboard", // Unique key for each item
      icon: <MdOutlineDashboard className="fs-4" />,
      label: "Dashboard",
    },
    user &&
      user.role === "Administrator" && {
        key: "users", // Unique key for Users menu
        icon: <AiOutlineUserAdd className="fs-4" />,
        label: "Users",
      },
    user &&
      (user.role === "Administrator" || user.role === "Vendor") && {
        key: "products", // Unique key for Products menu
        icon: <PiDress className="fs-4" />,
        label: "Products",
      },
    user &&
      user.role === "Administrator" && {
        key: "categories", // Unique key for Categories menu
        icon: <BsDiagram3 className="fs-4" />,
        label: "Categories",
      },
    user &&
      (user.role === "Administrator" || user.role === "Vendor") && {
        key: "orders", // Unique key for Orders menu
        icon: <AiOutlineShoppingCart className="fs-4" />,
        label: "Orders",
        subItems: [
          // Only 'Administrator' and 'Vendor' can create orders
          (user.role === "Administrator" || user.role === "Vendor") && {
            key: "create-order",
            label: "New Order",
          },
          // Only 'Administrator' and 'Vendor' can update orders
          (user.role === "Administrator" || user.role === "Vendor") && {
            key: "update-order",
            label: "Update Orders",
          },
          // Both 'Administrator' and 'Vendor' can cancel orders
          (user.role === "Administrator" || user.role === "Vendor") && {
            key: "cancel-orders",
            label: "Cancel Orders",
          },
        ].filter(Boolean), // Filter out any false/null values to ensure no invalid entries
      },
    user &&
      user.role === "Administrator" && {
        key: "inventory", // Unique key for Inventory menu
        icon: <MdOutlineWarehouse className="fs-4" />,
        label: "Inventory",
      },
      user &&
      user.role === "Administrator" && {
        key: "admin-management",
        icon: <AiOutlineUserAdd className="fs-4" />,
        label: "Admin Management",
        subItems: [
          {
            key: "vendor-management",
            label: "Vendor Management",
          },
          {
            key: "csr-management",
            label: "CSR Management",
          },
        ],
      },
    user &&
    (user.role === "Administrator" || user.role === "CSR") && {
        key: "customer-management",
        icon: <FaUsers className="fs-4" />,
        label: "Customer Management",
      },
      
    {
      key: "settings",
      icon: <AiOutlineSetting className="fs-4" />,
      label: "Settings",
    },
    {
      key: "signout", // Unique key for Logout
      icon: <AiOutlineLogout className="fs-4" />,
      label: "Logout",
    },
  ];

  // Common navigation handler
  const handleNavigation = (key) => {
    setSelectedKey(key); // Update selected key
    navigate(`/dashboard/${key}`); // Navigate to the specified route
  };

  // Toggle submenu visibility and handle navigation
  const handleMenuClick = (key) => {
    const selectedItem = menuItems.find((item) => item.key === key);

    if (selectedItem?.subItems) {
      setExpandedMenus((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
      // If submenu is opened, navigate to orders page
      if (!expandedMenus[key]) {
        handleNavigation("orders"); // Navigate to orders
      }
    } else if (key === "signout") {
      logout();
    } else if (key === "dashboard") {
      navigate("/dashboard");
    } else {
      handleNavigation(key); // Handle navigation for other menu items
    }
  };

  // Handle submenu click and navigation
  const handleSubMenuClick = (key) => {
    handleNavigation(key); // Use common navigation handler
  };

  // Effect to set selected key based on the current route
  useEffect(() => {
    const currentPath = location.pathname.split("/").pop(); // Get the last part of the path
    setSelectedKey(currentPath); // Set the selected key based on current path
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <img
        src={Logo}
        alt="Logo"
        style={{
          width: "15.5rem",
          marginLeft: "0.5rem",
          marginBottom: "0.8rem",
        }}
      />
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={[""]}
        className="my-custom-menu"
      >
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
            <Menu.Item
              key={item.key}
              className="my-custom-menu-item"
              onClick={() => handleMenuClick(item.key)}
            >
              <div className="menu-item-content">
                {/* Icon */}
                <span className="menu-icon">{item.icon}</span>

                {/* Label */}
                <span className="menu-label">{item.label}</span>

                {/* Arrow for sub-items */}
                {item.subItems && (
                  <span className="menu-arrow">
                    {expandedMenus[item.key] ? (
                      <AiOutlineUp className="arrow-icon" />
                    ) : (
                      <AiOutlineDown className="arrow-icon" />
                    )}
                  </span>
                )}
              </div>
            </Menu.Item>

            {/* Dynamic Submenu */}
            {item.subItems && expandedMenus[item.key] && (
              <div className="custom-submenu">
                {item.subItems.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    className={`my-custom-submenu-item ${
                      selectedKey === subItem.key
                        ? "my-custom-submenu-item-selected"
                        : ""
                    }`}
                    onClick={() => handleSubMenuClick(subItem.key)}
                  >
                    <span className="sub-menu-label">{subItem.label}</span>
                  </Menu.Item>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </Menu>
    </div>
  );
};

export default SideBar;
