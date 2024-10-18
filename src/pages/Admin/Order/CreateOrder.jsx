import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Common/Header";
import visaImage from "../../../images/visa.png";
import mastercardImage from "../../../images/master.png";
import codImage from "../../../images/cod.png";
import { FaSearch, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "./OrderStyles.css";
import ReactPaginate from "react-paginate";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/customer/products`
      );
      const data = await response.json();
      console.log(data);
      setProducts(data); // Store products in state
      setFilteredProducts(data); // Initially show all products
    } catch (error) {
      setErrorMessage("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // Handle search query change and filter products
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      return nameMatch || categoryMatch;
    });

    setFilteredProducts(filtered);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * productsPerPage;
  const selectedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Handle adding product to order
  const handleAddProduct = (product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      // Check if the new quantity exceeds the stock quantity
      if (newQuantity > product.stockQuantity) {
        // Optionally show an alert or notification here
        alert(
          `Cannot add more than ${product.stockQuantity} items of ${product.name}.`
        );
        return prevItems; // Return the previous items unchanged
      }

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            quantity: 1, // Set initial quantity to 1
            productStatus: 0,
          },
        ];
      }
    });
  };

  const handleQuantityChange = (id, change) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;

          // Ensure quantity doesn't go below 1 or exceed stock quantity
          if (newQuantity < 1) {
            return { ...item, quantity: 1 }; // Ensure quantity doesn't go below 1
          } else if (newQuantity > item.stockQuantity) {
            // Optionally show an alert or notification here
            alert(
              `Cannot exceed the available stock of ${item.stockQuantity} for ${item.productName}.`
            );
            return item; // Return unchanged if exceeding stock
          }

          return { ...item, quantity: newQuantity }; // Update quantity
        }
        return item; // Return unchanged if not the target item
      })
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Form input state
  const [formInputs, setFormInputs] = useState({
    paymentMethod: selectedPaymentMethod,
    customerName: "",
    email: "",
    phone: "",
    del_ins: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
    singleBillingAddress: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setFormInputs((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentMethodMap = {
      Visa: 0,
      Master: 1,
      COD: 2,
    };

    const orderDto = {
      orderItemsGroups: [
        {
          listItemId: 0,
          items: orderItems.map((item) => ({
            productId: item.uniqueProductId,
            productName: item.name,
            vendorId: item.vendorId,
            quantity: item.quantity,
            price: item.price,
            productStatus: item.productStatus || 0,
          })),
        },
      ],
      paymentMethod: paymentMethodMap[selectedPaymentMethod],
      customerId: "",
      createdByCustomer: false,
      createdByAdmin: true,
      billingDetails: {
        customerName: formInputs.customerName,
        email: formInputs.email,
        phone: formInputs.phone,
        singleBillingAddress: formInputs.singleBillingAddress || "",
        billingAddress: {
          streetAddress: formInputs.streetAddress,
          city: formInputs.city,
          province: formInputs.province,
          postalCode: formInputs.postalCode,
          country: formInputs.country,
        },
      },
    };

    // Logging for debugging
    console.log("Order DTO:", JSON.stringify(orderDto, null, 2));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/Admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDto),
        }
      );

      // Log the response to see the raw text
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Add this line

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = JSON.parse(responseText); // Try parsing the response text
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing response:", e);
        }
        throw new Error(`Failed to create order: ${errorMessage}`);
      }

      const result = JSON.parse(responseText); // Parse the response text
      setShowSuccessAlert(true);
      setErrorMessage("");
      console.log(result);
      navigate("/dashboard/orders");
    } catch (error) {
      setErrorMessage(error.message);
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
        <Col md={5}>
          <div className="form-container">
            <h4 className="cd-name">Order Details</h4>
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-4" controlId="nameInput">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formInputs.customerName}
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
        <Col md={5}>
          <div className="form-container-double">
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
                        name="streetAddress"
                        value={formInputs.streetAddress}
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
                        <Form.Group
                          className="mb-4"
                          controlId="postalCodeInput"
                        >
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="postalCode"
                            value={formInputs.postalCode}
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
                            selectedPaymentMethod === "Master" ? "selected" : ""
                          }`}
                          onClick={() => handlePaymentMethodChange("Master")}
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
          <button className="add-button">Search</button>
        </div>

        {/* Search Results */}
        <div className="products">
          {selectedProducts.length > 0 ? (
            <table className="order-items-table">
              <thead>
                <tr>
                  <th className="category-column">Category</th>
                  <th className="product-name-column">Product</th>
                  <th className="stock-column">Stock</th>
                  <th className="price-column">Price</th>
                  <th className="add-column"></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="category-column">{product.category}</td>
                    <td className="product-name-column">{product.name}</td>
                    <td className="stock-column">
                      {product.stockQuantity > 5 ? (
                        <span className="badge in-stock">In Stock</span>
                      ) : (
                        <span className="badge low-stock">
                          Low Stock: {product.stockQuantity}
                        </span>
                      )}
                    </td>
                    <td className="price-column">LKR {product.price}</td>
                    <td className="add-column">
                      <button
                        className="add-button"
                        onClick={() => handleAddProduct(product)}
                        disabled={product.stockQuantity <= 0}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products found. Please adjust your search.</p>
          )}
        </div>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />

        <div className="products">
          <table className="order-items-table">
            <thead>
              <tr>
                <th className="product-id-column">Product ID</th>{" "}
                <th className="product-name-column">Product Name</th>
                <th className="quantity-column">Quantity</th>
                <th className="price-column">Price</th>
                <th className="remove-column"></th>{" "}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-id-column">
                    <span className="product-id">{item.uniqueProductId}</span>{" "}
                  </td>
                  <td className="product-name-column">
                    <div className="product-details">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-image"
                      />
                      <div className="product-info">
                        <span className="product-name">{item.name}</span>
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
                      disabled={item.quantity >= item.stockQuantity} // Disable if max stock reached
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
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="footer-styles">
              <tr>
                <td colSpan="3">Total Price</td>
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
