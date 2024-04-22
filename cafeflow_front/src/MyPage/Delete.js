import React, { useState, useEffect }from 'react';
import Sidebar from './Sidebar';
import './mypage.css'
import { useNavigate } from 'react-router-dom';

function Delete() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
      const userId = JSON.parse(localStorage.getItem('userInfo')).id; // 사용자 ID 추출
      try {
        const response = await fetch(`http://localhost:8080/api/auth/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // 토큰을 헤더에 포함
          },
        });
  
        if (response.ok) {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('userToken');
          setIsLoggedIn(false); 
          navigate('/');
          console.log("success");
        } else {
          throw new Error('회원 탈퇴에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원 탈퇴 처리 중 에러 발생:', error);
      }
    };

    return (
        <div className='mypage'>
            <Sidebar />
            <div className="mypage-card">
                <div className='mypage-header'>                
                    <p className='header-font'>회원 탈퇴</p>
                    <p className='h6-font'>회원님의 안전한 탈퇴를 도와 드릴게요</p>
                </div>
                <div onClick={handleDelete} className='custom-delete-button' >회원 탈퇴</div>
            </div>
        </div>
    );
}

export default Delete;
