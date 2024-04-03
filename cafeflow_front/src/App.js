import './App.css';
import Header from './Header.js';
import { Routes, Route } from 'react-router-dom'
import MainPage from './MainPage.js';
import LoginPage from './RegisterPage/Login.js';
import UserSignupPage from './RegisterPage/UserSignup.js'
import ShopInfo from './Shopinfo.js';

function App() {
  return (
    <div className="App">
            <Header/>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/adminsignup' element={<div>mypage</div>}/>
        <Route path='/usersignup' element={<UserSignupPage/>}/>
        <Route path='/shop/info' element={<ShopInfo/>}/>
      </Routes>

    <footer className='ft'>
         <p>&copy; 2024 Orange. All rights reserved.</p>
         <a href="https://github.com/Cafe-Flow">Our Web Site</a>
    </footer>
    </div>
  );
}

export default App;




