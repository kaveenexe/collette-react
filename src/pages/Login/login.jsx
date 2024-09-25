import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import NavBar from "../../components/NavBar/navbar";
import "./login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for handling the form data here
    console.log("Submitted:", { email, password });
  };

  return (
    <div>
        <NavBar />
        <div className="formContainer">
            <div className="formWrapper">
                        
                        <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        </Form.Group>
                        <div>

                        <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        </Form.Group>
                        
                        </div>

                        {/* <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group> */}
                        <Button className="submitButton" variant="primary" type="submit">
                        Submit
                        </Button>
                        
                        </Form>
            </div>
        </div>
    </div>
  );
};

export default LoginForm;
