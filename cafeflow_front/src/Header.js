import React, { useState, useEffect } from "react";
import "./App.css";
import CustomCheckModal from "./Component/CustomCheckModal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { useUser } from "./MainPage/UserContext";

function Header() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, login, logout } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState("");
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

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

  useEffect(() => {
    if (!userInfo) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [userInfo]);

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
            <img
              className="custom-navbar-brand"
              src="/img/MainLogo.png"
              alt="로고"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="nav-container">
            { userInfo !== null && userInfo.userType === "ADMIN" && (
              <a className="nav-element" href="/shopregister">
                매장 등록
              </a>
            )}
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
                  location.pathname.startsWith("/community") ? "active" : ""
                }`}
                href="/community"
              >
                커뮤니티
              </a>
                            <a
                className={`nav-element ${
                  location.pathname.startsWith("/promotion") ? "active" : ""
                }`}
                href="/promotion"
              >
                이벤트
              </a>
            </div>
          </Navbar.Collapse>
          <div className="hide-on-expanded">
            {isLoggedIn ? (
              <>
                <p className="nav-side-element1" onClick={toggleTooltip}>
                  <span className="name-style">{userInfo.nickname}</span> 님
                </p>
                <div
                  className={`mypage-tooltip ${
                    tooltipVisible ? "" : "invisible"
                  }`}
                >
                  <div className="mypage-tooltip-top">
                    <Link to="/mypage/modify">
                      <img
                        src={`data:image/jpeg;base64,${userInfo.image}`}
                        alt="User Avatar"
                      />
                    </Link>
                    <div className="mypage-tooltip-top-user">
                      {userInfo.userType === "USER" ? (
                        <p>
                          {userInfo.nickname}
                          <span> 서비스 이용자</span>
                        </p>
                      ) : (
                        <p>
                          {userInfo.nickname}
                          <span> 카페 관리자</span>
                        </p>
                      )}
                      <p>{userInfo.email}</p>
                    </div>
                  </div>
                  <ul>
                    {userInfo.userType === "ADMIN" && (
                      <li>
                        <Link to="/mypage/my-cafe">내 매장</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/mypage/modify">내 정보</Link>
                    </li>
                    <li>
                      <Link to="/mypage/password">비밀번호 변경</Link>
                    </li>
                    <li>
                      <Link to="/mypage/chatrooms">채팅 목록</Link>
                    </li>
                    <li>
                      <Link to="/mypage/delete">회원 탈퇴</Link>
                    </li>
                  </ul>
                  <div
                    className="mypage-tooltip-logout"
                    onClick={handleShowLogoutModal}
                  >
                    로그아웃
                  </div>
                </div>
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
