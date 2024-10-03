import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext for managing user login

const LoginPage = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          username, // Send the username instead of email
          password,
        }
      );

      // Extract token and user data from the response
      const { token, userId, firstName, lastName, role, email, address, nic } = response.data;

      // Save user data in AuthContext
      login({ userId, firstName, lastName, role, email, address, nic }, token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#d9eaff " }}>
      <div className="container py-2 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img src="/assets/NonBGLogo.png" alt="Logo" width={200} />
                      </div>

                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>
                        Sign into your account
                      </h5>

                      {errorMessage && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errorMessage}
                        </div>
                      )}

                      <div className="form-outline mb-4">
                        <input
                          id="form2Example17"
                          className="form-control form-control-lg"
                          value={username} // Bind username input to state
                          onChange={(e) => setUsername(e.target.value)} // Update username state
                          required
                        />
                        <label className="form-label" htmlFor="form2Example17">
                          User Name
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          value={password} // Bind password input to state
                          onChange={(e) => setPassword(e.target.value)} // Update password state
                          required
                        />
                        <label className="form-label" htmlFor="form2Example27">
                          Password
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
