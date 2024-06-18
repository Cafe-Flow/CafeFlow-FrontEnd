import { LiaMapMarkerSolid } from "react-icons/lia";
import { MdOutlineDescription } from "react-icons/md";
import { IoIosCafe } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./Shop.css"
import Button from "react-bootstrap/Button";
import SeatView from "../SeatPage/SeatView"; // SeatView import 추가
import Modal from 'react-modal';
import './styles.css';
import Dropzone from './dropzone';
import PromotionComponent from "../PromotionPage/PromotionComponent";
import { PiCoffeeFill, PiCoffeeBold, PiCoffeeBeanFill } from "react-icons/pi";

// Modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',  // 원하는 너비를 설정합니다.
    height: '80vh', // 원하는 높이를 설정합니다.
    overflow: 'auto' // 내용이 길어질 경우 스크롤이 가능하도록 합니다.
  },
};

Modal.setAppElement('#root'); // Adjust this according to your app structure


function PlaceInfo({cafeData}) {
    let { idx } = useParams();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0); // 리뷰 평점 state
    const [comment, setComment] = useState(""); // 리뷰 내용 state
    const [seats, setSeats] = useState([]); // State to store seat data
    const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
    const Array = [0, 1, 2, 3, 4];

      useEffect(() => {
        const fetchReviews = async () => {
          try {
            let url = `/api/cafe/${idx}/review`;
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
              `/api/cafe/${idx}/seat`
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

    let cafeName = cafeData ? cafeData.name : "알 수 없음";
    let address = cafeData ? cafeData.address : "알 수 없음";
    let reviewCount = cafeData ? cafeData.reviewCount : 0;
    let reviewsRating = cafeData ? cafeData.reviewsRating : 0;
    let updatedAt = cafeData ? cafeData.updatedAt : "알 수 없음";
    let description = cafeData ? cafeData.description : "알 수 없음";
    let cafeImage = cafeData ? `data:image/png;base64,${cafeData.image}` : "";

    return (
        <div data-viewid="basicInfoTop" data-root="">
            <div className="details_present" style={{ background: "none" }}>
                <a href="#none" className="link_present" data-logtarget="" data-logevent="info_pannel,main_pic">
                    <span className="bg_present" style={{ backgroundImage: "url(/img/cafelistimg.jpg)" }}></span>
                    <span className="bg_present" style={{ backgroundImage: `url(${cafeImage})` }}></span>
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
                                  {updatedAt.split('T')[0]}
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
        <a className="admin_modify" href={`/modify/${idx}`}>관리자라면 가게를 관리하고 수정해보세요!</a>
      </div>
    </div>
  );
}

const MenuInfo = ({ isAdmin }) => {
  const navigate = useNavigate();
  let { idx } = useParams();
  const handleOrderClick = () => {
    navigate(`/shop/${idx}/orderlist`);
  };

  const handleAddOrderClick = () => {
    navigate(`/shop/${idx}/addmenu`);
  };

  return (
    <div className="place_details" style={{ textAlign: "center" }}>
      <div className="inner_place">
        <div
          className="tit_subject"
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={handleOrderClick}
        >
          비대면으로 메뉴 주문
        </div>
        <br />
        {isAdmin === "ADMIN" ? (
          <span className="menuInfo-addmenu" onClick={handleAddOrderClick}>
            카페 메뉴 추가하기
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

function Comment() {
  let { idx } = useParams();
  const [rating, setRating] = useState(0); // 리뷰 평점 state
  const [comment, setComment] = useState(""); // 리뷰 내용 state
  const [reviewImg, setReviewImg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
  const [imageFile, setImageFile] = useState(null);
  const [hoverRating, setHoverRating] = useState(null); // 추가된 hoverRating state
  const arraylist = [0, 1, 2, 3, 4];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = `/api/cafe/${idx}/review`;
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
  
  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("userToken");
  
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);
      
      if (imageFile) {
        formData.append('image', imageFile); // Append the first file from files array
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };
  
      const response = await axios.post(`/api/cafe/${idx}/review`, formData, { headers });
      let url = `/api/cafe/${idx}/review`;
      if (sortBy === "0") {
        url += "?sort-by=created-at";
      } else if (sortBy === "1") {
        url += "?sort-by=highest-rating";
      } else if (sortBy === "2") {
        url += "?sort-by=lowest-rating";
      }
      const updatedReviews = await axios.get(url);
  
      console.log("Review submitted:", response.data);
  
      setReviews(updatedReviews.data);
  
      // 리뷰 작성 후 input 상태 초기화
      setRating(0);
      setComment("");
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageDrop = (file) => {
    setImageFile(file);
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setHoverRating(null); // 클릭 시 hoverRating을 null로 초기화
  };

  return (
    <>
    <div className="place_details">
    <div className="inner_place">
      <div className="tit_subject">
        리뷰 사진
      </div>
      <br/>
      <div>
      <div className="image_container">
        {reviews.slice(0, 6).map((review, index) => (
          <div key={index} className="review_images">
            <img src={`data:image/jpeg;base64,${review.image}`} alt={`Review ${index}`} />
          </div>
        ))}
        {reviews.length > 6 && (
          <div className="view_more" onClick={openModal}>
            View More
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="All Images"
      >
        <h2 className="tit_subject">리뷰 사진</h2>
        <br/>
        <div className="modal_image_container">
          {reviews.map((review, index) => (
            <div key={index} className="modal_review_images">
              <img src={`data:image/jpeg;base64,${review.image}`} alt={`Review ${index}`} />
            </div>
          ))}
        </div>
        <br/>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>  
    </div>
  </div>
    <div className="place_details">
      <div className="inner_place">
        <div className="review_with_rate">
        <div className="tit_subject">
          리뷰를 작성해보세요!
        </div>
        <div className="star-ratings">
          <div className="star-rating space-x-4 mx-auto">
            {arraylist.map((value, index) => (
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
                  onMouseEnter={() => setHoverRating(5 - value)}
                  onMouseLeave={() => setHoverRating(null)}
                >
                <PiCoffeeFill color={hoverRating >= 5 - value ? '#6f4e37' : rating >= 5 - value ? '#6f4e37' : 'gray'} />
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        </div>
        <br/>
        <FloatingLabel controlId="Textarea2">
          <Form.Control
            as="textarea"
            style={{ height: "100px" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FloatingLabel>
        <div className="review-buttons">
          <Dropzone onDrop={handleImageDrop} />
          <div className="review-button">
            <Button variant="dark" onClick={handleSubmitReview}>
              리뷰 작성
            </Button>
          </div>
        </div>
      </div>
    </div>
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
  {sortBy !== "0" ? (
    // Display reviews in normal order
    reviews.map((review, index) => (
      <div key={index} >
      <Card id="reviews">
        <Card.Header className="name_with_rate" style={{ textAlign: "start" }}>
        <div>{review.nickname}</div>
        <div>
          {Array(review.rating).fill(<PiCoffeeFill color='#6f4e37' />)}
        </div>
        </Card.Header>
        <div className="review">
        <img className="review_img" src={`data:image/jpeg;base64,${review.image}`} />
        <div className="review_txt" style={{ textAlign: "start" }}>{review.comment}</div>
        </div>
      </Card>
      <br/>
      </div>
    ))
    ) : (
    // Display reviews in reverse order
    reviews.slice().reverse().map((review, index) => (
      <div key={index} >
        <Card id="reviews">
          <Card.Header className="name_with_rate" style={{ textAlign: "start" }}>
            <div>{review.nickname}</div>
            <div>{Array(review.rating).fill(<PiCoffeeFill color='#6f4e37' />)}</div>
          </Card.Header>
          <div className="review">
            <img className="review_img" src={`data:image/jpeg;base64,${review.image}`} />
            <div className="review_txt" style={{ textAlign: "start" }}>{review.comment}</div>
          </div>
        </Card>
        <br/>
      </div>
    ))
  )}
</div>

      </div>
    </div>
    </>
  );
}

const FindWay = () => (
  <div className="place_details">
    <div className="inner_place">
      <div className="tit_subject">
        찾아오시는 길
      </div>
      <br/>
    </div>
  </div>
);

function Shop() {
  let { idx } = useParams();
  const [userInfo, setUserInfo] = useState(null); // 유저 정보를 저장할 상태 추가
  const [reviews, setReviews] = useState([]);
  const [cafeData, setCafeData] = useState(null);
  const [seats, setSeats] = useState([]); // State to store seat data
  const [sortBy, setSortBy] = useState("0"); // Default sort option is "0"
  const [isAdmin, setIsAdmin] = useState("USER"); // State to hold whether user is admin
  const Array = [0, 1, 2, 3, 4];
  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        const response = await axios.get(
          `/api/cafe/${idx}`
        );
        console.log("cafeData", response.data);
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
        let url = `/api/cafe/${idx}/review`;
        if (sortBy === "0") {
          url += "?sort-by=created-at";
        } else if (sortBy === "1") {
          url += "?sort-by=highest-rating";
        } else if (sortBy === "2") {
          url += "?sort-by=lowest-rating";
        }
        console.log("URL:", url);
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
          `/api/cafe/${idx}/seat`
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
  
  return (
    <div className="container">
        <>
          <PlaceInfo cafeData={cafeData}/>
          {isAdmin === "ADMIN" && <OwnerCertification/>}
          <FindWay/>
          <PromotionComponent cafeid={idx}/>
          <MenuInfo isAdmin={isAdmin}/>
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
          <Comment/>
        </>
    </div>
  );    
}

export default Shop;