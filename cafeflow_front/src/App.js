import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MainPage from "./MainPage/Main.js";
import LoginPage from "./RegisterPage/Login.js";
import UserSignupPage from "./RegisterPage/UserSignup.js";
import AdminSignupPage from "./RegisterPage/AdminSignup.js";
import Header from "./Header.js";
import MapPage from "./Map/map.js";
import Boardlist from "./CommunityPage/BoardList.js";
import DetailBoard from "./CommunityPage/DetailBoard.js";
import Modify from "./MyPage/Modify.js";
import Delete from "./MyPage/Delete.js";
import Password from "./MyPage/Password.js";
import NewBoard from "./CommunityPage/NewBoard.js";
import Shoplist from "./ShopPage/ShopList.js";
import Shop from "./ShopPage/Shop.js";
import ShopRegister from "./ShopPage/ShopRegister.js";
import SeatView from "./SeatPage/SeatView.js";
import Example from "./ShopPage/example.js";
import SeatRegister from "./SeatPage/SeatRegister.js";
import OrderList from "./OrderPage/OrderList.js";
import Chatrooms from "./MyPage/Chatrooms.js";
import ShopModify from "./ShopPage/ShopModify.js";
import CafeList from "./MyPage/CafeList.js";
import AddMenu from "./OrderPage/AddMenu.js";
import MainChat from "./Chat/MainChat.js";
import None from "./MainPage/None.js";
import CustomError from "./Component/CustomError";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${userToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response && error.response.status === 401) {
            setShowErrorModal(true);
          }
          return Promise.reject(error);
        }
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <>
      <div className="App">
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage/modify" element={<Modify />} />
            <Route path="/mypage/delete" element={<Delete />} />
            <Route path="/mypage/password" element={<Password />} />
            <Route path="/mypage/chatrooms" element={<Chatrooms />} />
            <Route path="/mypage/my-cafe" element={<CafeList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminsignup" element={<AdminSignupPage />} />
            <Route path="/usersignup" element={<UserSignupPage />} />
            <Route path="/location" element={<MapPage />} />
            <Route path="/community" element={<Boardlist />} />
            <Route path="/create-post" element={<NewBoard />} />
            <Route path="/community/:postId" element={<DetailBoard />} />
            <Route path="/shop" element={<Shoplist />} />
            <Route path="/example/:idx" element={<Shop />} />
            <Route path="/seat" element={<SeatRegister />} />
            <Route path="/seat/:cafeId" element={<SeatView />} />
            <Route path="/shop/:idx" element={<Example />} />
            <Route path="/modify/:idx" element={<ShopModify />} />
            <Route path="/shop/:idx/addmenu" element={<AddMenu />} />
            <Route path="/shop/:idx/orderlist" element={<OrderList />} />
            <Route path="/shopregister" element={<ShopRegister />} />
            <Route path="*" element={<None />} />
          </Routes>
        </div>
      </div>
      <footer className="ft">
        <p>이용 약관 | 개인정보 처리방침 | 사업자 정보 확인</p>
        <p>오렌지팀 | 금오공과대학교 CE </p>
        <p>&copy; 2024 Orange. All rights reserved.</p>
        <a href="https://github.com/Cafe-Flow">Our Web Site</a>
      </footer>
      <CustomError
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        handleConfirm={handleLogout}
      >
        세션이 만료 되었습니다. 다시 로그인 해주세요.
      </CustomError>
    </>
  );
}

export default App;
