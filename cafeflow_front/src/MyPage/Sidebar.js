import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./mypage.css";
import { MdAccountCircle, MdVpnKey, MdDelete } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="mypage-sidebar">
      <ul>
        <p className="h6-font" style={{ fontSize: "20px" }}>
          마이 페이지
        </p>
        <li>
          <Link
            to="/mypage/modify"
            className={isActive("/mypage/modify") ? "active" : ""}
          >
            <MdAccountCircle /> 회원정보 수정
          </Link>
        </li>
        <li>
          <Link
            to="/mypage/password"
            className={isActive("/mypage/password") ? "active" : ""}
          >
            <MdVpnKey /> 비밀번호 변경
          </Link>
        </li>
        <li>
          <Link
            to="/mypage/query"
            className={isActive("/mypage/query") ? "active" : ""}
          >
            <IoChatboxEllipsesOutline /> 채팅 목록
          </Link>
        </li>
        <li>
          <Link
            to="/mypage/delete"
            className={isActive("/mypage/delete") ? "active" : ""}
          >
            <MdDelete /> 회원 탈퇴
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
