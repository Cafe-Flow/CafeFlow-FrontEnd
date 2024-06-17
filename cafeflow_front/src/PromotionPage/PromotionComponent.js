import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./promotion.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PromotionComponent() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="promotion-box">
        <div className="inner_place">
          <div className="promotion-box-top">
            <p>❗진행 중인 특별 이벤트❗</p>
            <button>더 보러가기</button>
          </div>
          <Slider {...settings}>
            <div>
              <img src="/img/Promotion1.png" alt="이벤트1" />
            </div>
            <div>
              <img src="/img/Promotion2.png" alt="이벤트2" />
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}

export default PromotionComponent;
