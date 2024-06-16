import { LiaMapMarkerSolid } from "react-icons/lia";
import { FiPhone } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";
import { IoIosCafe } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./Shop.css"
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import SeatView from "../SeatPage/SeatView"; // SeatView import 추가
import './styles.css';

function PlaceInfo() {
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
              `http://cafeflow.store:8080/api/cafe/${idx}`
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
            let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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
              `http://cafeflow.store:8080/api/cafe/${idx}/seat`
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
            `http://cafeflow.store:8080/api/cafe/${idx}/review`,
            reviewData
          );
          // 리뷰 작성 후 서버에서 리뷰 목록을 다시 가져옴
          let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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
    let updatedAt = cafeData ? cafeData.updated_at : "알 수 없음";
    let description = cafeData ? cafeData.description : "알 수 없음";

    return (
        <div data-viewid="basicInfoTop" data-root="">
            <div className="details_present" style={{ background: "none" }}>
                <a href="#none" className="link_present" data-logtarget="" data-logevent="info_pannel,main_pic">
                    <span className="bg_present" style={{ backgroundImage: "url(/img/cafelistimg.jpg)" }}></span>
                    <span className="frame_g"></span>
                </a>
            </div>
            <div className="place_details">
                <div className="inner_place">
                    <div className="info">
                        <h2 className="tit_location">{cafeName}</h2>
                        <div className="location_evaluation">
                            <span className="txt_location">
                                리뷰
                                <a href="#none" className="link_evaluation" data-cnt="9" data-target="comment" data-logtarget="" data-logevent="info_pannel,point">
                                    <span className="color_b">{reviewsRating}</span>
                                    ({reviewCount})
                                </a>
                            </span>
                        </div>
                    </div>
                    <div className="info_list">
                        <div className="detail_placeinfo">
                            <h3 class="tit_subject">상세정보</h3>
                            <span class="info_revise">
                                업데이트
                                <span> | </span>
                                <span class="date_revise">
                                    {updatedAt}
                                </span>
                            </span>
                        </div>
                        <div className="list_place">
                            <div class="location_detail">
                                <h4 class="tit_detail"><LiaMapMarkerSolid/></h4>
                                <span class="txt_address">
                                    {address}
                                </span>
                            </div>
                            <div class="location_detail">
                                <h4 class="tit_detail"><FiPhone /> </h4>
                                <div class="phone-number">010-1234-5678</div>
                            </div>
                            <div class="location_detail">
                                <h4 class="tit_detail"><MdOutlineDescription/></h4>
                                <div class="phone-number">{description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OwnerCertification() {
  let { idx } = useParams();
  return (
    <div className="place_details">
      <div className="inner_place">
        <IoIosCafe/> 
        <a href={`/modify/${idx}`}>관리자라면 가게를 관리하고 수정해보세요!</a>
      </div>
    </div>
  );
}
const MenuInfo = () => (
    <div className="place_details">
      <div className="inner_place">
        <div className="tit_subject">
          메뉴
        </div>
      </div>
    </div>
);

const PhotoSection = () => (
  <div className="place_details">
    <div className="inner_place">
      <div className="tit_subject">
        리뷰 사진
      </div>
    </div>
  </div>
);

function CommentRate() {
  let { idx } = useParams();
    const [cafeData, setCafeData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0); // 리뷰 평점 state
    const [comment, setComment] = useState(""); // 리뷰 내용 state
    const [reviewImg, setReviewImg] = useState(null);
    const [seats, setSeats] = useState([]); // State to store seat data
    const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
    const Array = [0, 1, 2, 3, 4];
  
    useEffect(() => {
      const fetchCafeData = async () => {
        try {
          const response = await axios.get(
            `http://cafeflow.store:8080/api/cafe/${idx}`
          );
          setCafeData(response.data);
        } catch (error) {
          console.error("카페 데이터를 불러오는 중 오류 발생:", error);
        }
      };
  
      fetchCafeData();
    }, [idx]);
  
    useEffect(() => {
      const fetchSeatInfo = async () => {
        try {
          const response = await axios.get(
            `http://cafeflow.store:8080/api/cafe/${idx}/seat`
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
          `http://cafeflow.store:8080/api/cafe/${idx}/review`,
          reviewData
        );
        // 리뷰 작성 후 서버에서 리뷰 목록을 다시 가져옴
        let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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
    <div className="place_details">
      <div className="inner_place">
        <div className="tit_subject">
          리뷰를 작성해보세요!
        </div>
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
                  ♬
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <br/>
        <FloatingLabel controlId="Textarea2" label="Reviews">
          <Form.Control
            as="textarea"
            style={{ height: "100px" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FloatingLabel>
        <div className="review-buttons">
          <div className="review-button">
            <Button variant="dark" onClick={handleSubmitReview}>
              리뷰 작성
            </Button>{" "}
          </div>
          <input
            type="file"
            onChange={(e) => setReviewImg(e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
}

function Comment() {
  let { idx } = useParams();
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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

  return (
    <div className="place_details">
      <div className="inner_place">
        <div className="tit_subject">
          리뷰 목록
        </div>
        <br/>
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
          <div className="cafe-reviews">
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <Card id="reviews">
                <Card.Header style={{ textAlign: "start" }}>{reviews.name}</Card.Header>
                <Card.Body style={{ textAlign: "start" }}>{review.comment}</Card.Body>
                <Card.Body style={{ textAlign: "end" }}>
                  {"⭐️".repeat(review.rating)}
                </Card.Body>
                <Card.Img variant="top" src={reviews ? `data:image/png;base64,${reviews.image}` : ""} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FindWay = () => (
  <div className="place_details">
    <div className="inner_place">
      <div className="tit_subject">
        찾아오시는 길
      </div>
    </div>
  </div>
);

function Example() {
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
            `http://cafeflow.store:8080/api/cafe/${idx}`
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
          let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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
            `http://cafeflow.store:8080/api/cafe/${idx}/seat`
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
          `http://cafeflow.store:8080/api/cafe/${idx}/review`,
          reviewData
        );
        // 리뷰 작성 후 서버에서 리뷰 목록을 다시 가져옴
        let url = `http://cafeflow.store:8080/api/cafe/${idx}/review`;
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

    const Token = "Admin";    
    return (
        <div className="container">
            <PlaceInfo />
            {Token === "Admin" && <OwnerCertification/>}
            <MenuInfo/>
            <div className="place_details">
              <div className="inner_place">
                <div className="tit_subject">
                  좌석 현황
                </div>
                <div className="seat_place">
                  <SeatView seats={seats} cafeId={idx}/>
                </div>
              </div>
            </div>
            <PhotoSection/>
            <CommentRate/>
            <Comment/>
            <FindWay/>
        </div>
    );
}

export default Example;
