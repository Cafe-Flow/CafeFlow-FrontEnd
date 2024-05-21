import React from "react";
import "./map.css";

function CustomButton({ onClick }) {
  return (
    <div className="custom-control-button" onClick={onClick}>
      내 위치로 이동
    </div>
  );
}

export default CustomButton;
