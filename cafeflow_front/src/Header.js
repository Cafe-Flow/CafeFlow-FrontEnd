import React, { useState } from 'react';
import './App.css';
import { Container, Navbar, Nav, NavDropdown }from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);

    return (
        <>
<Navbar expand="lg" className="custom-navbar-style" expanded={expanded}>
  <Container className="custom-navbar-container">
    <Navbar.Brand href="#" className="custom-navbar-brand">      
    <div className='Logo-font'>
    <a onClick={() => navigate('/')}>Cafe Flow</a>
    </div>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
    <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="shop">Shop</Nav.Link>
            <Nav.Link href="order">Order</Nav.Link>
            <Nav.Link href="event">Event</Nav.Link>
            <Nav.Link href="community">Community</Nav.Link>
          </Nav>
          {isLoggedIn ? (
            <Nav>
              <Nav.Link href="profile">사용자님</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="login">로그인</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
  </Container>
  </Navbar>
  {isLoading && <div className="loading-bar"></div>} {/* 로딩바 조건부 렌더링 */}
</>
);
}

export default Header;