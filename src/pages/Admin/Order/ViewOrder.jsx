import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Header from "../../../components/Common/Header";
import "./OrderStyles.css";

const ViewOrder = () => {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // User role
  const [ userId, setUserId ] = useState( "" ); // Vendor ID for vendor users
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

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
    6: "Pending",
    1: "Accepted",
    2: "Processing",
    4: "PartiallyDelivered",
    3: "Delivered",
    5: "Cancelled",
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

  return (
    <div className="main-component">
      <Header
        title="View Order"
        subtitle="Detailed Overview of Customer Orders"
      />
      <br />

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

export default ViewOrder;
