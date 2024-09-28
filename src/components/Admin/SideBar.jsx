import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation
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
import {IoBusinessOutline} from "react-icons/io5";
import { BsDiagram3 } from "react-icons/bs";
import { Menu } from "antd";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to track current path
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedKey, setSelectedKey] = useState("");

  // Menu items definition
  const menuItems = [
    {
      key: "",
      icon: <MdOutlineDashboard className="fs-4" />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <AiOutlineUserAdd className="fs-4" />,
      label: "Users",
    },
    {
      key: "products",
      icon: <PiDress className="fs-4" />,
      label: "Products",
    },
    {
      key: "categories",
      icon: <BsDiagram3 className="fs-4" />,
      label: "Categories",
    },
    {
      key: "orders",
      icon: <AiOutlineShoppingCart className="fs-4" />,
      label: "Orders",
      subItems: [
        { key: "create-order", label: "New Order" },
        { key: "update-order", label: "Update Orders" },
        { key: "cancel-orders", label: "Cancel Orders" },
      ],
    },
    {
      key: "inventory",
      icon: <MdOutlineWarehouse className="fs-4" />,
      label: "Inventory",
    },
    {
      key: "vendors",
      icon: <IoBusinessOutline className="fs-4" />,
      label: "Vendors",
    },
    {
      key: "settings",
      icon: <AiOutlineSetting className="fs-4" />,
      label: "Settings",
    },
    {
      key: "signout",
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
      // Perform logout operation
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
          marginLeft: "0.8rem",
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
