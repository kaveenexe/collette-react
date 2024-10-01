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
import { PiUsersThree } from "react-icons/pi";
import { BsDiagram3 } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Menu } from "antd";
import { AuthContext } from "../../context/AuthContext";

const SideBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedKey, setSelectedKey] = useState("");

  // Menu items
  const getMenuItems = () => [
    {
      key: "dashboard",
      icon: <MdOutlineDashboard className="fs-4" />,
      label: "Dashboard",
      visible: true,
    },
    {
      key: "users",
      icon: <AiOutlineUserAdd className="fs-4" />,
      label: "Users",
      visible: user && user.role === "Administrator",
    },
    {
      key: "products",
      icon: <PiDress className="fs-4" />,
      label: "Products",
      visible: user && (user.role === "Administrator" || user.role === "Vendor"),
    },
    {
      key: "categories",
      icon: <BsDiagram3 className="fs-4" />,
      label: "Categories",
      visible: user && user.role === "Administrator",
    },
    {
      key: "orders",
      icon: <AiOutlineShoppingCart className="fs-4" />,
      label: "Orders",
      visible: user && (user.role === "Administrator" || user.role === "Vendor"),
      subItems: [
        {
          key: "create-order",
          label: "New Order",
          visible: user && (user.role === "Administrator" || user.role === "Vendor"),
        },
        {
          key: "update-order",
          label: "Update Orders",
          visible: user && (user.role === "Administrator" || user.role === "Vendor"),
        },
        {
          key: "cancel-orders",
          label: "Cancel Orders",
          visible: user && (user.role === "Administrator" || user.role === "Vendor"),
        },
      ],
    },
    {
      key: "inventory",
      icon: <MdOutlineWarehouse className="fs-4" />,
      label: "Inventory",
      visible: user && user.role === "Administrator",
    },
    {
      key: "admin-management",
      icon: <AiOutlineUserAdd className="fs-4" />,
      label: "Admin Management",
      visible: user && user.role === "Administrator",
      subItems: [
        {
          key: "vendor-management",
          label: "Vendor Management",
          visible: true,
        },
        {
          key: "csr-management",
          label: "CSR Management",
          visible: true,
        },
      ],
    },
    {
      key: "customer-management",
      icon: <FaUsers className="fs-4" />,
      label: "Customer Management",
      visible: user && (user.role === "Administrator" || user.role === "CSR"),
    },
    {
      key: "settings",
      icon: <AiOutlineSetting className="fs-4" />,
      label: "Settings",
      visible: true,
    },
    {
      key: "signout",
      icon: <AiOutlineLogout className="fs-4" />,
      label: "Logout",
      visible: true,
    },
  ];

  // Filter visible menu items
  const visibleMenuItems = getMenuItems().filter(item => item.visible);

  const handleNavigation = (key) => {
    setSelectedKey(key);
    navigate(`/dashboard/${key}`);
  };

  const handleMenuClick = (key) => {
    const selectedItem = visibleMenuItems.find((item) => item.key === key);

    if (selectedItem?.subItems) {
      setExpandedMenus((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));

      // No need to navigate if it's a submenu, just expand/collapse
      if (!expandedMenus[key] && key === "orders") {
        handleNavigation("orders"); // Navigate to orders only
      }
    } else if (key === "signout") {
      logout();
    } else if (key === "dashboard") {
      navigate("/dashboard");
    } else {
      handleNavigation(key); // Handle navigation for other menu items
    }
  };

  const handleSubMenuClick = (key) => {
    handleNavigation(key);
  };

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    setSelectedKey(currentPath);
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
        {visibleMenuItems.map((item) => (
          <React.Fragment key={item.key}>
            <Menu.Item
              key={item.key}
              className="my-custom-menu-item"
              onClick={() => handleMenuClick(item.key)}
            >
              <div className="menu-item-content">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
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

            {item.subItems && expandedMenus[item.key] && (
              <div className="custom-submenu">
                {item.subItems.filter(subItem => subItem.visible).map((subItem) => (
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