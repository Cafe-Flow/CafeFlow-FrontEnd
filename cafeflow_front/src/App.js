import "./App.css";
import { Routes, Route } from "react-router-dom";
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
import Query from "./MyPage/Chatrooms.js";
import NewBoard from "./CommunityPage/NewBoard.js";
import Shoplist from "./ShopPage/ShopList.js";
import Shop from "./ShopPage/Shop.js";
import ShopRegister from "./ShopPage/ShopRegister.js";
import SeatView from "./SeatPage/SeatView.js";
import Example from "./ShopPage/example.js";
import SeatRegister from "./SeatPage/SeatRegister.js";
import OrderList from "./OrderPage/OrderList.js";
import MainChat from "./Chat/MainChat.js";
import Chatrooms from "./MyPage/Chatrooms.js";

function App() {
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminsignup" element={<AdminSignupPage />} />
            <Route path="/usersignup" element={<UserSignupPage />} />
            <Route path="/location" element={<MapPage />} />
            <Route path="/order/orderlist" element={<OrderList />} />
            <Route path="/community" element={<Boardlist />} />
            <Route path="/create-post" element={<NewBoard />} />
            <Route path="/community/:postId" element={<DetailBoard />} />
            <Route path="/shop" element={<Shoplist />} />
            <Route path="/shop/:idx" element={<Shop />} />
            <Route path="/shopregister" element={<ShopRegister />} />
            <Route path="/seat" element={<SeatRegister />} />
            <Route path="/seat/:cafeId" element={<SeatView />} />
            <Route path="/example" element={<Example />} />
            <Route path="/chat" element={<MainChat />} />
          </Routes>
        </div>
      </div>
      <footer className="ft">
        <p>이용 약관 | 개인정보 처리방침 | 사업자 정보 확인</p>
        <p>오렌지팀 | 금오공과대학교 CE </p>
        <p>&copy; 2024 Orange. All rights reserved.</p>
        <a href="https://github.com/Cafe-Flow">Our Web Site</a>
      </footer>
    </>
  );
}

export default App;
