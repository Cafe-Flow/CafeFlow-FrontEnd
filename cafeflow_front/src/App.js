import './App.css';
import Header from './Header.js';
import { Routes, Route } from 'react-router-dom'
import MainPage from './MainPage.js';
import LoginPage from './RegisterPage/Login.js';

function App() {
  return (
    <div className="App">
            <Header/>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/adminsignup' element={<div>mypage</div>}/>
        <Route path='/usersignup' element={<div>mypage</div>}/>
      </Routes>

    </div>
  );
}

export default App;




