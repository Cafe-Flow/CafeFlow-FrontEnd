import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./ShopList.css";
import axios from "axios";

function Shoplist() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
  const [isAdmin, setIsAdmin] = useState(false); // State to hold whether user is admin

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:8080/api/cafe";
        if (sortBy === "0") {
          url += "?sort-by=created-at";
        }
        else if (sortBy === "1") { 
          url += "?sort-by=reviews-count";
        }
        else if (sortBy === "2") {
          url += "?sort-by=reviews-rating";
        }
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Check if user is ADMIN
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { userType } = JSON.parse(userInfo);
      if (userType === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }, [sortBy]); // Run effect whenever sortBy changes


  let listLength = data ? parseInt(data.length) : 0;

  const handleRegisterCafe = () => {
    navigate("/shopregister");
  };

  return (
    <div className="Shop">
      <div>
        <h3>카페 목록</h3>
        <div class="buttons-group">
            <div className="post-sort list-container">
            <p
              className={sortBy === "0" ? "active" : ""} 
              onClick={() => setSortBy("0")}>최신순</p>
            <p
              className={sortBy === "1" ? "active" : ""}  
              onClick={() => setSortBy("1")}>리뷰순</p>
            <p
              className={sortBy === "2" ? "active" : ""}  
              onClick={() => setSortBy("2")}>평점순</p>
        </div>
      </div>
      </div>
      <br />
      <Row xs={1} md={3} className="g-4">
        {Array.from({ length: listLength }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="/img/cafelistimg.jpg" />
              <a href={`/shop/${data[idx].id}`}>
                <Card.Body>
                  <Card.Title>{data[idx].name}</Card.Title>
                  <Card.Text>
                    ⭐️{data[idx].reviewsRating} ({data[idx].reviewCount})
                  </Card.Text>
                </Card.Body>
              </a>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      {/* Render the cafe register button only if user is ADMIN */}
      {isAdmin && (
        <div class="cafe-register-button" onClick={handleRegisterCafe}>
          +
        </div>
      )}
    </div>
  );
}

export default Shoplist;
