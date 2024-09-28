import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Header from "../../../components/Admin/Header";
import "../OrderStyles.css";

const UpdateOrder = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState("Processing"); // Initial order status
  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      productName: "Emilia One Shoulder White Printed Dress",
      quantity: 1,
      price: 5500,
      imageUrl:
        "https://nilsonline.lk/image/cache/catalog/nils/product/046007371/1%20(67)-612x875.jpg",
    },
    {
      id: 2,
      productName: "Pleated Green Strappy Dress",
      quantity: 2,
      price: 3900,
      imageUrl:
        "https://nilsonline.lk/image/cache/catalog/nils/product/046007272/14-612x875.jpg",
    },
  ] );

  const getStatusClass = () => {
    switch (orderStatus) {
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
      default:
        return "";
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const [formInputs] = useState({
    id: "ORD123456", // Dummy order ID
    dt: "2024-09-25 14:30:00", // Dummy date and time
    payment: "Credit Card", // Dummy payment method
    status: "Processing", // Dummy order status
    name: "Kamal Perera", // Name
    email: "kamal.perera@gmail.com", // Email
    phone: "0714585996", // Phone
    address: "123 Main St", // Street Address
    city: "Colombo", // City
    province: "Western Province", // Province
    pcode: "00100", // Postal Code
    country: "Sri Lanka", // Country
  });

  const handleUpdateOrder = () => {
    // Handle order update logic here
    setShowSuccessAlert(true);
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
          Order Updated Successfully!
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
        {/* Status Change Dropdown */}
        <div className="status-container">
          <strong>Change Order Status </strong>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className={`order-status-filter-2 ${getStatusClass()}`}
          >
            <option value="Purchased">Purchased</option>
            <option value="Accepted">Accepted</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button className="add-update-order-btn" onClick={handleUpdateOrder}>
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
                <span> {formInputs.id}</span>
              </div>
              <div className="order-detail">
                <strong>Date & Time</strong>
                <span> {formInputs.dt}</span>
              </div>
              <div className="order-detail">
                <strong>Payment Method</strong>
                <span> {formInputs.payment}</span>
              </div>
              <div className="order-detail">
                <strong>Status</strong>
                <span> {orderStatus}</span>
              </div>
            </div>
          </div>

          <div className="form-container-update">
            <h4 className="cd-name">Billing Details</h4>
            <div className="billing-details">
              <div className="billing-detail">
                <strong>Name</strong>
                <span> {formInputs.name}</span>
              </div>
              <div className="billing-detail">
                <strong>Email</strong>
                <span> {formInputs.email}</span>
              </div>
              <div className="billing-detail">
                <strong>Phone Number</strong>
                <span> {formInputs.phone}</span>
              </div>
              <div className="billing-detail">
                <strong>Address</strong>
                <span>
                  {" "}
                  {`${formInputs.address}, ${formInputs.city}, ${formInputs.province}, ${formInputs.pcode}, ${formInputs.country}`}
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
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="product-name-column-new">
                        <div className="product-details-new">
                          <img
                            src={item.imageUrl}
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
                  ))}
                </tbody>
                <tfoot className="footer-styles-new">
                  <tr>
                    <td colSpan="2">Total Price</td>
                    <td className="total-price-new">
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
