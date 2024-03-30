import './App.css';
import { Container, Navbar, Nav }from 'react-bootstrap';

function Header() {
    return (
        <>
<Navbar expand="sm" className="custom-navbar-style">
  <Container className="custom-navbar-container">
    <Navbar.Brand href="#" className="custom-navbar-brand">      
      <img
        src="/카페.png"
        alt="Logo"
        height="50"
        widght="100"
      />{' '}
    </Navbar.Brand>
  </Container>
    <Nav className="me-auto">
      <Nav.Link href="shop">Shop</Nav.Link>
      <Nav.Link href="order">Order</Nav.Link>
      <Nav.Link href="event">Event</Nav.Link>
      <Nav.Link href="community">Community</Nav.Link>
    </Nav>
  </Navbar>
</>
);
}

export default Header;