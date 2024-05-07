import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Navbar, Nav }from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState('');
  const location = useLocation();

  useEffect(() => {
    console.log("start");
    const updateUserInfo = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setIsLoggedIn(true);
        setNickname(userInfo.nickname);
        console.log("setting");
      }
    };
  
    updateUserInfo(); 
  }, []);

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      localStorage.removeItem('userInfo');  
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);              
      navigate('/');                    
    }
  };


    return (
        <>
<Navbar expand="lg" className="custom-navbar-style" expanded={expanded}>
  <Container className="custom-navbar-container">
    <Navbar.Brand href="#" className="custom-navbar-brand">      
    <a className='Logo-font' href="/">Cafe Flow</a>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
    <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-container">
            <a className='nav-element' href='/shop'>Shop</a>
            <a className={`nav-element ${location.pathname === '/location' ? 'active' : ''}`} href="/location">Location</a>
            <a className='nav-element' href='/'>Order</a>
            <a className='nav-element' href='/'>Event</a>
            <a className={`nav-element ${location.pathname === '/community' ? 'active' : ''}`} href="/community">Community</a>
          </Nav>
        </Navbar.Collapse>
        <div className="hide-on-expanded">
        {isLoggedIn ? (
          <>
              <a className='nav-side-element1' href='/profile'><span className='name-style'>{nickname}</span> 님</a>
              <a className='nav-side-element2' onClick={handleLogout} href='/'>로그아웃</a>
              </> ) : (
              <a className='nav-side-element2' href='/login'>로그인</a>
            )}
            </div>

  </Container>
  </Navbar>
</>
);
}

export default Header;