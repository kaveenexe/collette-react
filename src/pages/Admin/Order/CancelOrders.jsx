import React from "react";
import Header from "../../../components/Admin/Header";
import "../OrderStyles.css";
import { FaEye } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const CancelOrders = () => {
  const orders = [
    {
      id: "#CD2302",
      customer: "Kamal Perera",
      email: "kamal.perera@gmail.com",
      date: "August 15 2024",
      cancelRequestDate: "August 16 2024", // Added cancel request date
      total: "LKR 5300",
      payment: "Mastercard",
      status: "Accepted",
    },
    {
      id: "#CD2305",
      customer: "Dilani Fernando",
      email: "dilani.fernando@gmail.com",
      date: "August 04 2024",
      cancelRequestDate: "August 05 2024", // Added cancel request date
      total: "LKR 2760",
      payment: "Visa",
      status: "Processing",
    },
    {
      id: "#CD2310",
      customer: "Nirosha Silva",
      email: "nirosha.silva@gmail.com",
      date: "August 02 2024",
      cancelRequestDate: "August 03 2024", // Added cancel request date
      total: "LKR 14000",
      payment: "Credit Card",
      status: "Delivered",
    },
    {
      id: "#CD2322",
      customer: "Ramesh Kumara",
      email: "ramesh.kumara@gmail.com",
      date: "June 25 2024",
      cancelRequestDate: "June 26 2024", // Added cancel request date
      total: "LKR 3800",
      payment: "Transfer",
      status: "Purchased",
    },
    {
      id: "#CD2311",
      customer: "Anjali Wijesekara",
      email: "anjali.wijesekara@gmail.com",
      date: "May 18 2024",
      cancelRequestDate: "May 19 2024", // Added cancel request date
      total: "LKR 4560",
      payment: "COD",
      status: "Cancelled",
    },
  ];

  return (
    <div className="main-component">
      <Header
        title="Order Cancel Requests"
        subtitle="Confirm Order Cancellation Below"
      />
      <div className="order-table">
        <table className="table">
          <thead>
            <tr>
              <th className="orderid-column">Order ID</th>
              <th className="customer-column">Customer</th>
              <th className="order-date-column">Order Date</th>
              <th className="cancel-request-date-column">
                Cancel Request Date
              </th>{" "}
              {/* New Column */}
              <th className="total-column">Total</th>
              <th className="order-status-column">Order Status</th>
              <th className="confirm-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="orderid-column">{order.id}</td>
                <td className="customer-column">
                  <strong>{order.customer}</strong>
                  <br />
                  <small>{order.email}</small>
                </td>
                <td className="order-date-column">{order.date}</td>
                <td className="cancel-request-date-column">
                  {order.cancelRequestDate}
                </td>{" "}
                {/* Display Cancel Request Date */}
                <td className="total-column">{order.total}</td>
                <td className="order-status-column">
                  <span
                    className={`status-badge ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td class="confirm-column">
                  <button className="action-btn view2-btn">
                    <FaEye /> {/* View icon */}
                  </button>
                  <button className="action-btn cancel-btn">
                    <MdCancel /> {/* Edit icon */}
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

export default CancelOrders;
