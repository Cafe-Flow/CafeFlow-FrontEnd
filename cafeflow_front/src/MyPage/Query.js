import React from 'react';
import Sidebar from './Sidebar';

function Query() {
    return (
        <div className='mypage'>
            <Sidebar />
            <div className="mypage-card">
                <div className='mypage-header'>                
                    <p className='header-font'>회원 조회</p>
                    <p className='h6-font'>닉네임을 통해 유저를 검색 해요</p>
                </div>
            </div>
        </div>
    );
}

export default Query;
