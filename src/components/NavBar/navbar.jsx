import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  );
  

}


export default NavBar;
