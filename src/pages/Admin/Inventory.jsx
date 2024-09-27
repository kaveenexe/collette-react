import React from "react";
import Header from "../../components/Admin/Header";
import "./Styles.css";

const Inventory = () =>
{
  return (
    <div className="main-component">
      <Header
        title="Inventory Management"
        subtitle="Monitor inventory levels and receive alerts for low stock to prevent shortages."
      />
      <br />
    </div>
  );
};

export default Inventory;
