import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage/Main.js';
import LoginPage from './RegisterPage/Login.js';
import UserSignupPage from './RegisterPage/UserSignup.js'
import AdminSignupPage from './RegisterPage/AdminSignup.js';
import Header from './Header.js';
import MapPage from './map.js';
import Boardlist from './CommunityPage/BoardList.js';
import DetailBoard from './CommunityPage/DetailBoard.js';

function App() {
  return (
    <>
    <div className="App">
    <div className="content">
      
    <Header/>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/adminsignup' element={<AdminSignupPage/>}/>
        <Route path='/usersignup' element={<UserSignupPage/>}/>
        <Route path='/location' element={<MapPage/>}/>
        <Route path='/community' element={<Boardlist/>}/>
        <Route path='/community/:postId' element={<DetailBoard/>}/>
      </Routes>
      </div>
      </div>
    <footer className='ft'>
          <p>이용 약관 | 개인정보 처리방침 | 사업자 정보 확인</p>
          <p>오렌지팀 | 금오공과대학교 CE </p>
         <p>&copy; 2024 Orange. All rights reserved.</p>
         <a href="https://github.com/Cafe-Flow">Our Web Site</a>
    </footer>
    </>
  );
}

export default App;




