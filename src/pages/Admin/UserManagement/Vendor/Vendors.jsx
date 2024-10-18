import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../../components/Common/Header";
import { FaPen, FaTrash } from "react-icons/fa";
import "./Vendors.css"; // Import the custom stylesheet

const Vendors = () => {
  const [vendors, setVendors] = useState([]); // State to store vendor data
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [editingVendor, setEditingVendor] = useState(null); // State to determine if editing or adding
  const [validationErrors, setValidationErrors] = useState({});

  // Vendor fields
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all vendors from the backend when the component loads
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/vendors`
        );
        setVendors(response.data); // Set the fetched vendors in state
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const deleteVendor = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${id}`
      );
      setVendors(vendors.filter((vendor) => vendor.id !== id));
      alert("Vendor deleted successfully!");
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  }

  // Open modal for adding or editing a vendor
  const openModal = (vendor = null) => {
    setEditingVendor(vendor);
    if (vendor) {
      setNic(vendor.nic);
      setEmail(vendor.email);
      setFirstName(vendor.firstName);
      setLastName(vendor.lastName);
      setUsername(vendor.username);
      setAddress(vendor.address);
      setContactNumber(vendor.contactNumber);
      setStatus(vendor.isActive ? "active" : "inactive");
      setPassword(""); // Set password to empty for editing
    } else {
      resetForm();
    }
    setShowModal(true);
  };
  

  // Reset form fields
  const resetForm = () => {
    setNic("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setAddress("");
    setContactNumber("");
    setStatus("active");
    setValidationErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};

    if (!nic.trim()) errors.nic = "NIC is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    if (!username.trim()) errors.username = "Username is required.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!contactNumber.trim()) errors.contactNumber = "Contact number is required.";
    else if (contactNumber.length !== 10)
      errors.contactNumber = "Contact number must be exactly 10 digits.";
    
    if (!password && !editingVendor) errors.password = "Password is required.";
    if (password && password.length < 6) errors.password = "Password must be at least 6 characters long.";

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.email = "Invalid email format.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // If no errors, return true
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // If form validation fails, return

    try {
      if (editingVendor) {
        // Update existing vendor (PUT request)
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/${editingVendor.id}`,
          {
            firstName,
            lastName,
            username,
            address,
            contactNumber,
            isActive: status === "active" ? true : false,
          }
        );
        setSuccessMessage("Vendor updated successfully!");
      } else {
        // Add new vendor (POST request)
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
          {
            nic,
            email,
            firstName,
            lastName,
            username,
            password,
            userType: "Vendor", // Setting the user type to "Vendor"
            address,
            contactNumber,
            isActive: status === "active" ? true : false,
          }
        );
        setSuccessMessage("Vendor registered successfully!");
      }

      // Refetch vendors after adding/updating
      const updatedVendors = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/vendors`
      );
      setVendors(updatedVendors.data); // Update the vendors list

      setShowModal(false); // Close the modal after submission
      resetForm(); // Reset form fields
    } catch (error) {
      setErrorMessage("Error saving vendor. Please try again.");
      console.error("Error saving vendor:", error);
    }
  };

  

  return (
    <div className="main-component">
      <Header
        title="Vendor Management"
        subtitle="Foster vendor relationships by managing accounts effectively."
      />
      <br />

      <div className="container mt-4">
        <div className="row">
          <div className="d-flex justify-content-between">
            <h5>Vendor List</h5>
            {/* Button to open modal for adding new vendor */}
            <button className="btn btn-danger mr-5" onClick={() => openModal()}>
              Add Vendor
            </button>
          </div>
          <div className="col-md-12">
            <table className="table table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Vendor Name</th>
                  <th>Email</th>
                  <th>NIC</th>
                  <th>Address</th>
                  <th>Contact Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        {vendor.firstName} {vendor.lastName}
                      </td>
                      <td>{vendor.email}</td>
                      <td>{vendor.nic}</td>
                      <td>{vendor.address}</td>
                      <td>{vendor.contactNumber}</td>
                      <td>
                        <span
                          className={`badge ${
                            vendor.isActive ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {vendor.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => openModal(vendor)}
                        >
                          <FaPen />
                        </button>
                        <button 
                          className="btn btn-sm"
                          onClick={() => deleteVendor(vendor.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No vendors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding/updating vendors */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nic" className="form-label">
                      NIC
                    </label>
                    <input
                      type="text"
                      id="nic"
                      className="form-control"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      disabled={!!editingVendor} // Disable NIC when editing
                      required
                    />
                    {validationErrors.nic && (
                      <small className="text-danger">
                        {validationErrors.nic}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!editingVendor} // Disable Email when editing
                      required
                    />
                    {validationErrors.email && (
                      <small className="text-danger">
                        {validationErrors.email}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    {validationErrors.firstName && (
                      <small className="text-danger">
                        {validationErrors.firstName}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    {validationErrors.lastName && (
                      <small className="text-danger">
                        {validationErrors.lastName}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    {validationErrors.username && (
                      <small className="text-danger">
                        {validationErrors.username}
                      </small>
                    )}
                  </div>
                  {!editingVendor && (
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!editingVendor}
                      />
                      {validationErrors.password && (
                        <small className="text-danger">
                          {validationErrors.password}
                        </small>
                      )}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    {validationErrors.address && (
                      <small className="text-danger">
                        {validationErrors.address}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      className="form-control"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                    {validationErrors.contactNumber && (
                      <small className="text-danger">
                        {validationErrors.contactNumber}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      id="status"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    {editingVendor ? "Update Vendor" : "Add Vendor"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Vendors;
