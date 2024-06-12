import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import "./mypage.css";

function CafeList() {
  const [cafes, setCafes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await axios.get("/api/cafe/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setCafes(response.data);
      } catch (error) {
        console.error("Error fetching cafe data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  const handleCafeClick = (cafeId) => {
    navigate(`/shop/${cafeId}`);
  };

  return (
    <div className="mypage">
      <Sidebar />
      <div className="mypage-card">
        <div className="mypage-header">
          <p className="header-font">내 매장</p>
          <p className="h6-font">현재 관리중인 매장들을 조회 해보세요</p>
        </div>
        {loading ? (
          <p>매장 목록을 불러 오는중...</p>
        ) : (
          <div className="cafe-list">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                className="cafe-item"
                onClick={() => handleCafeClick(cafe.id)}
                style={{ cursor: "pointer" }}
              >
                <p className="cafe-name">{cafe.name}</p>
                <p className="cafe-address">{cafe.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CafeList;
