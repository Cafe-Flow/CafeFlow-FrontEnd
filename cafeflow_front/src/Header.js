import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Navbar, Nav }from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState('');

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
            <p className='nav-element'>Shop</p>
            <p className='nav-element'>Order</p>
            <p className='nav-element'>Event</p>
            <p className='nav-element'>Community</p>
          </Nav>
        </Navbar.Collapse>
        <div className="hide-on-expanded">
        {isLoggedIn ? (
          <>
              <a className='nav-side-element1' href='/profile'><span className='name-style'>가나다</span> 님</a>
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