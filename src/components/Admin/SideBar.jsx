import React from "react";
import Logo from "../../images/white_logo.jpg";
import "./SideBar.css";
import {
  AiOutlineShoppingCart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineUserAdd,
} from "react-icons/ai";
import {
  MdOutlineWarehouse,
  MdOutlineDashboard,
} from "react-icons/md";
import { PiDress } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";

const SideBar = () => {
  const navigate = useNavigate();

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
      key: "orders",
      icon: <AiOutlineShoppingCart className="fs-4" />,
      label: "Orders",
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
      <Menu mode="inline" defaultSelectedKeys={[""]} className="my-custom-menu">
        {menuItems.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            className="my-custom-menu-item"
            onClick={() => {
              if (item.key === "signout") {
                // Perform your logout operation here
              } else {
                navigate(`/dashboard/${item.key}`);
              }
            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default SideBar;
