import React from "react";
import Draggable from "react-draggable";
import "./mainchat.css";

function ChatPopup({ children, className }) {
  return (
    <Draggable>
      <div className={`${className}`}>{children}</div>
    </Draggable>
  );
}

export default ChatPopup;
