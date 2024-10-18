import React, { useEffect, useState, useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Common/Header";
import "./OrderStyles.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPen, FaTrash } from "react-icons/fa"; // Importing the FontAwesome icons
import { AuthContext } from "../../../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
  const [userRole, setUserRole] = useState(""); // User role
  const [userId, setUserId] = useState(""); // Vendor ID for vendor users
  const navigate = useNavigate(); // Create a navigate function
  const { user } = useContext(AuthContext);

  const handleAddOrderClick = () => {
    navigate("/dashboard/create-order"); // Navigate to the create order page
  };

  // Fetch orders from the backend
  const fetchAllOrders = async () => {
    try {
      let response;

      // Fetch and parse the user data from local storage
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData && userData.role) {
        setUserRole(userData.role);
        setUserId(userData.userId);

        if (userData.role === "Vendor" && userData.userId) {
          // Fetch vendor-specific orders
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/orders/vendor/${userData.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Fetch all orders for Admin and CSR
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } else {
        console.error("No user data found in local storage");
      }
    } catch (err) {
      setError('order error', err.message);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchAllOrders(); // Fetch orders based on role
  }, []);

  const statusMapping = {
    0: "Purchased",
    1: "Accepted",
    2: "Processing",
    3: "Delivered",
    4: "PartiallyDelivered",
    5: "Cancelled",
    6: "Pending",
  };

  const paymentMethodMapping = {
    0: "Visa",
    1: "Master",
    2: "COD",
  };

  const formatDate = (dateString) => {
    const optionsDate = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("en-US", optionsDate);
    const formattedTime = date
      .toLocaleString("en-US", optionsTime)
      .replace(",", "");

    return `${formattedDate}<br>${formattedTime}`;
  };

  // Function to handle order deletion
  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/orders/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the order");
        }

        setOrders(orders.filter((order) => order.id !== id));
        setShowSuccessAlert(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle status selection change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value); // Update selected status
  };

  // Filter orders based on search query and selected status
  const filteredOrders = orders.filter((order) => {
    const orderIdMatches = order.orderId
      .toString()
      .includes(searchQuery.toLowerCase());
    const customerNameMatches = order.billingDetails.customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if the order's status matches the selected status (if any)
    const statusMatches = selectedStatus
      ? statusMapping[order.status] === selectedStatus
      : true; // If no status is selected, include all orders

    return (orderIdMatches || customerNameMatches) && statusMatches; // Show orders that match either criteria
  });

  // Function to handle editing order
  const handleEditOrder = (id) => {
    navigate(`/dashboard/update-order/${id}`);
  };

  // Function to handle viewing order
  const handleViewOrder = (id) => {
    navigate(`/dashboard/view-order/${id}`);
  };

  return (
    <div className="main-component">
      <Header
        title="Order Management"
        subtitle="Keep Track of Recent Orders: Stay Informed on Status and Updates"
      />
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          className="success-alert"
        >
          Order deleted successfully!
        </Alert>
      )}
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="error-alert"
        >
          {error}
        </Alert>
      )}

      <div className="order-table">
        <div className="order-table-header">
          <input
            type="text"
            placeholder="Search..."
            className="order-search"
            value={searchQuery}
            onChange={handleSearchChange} // Handle search input change
          />

          <div className="status-container">
            <span>Status</span>
            <select
              className="order-status-filter"
              onChange={handleStatusChange}
            >
              <option value="">Choose...</option>
              <option value="Purchased">Purchased</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Processing">Processing</option>
              <option value="PartiallyDelivered">PartiallyDelivered</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {user.role === "Administrator" && (
            <button className="add-new-order-btn" onClick={handleAddOrderClick}>
              Add New Order
          </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="orderid-column">Order ID</th>
              <th className="customer-column">Customer</th>
              <th className="date-column">Date</th>
              <th className="total-column">Total</th>
              <th className="payment-method-column">Payment Method</th>
              <th className="order-status-column">Order Status</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="orderid-column">{order.orderId}</td>
                <td className="customer-column">
                  <div>
                    <strong>{order.billingDetails.customerName}</strong>
                    <br />
                    <small>{order.billingDetails.email}</small>
                  </div>
                </td>
                <td
                  className="date-column"
                  dangerouslySetInnerHTML={{
                    __html: formatDate(order.orderDate),
                  }}
                ></td>
                <td className="total-column">LKR{order.totalAmount}</td>
                <td className="payment-method-column">
                  {paymentMethodMapping[order.paymentMethod]}
                </td>
                <td className="order-status-column">
                  <span
                    className={`status-badge ${statusMapping[
                      order.status
                    ].toLowerCase()}`}
                  >
                    {statusMapping[order.status]}
                  </span>
                </td>
                <td className="action-column">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewOrder(order.id)}
                    style={{
                      marginTop: "-30px",
                      border: "none",
                      background: "none",
                    }} // Inline style for view button
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleEditOrder(order.id)}
                    style={{
                      marginTop: "-8px",
                      border: "none",
                      background: "none",
                      fontSize: "17px",
                    }} // Inline style for edit button
                  >
                    <FaPen />
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDeleteOrder(order.id)}
                    style={{
                      marginTop: "-8px",
                      marginLeft: "9px", // Adjusted margin-left
                      fontSize: "17px", // Adjusted font size
                      background: "none",
                      border: "none",
                    }} // Inline style for delete button
                  >
                    <FaTrash />
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
