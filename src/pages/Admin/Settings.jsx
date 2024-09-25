import * as React from "react";
import Header from "../../components/Admin/Header";
import * as formik from "formik";
import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const Settings = () => {
  // validation
  const { Formik } = formik;
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    Email: yup.string().matches(emailExp, "Email is not valid"),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Phone Number must be 10 characters")
      .max(10, "Phone Number must be 10 characters"),
    pass: yup
      .string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
    confirm: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        'Must match "New Password" field value'
      ),
  });

  return (
    <div className="settings-container">
      <Header
        title="Account Settings"
        subtitle="Here you can change your account information"
      />
      <br />
      <Formik
        validationSchema={schema}
        onSubmit={console.log}
        initialValues={{
          firstName: "Maleesha",
          lastName: "Shashindi",
          Email: "maleeshas.2000@gmail.com",
          phoneNumber: "0703750933",
          confirm_password: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik01">
                <Form.Label className="fromLabel">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik02">
                <Form.Label className="fromLabel">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                />

                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik03">
                <Form.Label className="fromLabel">Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="Email"
                  value={values.Email}
                  onChange={handleChange}
                  isInvalid={!!errors.Email}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.Email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik04">
                <Form.Label className="fromLabel">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: 0712345678"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <br />
            <h5>CHANGE PASSWORD</h5>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik05">
                <Form.Label className="fromLabel">Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  isInvalid={!!errors.state}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik06">
                <Form.Label className="fromLabel">New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="pass"
                  value={values.pass}
                  onChange={handleChange}
                  isInvalid={!!errors.pass}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.pass}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik07">
                <Form.Label className="fromLabel">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm"
                  value={values.confirm}
                  onChange={handleChange}
                  isInvalid={!!errors.confirm}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirm}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
