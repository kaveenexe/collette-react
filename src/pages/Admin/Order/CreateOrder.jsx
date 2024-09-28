import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Admin/Header";
import visaImage from "../../../images/visa.png";
import mastercardImage from "../../../images/master.png";
import codImage from "../../../images/cod.png"; 
import { FaSearch, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "../OrderStyles.css";

const CreateOrder = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState( "" );
  const [ selectedPaymentMethod, setSelectedPaymentMethod ] = useState( "" );
  const [ searchQuery, setSearchQuery ] = useState( "" );
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
  ]);
  
  const handleQuantityChange = (id, change) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    phone: "",
    busNumber: "",
    assignedRoute: "",
    noOfShifts: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/inspectors/add-inspector",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInputs),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            "An error occurred while assigning the inspector."
        );
      }

      setShowSuccessAlert(true);
      setFormInputs({
        name: "",
        email: "",
        phone: "",
        busNumber: "",
        assignedRoute: "",
        noOfShifts: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.message || "An error occurred while assigning the inspector."
      );
      setShowSuccessAlert(false);
    }
  };

  return (
    <div className="main-component">
      <Header
        title="Create Order"
        subtitle="Submit New Orders Manually with Just a Few Clicks"
      />
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          className="success-alert"
        >
          Order Added Successfully!
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

      {/* Wrapping both Customer and Order Details into a single Row */}
      <Row>
        {/* Customer Details in one column */}
        <Col md={6}>
          <div className="form-container">
            <h4 className="cd-name">Order Details</h4>
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-4" controlId="nameInput">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formInputs.name}
                      onChange={handleInputChange}
                      placeholder="Ex: John Doe"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="emailInput">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formInputs.email}
                      onChange={handleInputChange}
                      placeholder="Ex: john@gmail.com"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="phoneInput">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formInputs.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: 123456789"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="addressInput">
                    <Form.Label>Delivery Instructions (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="del_ins"
                      value={formInputs.del_ins}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery, e.g., Leave at the back door."
                      rows={6}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Order Details in another column */}
        <Col md={6}>
          <div className="form-container">
            <h4 className="cd-name">Billing Details</h4>
            <Row>
              <Col md={12}>
                <Form>
                  {/* Street Address */}
                  <Form.Group className="mb-4" controlId="nameInput">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formInputs.address}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                    />
                  </Form.Group>

                  {/* City and Province in One Row */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="cityInput">
                        <Form.Label>City</Form.Label>
                        <Form.Select
                          name="city"
                          value={formInputs.city}
                          onChange={handleInputChange}
                        >
                          <option>Select City</option>
                          <option value="Jaffna">Jaffna</option>
                          <option value="Kilinochchi">Kilinochchi</option>
                          <option value="Mannar">Mannar</option>
                          <option value="Mullaitivu">Mullaitivu</option>
                          <option value="Vavuniya">Vavuniya</option>
                          <option value="Jaffna">Jaffna</option>
                          <option value="Puttalam">Puttalam</option>
                          <option value="Kurunegala">Kurunegala</option>
                          <option value="Gampaha">Gampaha</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Kalutara">Kalutara</option>
                          <option value="Anuradhapura">Anuradhapura</option>
                          <option value="Polonnaruwa">Polonnaruwa</option>
                          <option value="Matale">Matale</option>
                          <option value="Kandy">Kandy</option>
                          <option value="Nuwara Eliya">Nuwara Eliya</option>
                          <option value="Kegalle">Kegalle</option>
                          <option value="Ratnapura">Ratnapura</option>
                          <option value="Trincomalee">Trincomalee</option>
                          <option value="Batticaloa">Batticaloa</option>
                          <option value="Ampara">Ampara</option>
                          <option value="Badulla">Badulla</option>
                          <option value="Monaragala">Monaragala</option>
                          <option value="Hambantota">Hambantota</option>
                          <option value="Matara">Matara</option>
                          <option value="Galle">Galle</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="provinceInput">
                        <Form.Label>Province</Form.Label>
                        <Form.Select
                          name="province"
                          value={formInputs.province}
                          onChange={handleInputChange}
                        >
                          <option>Select Province</option>
                          <option value="Western">Western</option>
                          <option value="Central">Central</option>
                          <option value="Southern">Southern</option>
                          <option value="Northern">Northern</option>
                          <option value="Eastern">Eastern</option>
                          <option value="North Western">North Western</option>
                          <option value="North Central">North Central</option>
                          <option value="Uva">Uva</option>
                          <option value="Sabaragamuwa">Sabaragamuwa</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Postal Code and Country in One Row */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="postalCodeInput">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="pcode"
                          value={formInputs.pcode}
                          onChange={handleInputChange}
                          placeholder="Enter your postal code"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="countryInput">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={formInputs.country}
                          onChange={handleInputChange}
                          placeholder="Sri Lanka"
                          disabled // You can disable this if the country is always Sri Lanka
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
          <div className="form-container">
            <h4 className="cd-name">Payment Details</h4>
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-4" controlId="paymentOptions">
                    <Form.Label>Select Payment Method</Form.Label>
                    <div className="payment-options">
                      {/* Visa Option */}
                      <div
                        className={`payment-card ${
                          selectedPaymentMethod === "Visa" ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentMethodChange("Visa")}
                      >
                        <img
                          src={visaImage}
                          alt="Visa"
                          style={{ width: "50px", marginRight: "11px" }}
                        />
                        <span>Visa</span>
                      </div>

                      {/* MasterCard Option */}
                      <div
                        className={`payment-card ${
                          selectedPaymentMethod === "MasterCard"
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handlePaymentMethodChange("MasterCard")}
                      >
                        <img
                          src={mastercardImage}
                          alt="MasterCard"
                          style={{ width: "50px", marginRight: "11px" }}
                        />
                        <span>MasterCard</span>
                      </div>

                      {/* COD Option */}
                      <div
                        className={`payment-card ${
                          selectedPaymentMethod === "COD" ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentMethodChange("COD")}
                      >
                        <img
                          src={codImage}
                          alt="Cash on Delivery"
                          style={{
                            width: "50px",
                            marginRight: "11px",
                          }}
                        />
                        <span>COD</span>
                      </div>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div className="product-summary">
        <h4 className="cd-name">Order Items</h4>
        <div className="search-box-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Product"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button className="search-button">Search</button>
        </div>
        <div className="products">
          <table className="order-items-table">
            <thead>
              <tr>
                <th className="product-name-column">Product</th>
                <th className="quantity-column">Quantity</th>
                <th className="price-column">Price</th>
                <th className="remove-column"></th>{" "}
                {/* Empty header for the remove button */}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-name-column">
                    <div className="product-details">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-image"
                      />
                      <div className="product-info">
                        <span className="product-name">{item.productName}</span>
                        <span className="product-details-text">
                          {item.productDetails}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="quantity-column">
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <FaPlus />
                    </button>
                  </td>
                  <td className="price-column">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="remove-column">
                    <button
                      className="remove-button"
                      // onClick={() => handleRemoveItem(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="footer-styles">
              <tr>
                <td colSpan="2">Total Price</td>
                <td className="total-price">
                  LKR {calculateTotal().toFixed(2)}
                </td>
                <td>
                  <button
                    className="create-order-button"
                    onClick={handleSubmit}
                  >
                    Create Order
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
