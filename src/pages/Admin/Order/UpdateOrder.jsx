import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Common/Header";
import "./OrderStyles.css";

const UpdateOrder = () =>
{
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // User role
  const [userId, setUserId] = useState(""); // Vendor ID for vendor users

  const getStatusClass = () => {
    return order ? getStatusClassByStatus(order.status) : ""; // Modify to check order's current status
  };

  const getStatusClassByStatus = (status) => {
    switch (status) {
      case "Purchased":
        return "purchased";
      case "Accepted":
        return "accepted";
      case "Processing":
        return "processing";
      case "Delivered":
        return "delivered";
      case "Cancelled":
        return "cancelled";
      case "PartiallyDelivered":
        return "partiallydelivered";
      case "Pending":
        return "pending";
      default:
        return "";
    }
  };

  useEffect(() => {
    // Fetch and parse the user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setUserRole(userData.role);
      setUserId(userData.userId);
    }

    const fetchOrder = async () => {
      try {
        let response;

        // Check if the user is a vendor and adjust the API route accordingly
        if (userData.role === "Vendor") {
          // Fetch vendor-specific order details using vendorId
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/Orders/vendor/${id}/${userData.userId}`
          );
        } else {
          // Fetch general order details for Admin/CSR roles
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}`
          );
        }

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setErrorMessage("Order not found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  const calculateTotal = () => {
    return order.orderItemsGroups.reduce((total, group) => {
      return (
        total +
        group.items.reduce((groupTotal, item) => {
          return groupTotal + item.price * item.quantity;
        }, 0)
      );
    }, 0);
  };

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
    1: "MasterCard",
    2: "COD",
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Handle status change and update order state
  const handleStatusChange = (e) => {
    const newStatusString = e.target.value;
    const statusMapping = {
      Purchased: 0,
      Accepted: 1,
      Processing: 2,
      Delivered: 3,
      Cancelled: 5,
      PartiallyDelivered: 4,
      Pending: 6,
    };
    const newStatus = statusMapping[newStatusString]; // Convert to number
    setOrder((prevOrder) => ({
      ...prevOrder,
      status: newStatus, // Update the order's status in the state
    }));
  };

  // Function to update the order status on the server
  const updateOrder = async () => {
    try {
      let response;

      // Check if user is a vendor and the new status is "Delivered"
      if (userRole === "Vendor" && order.status === 3) {
        // Use vendor-specific API to mark as delivered
        response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}/vendors/${userId}/mark-delivered`, // Updated endpoint
          {
            method: "PUT", // Changed to PUT
            headers: {
              "Content-Type": "application/json",
            },
            // Optionally include a request body if needed
            body: JSON.stringify({
              /* Add any additional data here if needed */
            }),
          }
        );
      } else {
        // General order update (non-vendor or non-delivered status)
        response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}`, // General update endpoint
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: order.status }), // Send updated status
          }
        );
      }

      if (response.ok) {
        setShowSuccessAlert( true ); // Show success alert
        navigate("/dashboard/orders");
      } else {
        const errorData = await response.json(); // Get error message from response
        setErrorMessage(errorData.message || "Failed to update order status."); // Use error message from the server if available
      }
    } catch (error) {
      setErrorMessage("Error updating order status.");
    }
  };

  return (
    <div className="main-component">
      <Header
        title="Update Order"
        subtitle="Make Order Status Change to Existing Orders"
      />

      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          className="success-alert"
        >
          Order Status Updated Successfully!
        </Alert>
      )}

      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage("")}
          dismissible
          className="error-alert"
        >
          {errorMessage}
        </Alert>
      )}
      <br />

      <div className="order-table-header">
        <div className="status-container">
          <strong>Change Order Status </strong>
          <select
            value={order.status} // Bind the select to order.status
            onChange={handleStatusChange} // Update the status on change
            className={`order-status-filter-2 ${getStatusClass()}`}
          >
            <option value="Purchased">Purchased</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Processing">Processing</option>
            <option value="PartiallyDelivered">PartiallyDelivered</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button className="add-update-order-btn" onClick={updateOrder}>
          Update Order
        </button>
      </div>

      <Row>
        <Col md={5}>
          <div className="form-container-update">
            <h4 className="cd-name">Order Details</h4>
            <div className="order-details">
              <div className="order-detail">
                <strong>ID</strong>
                <span> {order.orderId}</span>
              </div>
              <div className="order-detail">
                <strong>Date & Time</strong>
                <span>{formatDateTime(order.orderDate)}</span>
              </div>
              <div className="order-detail">
                <strong>Payment Method</strong>
                <span>{paymentMethodMapping[order.paymentMethod]}</span>
              </div>
              <div className="order-detail">
                <strong>Status</strong>
                <span>{statusMapping[order.status]}</span>{" "}
              </div>
            </div>
          </div>

          <div className="form-container-update">
            <h4 className="cd-name">Billing Details</h4>
            <div className="billing-details">
              <div className="billing-detail">
                <strong>Name</strong>
                <span> {order.billingDetails?.customerName}</span>
              </div>
              <div className="billing-detail">
                <strong>Email</strong>
                <span> {order.billingDetails?.email}</span>
              </div>
              <div className="billing-detail">
                <strong>Phone Number</strong>
                <span> {order.billingDetails?.phone}</span>
              </div>
              <div className="billing-detail">
                <strong>Address</strong>
                <span>
                  {order.billingDetails?.singleBillingAddress
                    ? // Render single billing address if it exists
                      `${order.billingDetails.singleBillingAddress}`
                    : // Render detailed address if singleBillingAddress is not available
                      `${order.billingDetails?.billingAddress?.streetAddress}, 
                      ${order.billingDetails?.billingAddress?.city}, 
                      ${order.billingDetails?.billingAddress?.province}, 
                      ${order.billingDetails?.billingAddress?.postalCode}, 
                      ${order.billingDetails?.billingAddress?.country}`}
                </span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={5}>
          <div className="product-summary-new">
            <h4 className="cd-name">Order Items</h4>
            <div className="order-items-container">
              <table className="order-items-table-new">
                <thead>
                  <tr>
                    <th className="product-name-column-new">Product</th>
                    <th className="quantity-column-new">Quantity</th>
                    <th className="price-column-new">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItemsGroups.map((group) =>
                    group.items.map((item) => (
                      <tr key={item.productId}>
                        <td className="product-name-column-new">
                          <div className="product-details-new">
                            {/* <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="product-image-new"
                            /> */}
                            <div className="product-info-new">
                              <span className="product-name-new">
                                {item.productName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="quantity-column-new">
                          <span>{item.quantity}</span>
                        </td>
                        <td className="price-column-new">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="footer-styles-new">
                  <tr>
                    <td colSpan="2">Total Price</td>
                    <td
                      className="total-price-new"
                      style={{ textAlign: "center" }}
                    >
                      LKR {calculateTotal().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateOrder;
