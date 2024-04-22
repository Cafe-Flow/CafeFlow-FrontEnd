import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './mypage.css';

function Sidebar() {
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path;
    }

    return (
        <div className='mypage-sidebar'>
            <ul>
            <p className='h6-font'>마이 페이지</p>
                <li><Link to="/mypage/modify" className={isActive("/mypage/modify") ? 'active' : ''}>회원정보 수정</Link></li>
                <li><Link to="/mypage/password" className={isActive("/mypage/password") ? 'active' : ''}>비밀번호 변경</Link></li>
                <li><Link to="/mypage/query" className={isActive("/mypage/query") ? 'active' : ''}>회원 조회</Link></li>
                <li><Link to="/mypage/delete" className={isActive("/mypage/delete") ? 'active' : ''}>회원 탈퇴</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
