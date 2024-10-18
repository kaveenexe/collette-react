import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Modal, Form, ProgressBar } from 'react-bootstrap';
import { User, Mail, Key, CreditCard, MapPin, BarChart2, Users, FileText, Settings } from 'lucide-react';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [address, setAddress] = useState(user.address);
    const [isActive, setIsActive] = useState(user.isActive);

    const cardStyle = {
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        border: 'none',
    };

    const headerStyle = {
        background: '#0652B7',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        padding: '20px',
    };

    const tabStyle = (isActive) => ({
        cursor: 'pointer',
        padding: '20px',
        backgroundColor: isActive ? '#0652B7' : '#f8f9fa',
        color: isActive ? 'white' : '#4A0E4E',
        borderRadius: '8px',
        marginBottom: '10px',
        transition: 'all 0.3s ease',
    });

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleUpdateUser = async () => {
        const updatedUser = {
          firstName,
          lastName,
          username,
          address,
          isActive,
        };
    
        try {
          const response = await fetch(`http://localhost:5134/api/Users/${user.userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          });
    
          if (response.ok) {
            // Handle success (e.g., show a success message or refresh user data)
            alert("Profile updated successfully!");
            handleClose();
          } else {
            // Handle error
            alert("Failed to update profile. Please try again.");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("An error occurred. Please try again.");
        }
      };

    return (
        <Container fluid className="py-4" style={{ background: '#f2f8ff  ' }}>
            <Row className="mb-4">
                <Col>
                    <Card style={cardStyle}>
                        <Card.Body style={headerStyle}>
                            <h2 className="text-center mb-3">Welcome, Admin {user.firstName}!</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Card style={cardStyle}>
                        <Card.Body>
                            <div style={tabStyle(activeTab === 'personal')} onClick={() => setActiveTab('personal')}>
                                <User size={18} /> Personal Info
                            </div>
                            <div style={tabStyle(activeTab === 'account')} onClick={() => setActiveTab('account')}>
                                <CreditCard size={18} /> Account Details
                            </div>
                            <div style={tabStyle(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>
                                <BarChart2 size={18} /> Statistics
                            </div>
                            <Button variant="outline-primary" className="w-100 mt-3" onClick={handleShow}>
                                Update Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card style={cardStyle}>
                        <Card.Body>
                            {activeTab === 'personal' && (
                                <>
                                    <h4><User className="me-2" /> Personal Information</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><User size={18} className="me-2" /> Name</div>
                                            <span>{user.firstName} {user.lastName}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><Mail size={18} className="me-2" /> Email</div>
                                            <span>{user.email}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><Key size={18} className="me-2" /> Role</div>
                                            <Badge bg="danger">{user.role}</Badge>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </>
                            )}
                            {activeTab === 'account' && (
                                <>
                                    <h4><CreditCard className="me-2" /> Account Details</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><Key size={18} className="me-2" /> User ID</div>
                                            <span>{user.userId}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><CreditCard size={18} className="me-2" /> NIC</div>
                                            <span>{user.nic}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div><MapPin size={18} className="me-2" /> Address</div>
                                            <span>{user.address}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </>
                            )}
                            {activeTab === 'stats' && (
                                <>
                                    <h4><BarChart2 className="me-2" /> Platform Statistics</h4>
                                    <Row>
                                        <Col md={4}>
                                            <Card className="text-center mb-3" style={{background: '#F3E5F5'}}>
                                                <Card.Body>
                                                    <Users size={24} className="mb-2" />
                                                    <h5>Total Users</h5>
                                                    <h3>1,234</h3>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="text-center mb-3" style={{background: '#E8EAF6'}}>
                                                <Card.Body>
                                                    <FileText size={24} className="mb-2" />
                                                    <h5>Total Orders</h5>
                                                    <h3>5,678</h3>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="text-center mb-3" style={{background: '#E0F2F1'}}>
                                                <Card.Body>
                                                    <Settings size={24} className="mb-2" />
                                                    <h5>System Health</h5>
                                                    <h3>98%</h3>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <h5 className="mt-4">User Growth</h5>
                                    <ProgressBar now={85} label={`85%`} className="mb-3" />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton style={headerStyle}>
            <Modal.Title>Update Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Status"
                checked={true} // Always checked
                disabled // Disabled to prevent changes
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
        </Container>
    );
}

export default AdminDashboard;