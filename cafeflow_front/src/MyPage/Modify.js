import Sidebar from './Sidebar';
import React, { useState, useEffect } from 'react';

function Modify() {

const [userInfo, setUserInfo] = useState({
    id: '',
    username: '',
    nickname: '',
    email: '',
    gender: '',
    age: '',
    cityId: '',
    stateId: '',
    image: null
});

useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      console.log(localStorage.getItem('userToken'));
    }
  }, []);

return (
        <div className='mypage'>
            <Sidebar />
            <div className="mypage-card">
                <div className='mypage-header'>                
                    <p className='header-font'>회원정보 수정</p>
                    <p className='h6-font'>회원님의 소중한 개인정보를 위해 회원 정보를 주기적으로 수정해주세요</p>
                </div>
        <div className='userinfo-display'>
          <p>닉네임: {userInfo.nickname}</p>
          <p>이메일: {userInfo.email}</p>
          <p>성별: {userInfo.gender}</p>
          <p>나이: {userInfo.age}</p>
          {userInfo.image && <img src={userInfo.image} alt="Profile" />}
        </div>
            </div>
        </div>
    );
}

export default Modify;
