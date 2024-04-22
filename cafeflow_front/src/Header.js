import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Modal, Container, Navbar, Nav }from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState('');
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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

      localStorage.removeItem('userInfo');  
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);    
     
      navigate('/');                    
      setShowLogoutModal(false);     
  };


  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);


    return (
        <>
<Navbar expand="lg" className="custom-navbar-style" expanded={expanded}>
  <Container className="custom-navbar-container">
    <Navbar.Brand href="/" className='custom-navbar-logo'>      
    <img className="custom-navbar-brand" src="/img/MainLogo.png"/>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
    <Navbar.Collapse id="basic-navbar-nav">
          <div className="nav-container">
            <a className='nav-element' href='/'>Shop</a>
            <a className={`nav-element ${location.pathname === '/location' ? 'active' : ''}`} href="/location">Location</a>
            <a className='nav-element' href='/'>Order</a>
            <a className='nav-element' href='/'>Event</a>
            <a className={`nav-element ${location.pathname === '/community' ? 'active' : ''}`} href="/community">Community</a>
          </div>
        </Navbar.Collapse>
        <div className="hide-on-expanded">
        {isLoggedIn ? (
          <>
                  <Link className='nav-side-element1' to={'/mypage/modify'}>
      <span className='name-style'>{nickname}</span> 님
    </Link>
              <Link className='nav-side-element2' onClick={handleShowLogoutModal}>로그아웃</Link>
              </> ) : (
              <a className='nav-side-element2' href='/login'>로그인</a>
            )}
            </div>
  </Container>
  </Navbar>
  <Modal 
      show={showLogoutModal} 
      onHide={handleCloseLogoutModal}
      className='modal-position'>
        <Modal.Header>
          <Modal.Title className='Logo-font'>CafeFlow</Modal.Title>
        </Modal.Header>
        <Modal.Body className='h6-font' style={{fontSize : "20px"}}>☕로그아웃 하시겠습니까?☕</Modal.Body>
        <Modal.Footer>
        <Button style={{backgroundColor:"white", color:"black", borderColor:"white"}} onClick={handleLogout}>
            예
          </Button>
          <Button style={{backgroundColor:"white", color:"black", borderColor:"white"}}onClick={handleCloseLogoutModal}>
            아니요
          </Button>
        </Modal.Footer>
      </Modal>
</>
);
}

export default Header;