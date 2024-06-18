import React from "react";
import { useNavigate } from "react-router-dom";
import "./promotionlist.css";


const DetailPromotion = ({ isOpen, onClose, promotion }) => {
    const navigate = useNavigate();
  if (!isOpen) return null;

  const handleShopClick = () => {
    navigate(`/shop/${promotion.cafeId}`);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      console.log("클릭");
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleOverlayClick}>
      <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box">
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <h2 onClick={handleShopClick} style={{ cursor: "pointer" }}>
            {promotion.cafeName}
          </h2>
          <img
            src={`data:image/jpeg;base64,${promotion.image}`}
            alt={promotion.title}
          />
          <p>{promotion.description}</p>
          <strong>
            {promotion.startDate.split("T")[0]} ~{" "}
            {promotion.endDate.split("T")[0]}
          </strong>
          <p>❗진행 기간❗</p>
          <button className="shop-button" onClick={handleShopClick}>
            매장 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPromotion;
