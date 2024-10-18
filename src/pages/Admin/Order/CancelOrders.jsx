import React, { useEffect, useState } from "react";
import Header from "../../../components/Common/Header";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap
import Button from "react-bootstrap/Button"; // Import Button from react-bootstrap
import "./OrderStyles.css";
import { FaEye } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Make sure this is correct

const CancelOrders = () => {
  const [orders, setOrders] = useState([]); // State to hold fetched orders
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); // State for modal visibility
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store selected order
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  // Fetch pending cancellation requests from the backend
  const fetchPendingCancellations = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/pending-cancellations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending cancellations");
      }

      const data = await response.json();
      setOrders(data); // Update state with fetched orders
    } catch (err) {
      setError(err.message); // Set error message if the fetch fails
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchPendingCancellations();
  }, []);

  const statusMapping = {
    0: "Purchased",
    6: "Pending",
    1: "Accepted",
    2: "Processing",
    4: "Partially Delivered",
    3: "Delivered",
    5: "Cancelled",
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

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    const { dbId, orderId } = selectedOrder;
    console.log("Canceling order with DB ID:", dbId);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${dbId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: dbId,
            orderId: dbId,
            cancellationApproved: true,
            cancellationDate: new Date().toISOString(),
            cancelRequestStatus: 0,
          }),
        }
      );

      const result = await response.json();
      console.log("Cancellation result:", result);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== dbId)
      );
      setShowSuccessAlert(true);
      setError("");
    } catch (err) {
      setError(err.message);
      setShowSuccessAlert(false);
    } finally {
      setLoading(false);
      setShowCancelModal(false); // Close the modal after the cancellation
    }
  };

  // Function to handle viewing order
  const handleViewOrder = (id) => {
    navigate(`/dashboard/view-order/${id}`);
  };

  // Open the modal and store the selected order information
  const handleOpenCancelModal = (dbId, orderId, status) => {
    if (status === 3 || status === 4) {
      // Check if order is delivered or partially delivered
      setErrorMessage(
        `This order can't be cancelled. It's already ${statusMapping[status]}.`
      );
      setShowErrorModal(true); // Show error modal
    } else {
      setSelectedOrder({ dbId, orderId });
      setShowCancelModal(true);
    }
  };

  return (
    <div className="main-component">
      <Header
        title="Order Cancel Requests"
        subtitle="Confirm Order Cancellation Below"
      />
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          className="success-alert"
        >
          Order cancelled successfully!
        </Alert>
      )}
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="error-alert"
        >
          {error}
        </Alert>
      )}
      <div className="order-table">
        <table className="table">
          <thead>
            <tr>
              <th className="orderid-column">Order ID</th>
              <th className="customer-column">Customer</th>
              <th className="order-date-column">Order Date</th>
              <th className="cancel-request-date-column">
                Cancel Request Date
              </th>
              <th className="total-column">Total</th>
              <th className="order-status-column">Order Status</th>
              <th className="confirm-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order.id}>
                  <td className="orderid-column">{order.orderId}</td>
                  <td className="customer-column">
                    <strong>{order.billingDetails.customerName}</strong>
                    <br />
                    <small>{order.billingDetails.email}</small>
                  </td>
                  <td
                    className="order-date-column"
                    dangerouslySetInnerHTML={{
                      __html: formatDate(order.orderDate),
                    }}
                  ></td>
                  <td
                    className="cancel-request-date-column"
                    dangerouslySetInnerHTML={{
                      __html: formatDate(
                        order.orderCancellation.cancellationDate
                      ),
                    }}
                  ></td>
                  <td className="total-column">LKR{order.totalAmount}</td>
                  <td className="order-status-column">
                    <span
                      className={`status-badge ${statusMapping[
                        order.status
                      ].toLowerCase()}`}
                    >
                      {statusMapping[order.status]}
                    </span>
                  </td>
                  <td className="confirm-column">
                    <button
                      className="action-btn view2-btn"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={
                        () =>
                          handleOpenCancelModal(
                            order.id,
                            order.orderId,
                            order.status
                          ) // Pass the order status
                      }
                    >
                      <MdCancel />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Cancellation Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CancelOrders;
