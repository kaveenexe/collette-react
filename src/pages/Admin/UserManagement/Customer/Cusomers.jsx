import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../../../components/Common/Header";
import { AuthContext } from "../../../../context/AuthContext";

const Customers = () => {
  const { user } = useContext(AuthContext); // Get logged-in user details from AuthContext
  const [customers, setCustomers] = useState([]); // Store customers data
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all customers from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/customers`);
        setCustomers(response.data); // Set customers in state
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Handle status change (for CSR only)
  const handleStatusChange = async (customerId, customer) => {
    try {
      // Ensure the payload includes all necessary fields for UserUpdateDto
      const payload = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        username: customer.username,
        address: customer.address,
        isActive: !customer.isActive, // Toggle the current status
      };
  
      console.log("Sending payload:", payload); // Log the payload being sent
  
      // Make the PUT request to update the customer status
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${customerId}`, payload);
  
      // Update status in the UI after successful update
      setCustomers((prevCustomers) =>
        prevCustomers.map((prevCustomer) =>
          prevCustomer.id === customerId ? { ...prevCustomer, isActive: !prevCustomer.isActive } : prevCustomer
        )
      );
  
      setSuccessMessage("Customer status updated successfully.");
    } catch (error) {
      console.error("Error updating customer status:", error);
      setErrorMessage("Error updating status. Please try again.");
    }
  };
  
  
  
  

  return (
    <div className="main-component">
      <Header title="Customer Management" subtitle="Manage Your Customers Here" />
      <br />

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <table className="table table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>NIC</th>
                  <th>Address</th>
                  <th>Status</th>
                  {user?.role === "CSR" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.firstName} {customer.lastName}</td>
                      <td>{customer.email}</td>
                      <td>{customer.nic}</td>
                      <td>{customer.address}</td>
                      <td>
                        <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {customer.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {user?.role === "CSR" && (
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleStatusChange(customer.id, customer)}
                          >
                            {customer.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={user?.role === "CSR" ? "7" : "6"} className="text-center">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
