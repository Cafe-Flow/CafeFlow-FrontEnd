import React from "react";
import Sidebar from "./Sidebar";

function Query() {
  return (
    <div className="mypage">
      <Sidebar />
      <div className="mypage-card">
        <div className="mypage-header">
          <p className="header-font">채팅 목록</p>
          <p className="h6-font">진행 중인 채팅을 확인 해보세요</p>
        </div>
      </div>
    </div>
  );
}

export default Query;
