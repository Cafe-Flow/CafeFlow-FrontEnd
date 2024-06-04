import React from "react";
import "./mainchat.css";

function MainChat() {
  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-messages">
          <div className="message">안녕하세요!</div>
          <div className="message">안녕하세요, 반갑습니다!</div>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="메시지를 입력해주세요..." />
          <button>전송</button>
        </div>
      </div>
    </div>
  );
}

export default MainChat;
