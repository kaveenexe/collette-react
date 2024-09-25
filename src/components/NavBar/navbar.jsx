import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../../images/white_logo.jpg";

function NavBar() {
    
return (
    <Navbar bg="light" data-bs-theme="light">
        <Container>
        <Navbar.Brand href="#">
          {" "}
          {/* <img className="navlogo" src={Logo} alt="logo" />{" "} */}
          <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "7rem",
                  marginRight: "0.6rem",
                  marginBottom: "0.2rem",
                }}
              />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/home">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard">
            Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={NavLink} to="/products">
            Products
          </Nav.Link>
        </Nav>
        </Container>
      </Navbar>
  );
  

}


export default NavBar;
