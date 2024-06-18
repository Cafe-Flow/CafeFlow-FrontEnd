import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainChat from "../Chat/MainChat";
import ChatPopup from "../Chat/ChatPopUp";

function ResultList({ markersData, onMarkerClick, isListVisible }) {
  const [sortedResults, setSortedResults] = useState(markersData);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [currentSort, setCurrentSort] = useState("");
  const navigate = useNavigate();

  const handleChatClick = (receiverId, itemId, name) => {
    setSelectedReceiverId(receiverId);
    setSelectedItemId(itemId);
    setSelectedName(name);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedReceiverId(null);
    setSelectedItemId(null);
    setSelectedName(null);
  };

  useEffect(() => {
    setSortedResults(markersData);
  }, [markersData]);

  
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setSenderId(storedUserInfo.id);
    }
  }, []);

    useEffect(() => {
      if (!isListVisible) {
        setCurrentSort("");
      }
    }, [isListVisible]);

  const sortByRating = () => {
    const sorted = [...sortedResults].sort(
      (a, b) => b.reviewsRating - a.reviewsRating
    );
    setSortedResults(sorted);
    setCurrentSort("별점순");
  };

  const sortByReviewCount = () => {
    const sorted = [...sortedResults].sort(
      (a, b) => b.reviewCount - a.reviewCount
    );
    setSortedResults(sorted);
    setCurrentSort("리뷰순");
  };

  return (
    <div>
      <h5>↻ 검색 결과</h5>
      <div className="result-results-sort">
        <button
          onClick={sortByRating}
          className={currentSort === "별점순" ? "active" : ""}
        >
          별점순
        </button>
        <button
          onClick={sortByReviewCount}
          className={currentSort === "리뷰순" ? "active" : ""}
        >
          리뷰순
        </button>
      </div>
      <ul className="result-results">
        {sortedResults.length === 0 ? (
          <li>
            <h5>결과가 없습니다.</h5>
          </li>
        ) : (
          sortedResults.map((item) => (
            <li key={item.id} onClick={() => onMarkerClick(item)}>
              <div className="result-results-left">
                <span className="result-results-name">
                  {item.name}
                  <span
                    className="congestion-indicator"
                    style={{
                      backgroundColor: item.traffic === "YELLOW" ? "BLUE" : item.traffic,
                      marginLeft: "10px",
                    }}
                ></span>
                  <div
                    className={`description-box ${
                      hoveredItem === item.id ? "visible" : ""
                    }`}
                  >
                    {item.detailAddress}
                  </div>
                </span>
                {item.traffic === "RED" && (
                  <span className="result-results-watingTime">
                    예상 대기 시간 {item.watingTime}분
                  </span>
                )}
                <span className="result-results-review">
                  {item.reviewsRating === 0 ? (
                    <span>현재 리뷰 없음</span>
                  ) : (
                    <span>
                      ⭐️ {item.reviewsRating} ({item.reviewCount})
                    </span>
                  )}
                </span>
                <span className="result-results-address">{item.address}</span>
                <span className="result-results-description">
                  {item.description}
                </span>
                <button
                  className="chat-icon"
                  onClick={() => {
                    navigate(`/shop/${item.id}`);
                  }}
                >
                  조회
                  <div className="chat-tooltip">매장 조회</div>
                </button>
                <button
                  className="chat-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChatClick(item.memberId, item.id, item.name);
                  }}
                >
                  채팅
                  <div className="chat-tooltip">1대1 문의</div>
                </button>
                {isChatOpen &&
                  selectedReceiverId === item.memberId &&
                  selectedItemId === item.id && (
                    <ChatPopup className="chat-popup">
                      <MainChat
                        userId={senderId}
                        cafeOwnerId={selectedReceiverId}
                        name={selectedName}
                        isUser={true}
                        onClose={handleCloseChat}
                      />
                    </ChatPopup>
                  )}
              </div>
              <div className="result-results-right">
                <img
                  src={
                    item.image
                      ? `data:image/jpeg;base64,${item.image}`
                      : "/img/unnamed.jpg"
                  }
                  className="카페 사진"
                  alt="Profile"
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
export default ResultList;
