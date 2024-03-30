import './App.css';
import Header from './Header.js';
import { Routes, Route } from 'react-router-dom'
import MainPage from './MainPage.js';
function App() {
  return (
    <div className="App">
            <Header/>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/detail' element={<div>detail</div>}/>
        <Route path='/mypage' element={<div>mypage</div>}/>
      </Routes>

    </div>
  );
}

export default App;




