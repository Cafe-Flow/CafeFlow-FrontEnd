import React, { useState, useEffect } from "react";
import "./App.css";
import CustomCheckModal from "./Component/CustomCheckModal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { useUser } from "./MainPage/UserContext";

function Header() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState("");
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    console.log("start");
    const updateUserInfo = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setIsLoggedIn(true);
        setUserInfo(userInfo);
        setNickname(userInfo.nickname);
        console.log("setting");
      }
    };

    updateUserInfo();
  }, [setUserInfo]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    setUserInfo(null);
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  return (
    <>
      <Navbar expand="lg" className="custom-navbar-style" expanded={expanded}>
        <Container className="custom-navbar-container">
          <Navbar.Brand href="/" className="custom-navbar-logo">
            <img className="custom-navbar-brand" src="/img/MainLogo.png" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="nav-container">
              <a className="nav-element" href="/shop">
                매장
              </a>
              <a
                className={`nav-element ${
                  location.pathname.startsWith("/location") ? "active" : ""
                }`}
                href="/location"
              >
                위치 찾기
              </a>
              <a
                className={`nav-element ${
                  location.pathname.startsWith("/order") ? "active" : ""
                }`}
                href="/"
              >
                메뉴 주문
              </a>
              <a className="nav-element" href="/">
                이벤트
              </a>
              <a
                className={`nav-element ${
                  location.pathname.startsWith("/community") ? "active" : ""
                }`}
                href="/community"
              >
                커뮤니티
              </a>
            </div>
          </Navbar.Collapse>
          <div className="hide-on-expanded">
            {isLoggedIn ? (
              <>
                <Link className="nav-side-element1" to={"/mypage/modify"}>
                  <span className="name-style">{nickname}</span> 님
                </Link>
                <Link
                  className="nav-side-element2"
                  onClick={handleShowLogoutModal}
                >
                  로그아웃
                </Link>
              </>
            ) : (
              <a className="nav-side-element2" href="/login">
                로그인
              </a>
            )}
          </div>
        </Container>
      </Navbar>
      <CustomCheckModal
        show={showLogoutModal}
        handleClose={handleCloseLogoutModal}
        handleConfirm={handleLogout}
      >
        ☕로그아웃 하시겠습니까?☕
      </CustomCheckModal>
    </>
  );
}

export default Header;
