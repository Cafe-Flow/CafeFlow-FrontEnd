import React, { useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

function getCongestionLevel(congestion) {
  return congestion > 80 ? "혼잡" : congestion > 50 ? "적정" : "원활";
}

function getCongestionColor(congestion) {
  return congestion > 80 ? "red" : congestion > 50 ? "blue" : "green";
}

function ResultList({ markersData, onMarkerClick }) {
  const allResults = markersData;
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <ul className="search-results">
      {allResults.length === 0 ? (
        <li>
          <h5>결과가 없습니다.</h5>
        </li>
      ) : (
        allResults.map((item, index) => (
          <li key={index} onClick={() => onMarkerClick(item)}>
            <span className="si-goo">{item.address}</span>
            <span className="maejang-name">
              {item.name} - {getCongestionLevel(item.congestion)}{" "}
              <span
                className="congestion-indicator"
                style={{
                  backgroundColor: getCongestionColor(item.congestion),
                  marginLeft: "10px",
                }}
              ></span>
              <div
                className={`description-box ${
                  hoveredItem === index ? "visible" : ""
                }`}
              >
                {item.description}
              </div>
            </span>
            <button className="chat-icon">
              조회
              <div className="chat-tooltip">매장 조회</div>
            </button>
            <button className="chat-icon">
              <IoChatboxEllipsesOutline />
              <div className="chat-tooltip">채팅 문의</div>
            </button>
          </li>
        ))
      )}
    </ul>
  );
}
export default ResultList;
