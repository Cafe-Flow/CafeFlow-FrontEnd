import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./Shop.css";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import SeatView from "../SeatPage/SeatView"; // SeatView import 추가

function Shop() {
  let { idx } = useParams();
  const [cafeData, setCafeData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0); // 리뷰 평점 state
  const [comment, setComment] = useState(""); // 리뷰 내용 state
  const [seats, setSeats] = useState([]); // State to store seat data
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
  const Array = [0, 1, 2, 3, 4];

  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cafe/${idx}`
        );
        setCafeData(response.data);
      } catch (error) {
        console.error("카페 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchCafeData();
  }, [idx]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = `http://localhost:8080/api/cafe/${idx}/review`;
        if (sortBy === "0") {
          url += "?sort-by=created-at";
        } else if (sortBy === "1") {
          url += "?sort-by=highest-rating";
        } else if (sortBy === "2") {
          url += "?sort-by=lowest-rating";
        }
        const response = await axios.get(url);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [idx, sortBy]); // Added sortBy to the dependency array

  useEffect(() => {
    const fetchSeatInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cafe/${idx}/seat`
        );
        if (response.status === 200) {
          setSeats(response.data); // 좌석 데이터 상태 업데이트
        } else {
          console.error("좌석 정보를 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("좌석 정보를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchSeatInfo();
  }, [idx]);

  const handleSubmitReview = async () => {
    try {
      // 리뷰 작성을 위한 데이터 객체 생성
      const reviewData = {
        rating: rating,
        comment: comment
      };
      // 서버에 리뷰 작성 요청
      await axios.post(
        `http://localhost:8080/api/cafe/${idx}/review`,
        reviewData
      );
      // 리뷰 작성 후 서버에서 리뷰 목록을 다시 가져옴
      let url = `http://localhost:8080/api/cafe/${idx}/review`;
      if (sortBy === "0") {
        url += "?sort-by=created-at";
      } else if (sortBy === "1") {
        url += "?sort-by=highest-rating";
      } else if (sortBy === "2") {
        url += "?sort-by=lowest-rating";
      }
      const updatedReviews = await axios.get(url);
      // 가져온 리뷰 목록으로 상태 업데이트
      setReviews(updatedReviews.data);
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
    }
  };

  let cafeName = cafeData ? cafeData.name : "알 수 없음";
  let address = cafeData ? cafeData.address : "알 수 없음";
  let reviewCount = cafeData ? cafeData.reviewCount : 0;
  let reviewsRating = cafeData ? cafeData.reviewsRating : 0;
  let description = cafeData ? cafeData.description : "알 수 없음";

  return (
    <div className="Shop">
      <div className="container">
        <div className="cafe-img">
          <Carousel>
            <Carousel.Item>
              <img src="/img/cafelistimg.jpg" alt="Your Image" />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/img/cafelistimg.jpg" alt="Your Image" />
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/img/cafelistimg.jpg" alt="Your Image" />
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="cafe-container">
          <div className="cafe-content">
            <div className="cafe-name-container">
              <h2>{cafeName}</h2>
              <p>
                ⭐️{reviewsRating} ({reviewCount})
              </p>
            </div>
            <div className="cafe-content2">
              <Card>
                <Card.Img variant="top" src="/img/map_dummy.png" />
                <Card.Body>
                  <Card.Text>{address}</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <br />
            <Card>
              <Card.Body>
                <Card.Text>{description}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="seat-content">
            <SeatView seats={seats} cafeId={idx} />
          </div>
        </div>
        <br />
        {/* SeatView 컴포넌트에 idx 전달 */}
      </div>
      <br />
      <div className="center-div">
        <FloatingLabel controlId="Textarea2" label="Reviews">
          <Form.Control
            as="textarea"
            style={{ height: "100px" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FloatingLabel>
        <div className="star-ratings">
          <div className="star-rating space-x-4 mx-auto">
            {Array.map((value, index) => (
              <React.Fragment key={index}>
                <input
                  type="radio"
                  id={`star-${5 - value}`} // 별점 표시를 수정함
                  name="rating"
                  value={5 - value} // 별점 표시를 수정함
                  checked={rating === 5 - value} // 별점 표시를 수정함
                  onChange={() => setRating(5 - value)} // 별점 표시를 수정함
                />
                <label
                  htmlFor={`star-${5 - value}`} // 별점 표시를 수정함
                  className="star pr-4"
                >
                  ★
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="review-buttons">
          <div className="review-button">
            <Button variant="dark" onClick={handleSubmitReview}>
              리뷰 작성
            </Button>{" "}
          </div>
          <div className="post-sort list-container">
            <p
              className={sortBy === "0" ? "active" : ""}
              onClick={() => setSortBy("0")}
            >
              최신순
            </p>
            <p
              className={sortBy === "1" ? "active" : ""}
              onClick={() => setSortBy("1")}
            >
              평점높은순
            </p>
            <p
              className={sortBy === "2" ? "active" : ""}
              onClick={() => setSortBy("2")}
            >
              평점낮은순
            </p>
          </div>
        </div>
        <br />
        <div className="cafe-reviews">
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <Card id="reviews">
                <Card.Header style={{ textAlign: "start" }}>Unknown</Card.Header>
                <Card.Body style={{ textAlign: "start" }}>{review.comment}</Card.Body>
                <Card.Body style={{ textAlign: "end" }}>
                  {"⭐️".repeat(review.rating)}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <br />
    </div>
  );
}

export default Shop;
