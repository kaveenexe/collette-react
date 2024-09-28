import React from "react";
import Header from "../../../components/Common/Header";
import "../OrderStyles.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPen, FaTrash } from "react-icons/fa"; // Importing the FontAwesome icons

const Orders = () => {
  const navigate = useNavigate(); // Create a navigate function

  const handleAddOrderClick = () => {
    navigate("/dashboard/create-order"); // Navigate to the create order page
  };

  const orders = [
    {
      id: "#CD2302",
      customer: "Kamal Perera",
      email: "kamal.perera@gmail.com",
      date: "August 15 2024",
      time: "2:20pm",
      total: "LKR5300", // Example total in LKR
      payment: "Mastercard",
      status: "Accepted",
    },
    {
      id: "#CD2305",
      customer: "Dilani Fernando",
      email: "dilani.fernando@gmail.com",
      date: "August 04 2024",
      time: "3:10pm",
      total: "LKR2760", // Example total in LKR
      payment: "Visa",
      status: "Processing",
    },
    {
      id: "#CD2310",
      customer: "Nirosha Silva",
      email: "nirosha.silva@gmail.com",
      date: "August 02 2024",
      time: "3:40pm",
      total: "LKR14000", // Example total in LKR
      payment: "Credit Card",
      status: "Delivered",
    },
    {
      id: "#CD2322",
      customer: "Ramesh Kumara",
      email: "ramesh.kumara@gmail.com",
      date: "June 25 2024",
      time: "4:10pm",
      total: "LKR3800", // Example total in LKR
      payment: "Transfer",
      status: "Purchased",
    },
    {
      id: "#CD2311",
      customer: "Anjali Wijesekara",
      email: "anjali.wijesekara@gmail.com",
      date: "May 18 2024",
      time: "4:30pm",
      total: "LKR4560", // Example total in LKR
      payment: "COD", // Updated payment method
      status: "Cancelled",
    },
  ];

  return (
    <div className="main-component">
      <Header
        title="Order Management"
        subtitle="Keep Track of Recent Orders: Stay Informed on Status and Updates"
      />

      <div className="order-table">
        <div className="order-table-header">
          <input type="text" placeholder="Search..." className="order-search" />

          <div className="status-container">
            <span>Status</span>
            <select className="order-status-filter">
              <option>Choose...</option>
              <option>Purchased</option>
              <option>Accepted</option>
              <option>Processing</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <button className="add-new-order-btn" onClick={handleAddOrderClick}>
            Add New Order
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th class="orderid-column">Order ID</th>
              <th class="customer-column">Customer</th>
              <th class="date-column">Date</th>
              <th class="total-column">Total</th>
              <th class="payment-method-column">Payment Method</th>
              <th class="order-status-column">Order Status</th>
              <th class="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td class="orderid-column">{order.id}</td>
                <td class="customer-column">
                  <div>
                    <strong>{order.customer}</strong>
                    <br />
                    <small>{order.email}</small>
                  </div>
                </td>
                <td class="date-column">
                  {order.date}
                  <br />
                  <small>{order.time}</small>
                </td>
                <td class="total-column">{order.total}</td>
                <td class="payment-method-column">{order.payment}</td>
                <td class="order-status-column">
                  <span
                    className={`status-badge ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td class="action-column">
                  <button className="action-btn view-btn">
                    <FaEye /> {/* View icon */}
                  </button>
                  <button className="action-btn edit-btn">
                    <FaPen /> {/* Edit icon */}
                  </button>
                  <button className="action-btn delete-btn">
                    <FaTrash /> {/* Delete icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
