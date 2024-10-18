import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Common/Header";
import "./OrderStyles.css";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // User role
  const [ userId, setUserId ] = useState( "" ); // Vendor ID for vendor users
  const [ filteredProducts, setFilteredProducts ] = useState( [] );
  const [products, setProducts] = useState([]);

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
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setUserRole(userData.role);
      setUserId(userData.userId);
    }

    const fetchOrderAndProducts = async () => {
      try {
        let orderResponse;

        // Fetch order based on user role (vendor or other)
        if (userData && userData.role === "Vendor") {
          orderResponse = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/Orders/vendor/${id}/${userData.userId}`
          );
        } else {
          orderResponse = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}`
          );
        }

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrder(orderData);
        } else {
          setErrorMessage("Order not found.");
          return;
        }

        // Fetch products
        const productsResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/customer/products`
        );
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
          setFilteredProducts(productsData); // Initially show all products
        } else {
          setErrorMessage("Error fetching products");
        }
      } catch (error) {
        setErrorMessage("Error fetching order or products.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProducts();
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

  const updateOrder = async () => {
    try {
      let response;

      // Check if user is a vendor and the new status is "Delivered"
      if (userRole === "Vendor" && order.status === 3) {
        // Use vendor-specific API to mark as delivered
        response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}/vendors/${userId}/mark-delivered`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
      } else {
        // General order update
        response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/Orders/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: order.status }),
          }
        );
      }

      if (response.ok) {
        setShowSuccessAlert(true); // Show success alert

        // Delay navigation to give the alert time to display
        setTimeout(() => {
          navigate("/dashboard/orders");
        }, 2000); // 2-second delay before navigating
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to update order status.");
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
                    group.items.map((item) => {
                      // Find the matching product using productId and uniqueProductId
                      const matchingProduct = products.find(
                        (product) => product.uniqueProductId === item.productId
                      );

                      return (
                        <tr key={item.productId}>
                          <td className="product-name-column-new">
                            <div className="product-details-new">
                              <img
                                src={
                                  matchingProduct?.imageUrl ||
                                  "default-image-url"
                                }
                                alt={item.productName}
                                className="product-image-new"
                              />
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
                      );
                    })
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
