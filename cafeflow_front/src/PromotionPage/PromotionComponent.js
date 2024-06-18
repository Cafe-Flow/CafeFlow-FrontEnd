import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "./promotion.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PromotionComponent({cafeid}) {
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPromotions = async () => {
      const userToken = localStorage.getItem("userToken"); 

      try {
        const response = await axios.get(
          `/api/cafe/${cafeid}/promotion?sort-by=proceeding`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };


  return (
    <>
      <div className="promotion-box">
        <div className="inner_place">
          <div className="promotion-box-top">
            <p>❗진행 중인 특별 이벤트❗</p>
            <button
              onClick={() => {
                navigate("/promotion");
              }}
            >
              더 보러가기
            </button>
          </div>
          {promotions.length > 0 ? (
            <Slider {...settings}>
              {promotions.map((promotion) => (
                <div key={promotion.id}>
                  <img
                    src={`data:image/jpeg;base64,${promotion.image}`}
                    alt={promotion.description}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p>현재 진행중인 이벤트가 없습니다</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PromotionComponent;
