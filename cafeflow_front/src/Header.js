import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Navbar, Nav }from 'react-bootstrap';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setIsLoggedIn(true);
      setNickname(userInfo.nickname); 
    }
  }, []);

    return (
        <>
<Navbar expand="lg" className="custom-navbar-style" expanded={expanded}>
  <Container className="custom-navbar-container">
    <Navbar.Brand href="#" className="custom-navbar-brand">      
    <div className='Logo-font'>
    <a  href="/" style = {{color:"#D5C4A1"}}>Cafe Flow</a>
    </div>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />

    <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-container">
            <p className='nav-element'>Shop</p>
            <p className='nav-element'>Order</p>
            <p className='nav-element'>Event</p>
            <p className='nav-element'>Community</p>
          </Nav>
        </Navbar.Collapse>
        <div className="hide-on-expanded">
        {isLoggedIn ? (
          <>
              <a className='nav-side-element' href='/profile'> {nickname}님</a>
              <a className='nav-side-element' href='/'> 로그아웃</a>
              </>
            ) : (
              <a href='/login'>로그인</a>
            )}
            </div>

  </Container>
  </Navbar>
</>
);
}

export default Header;