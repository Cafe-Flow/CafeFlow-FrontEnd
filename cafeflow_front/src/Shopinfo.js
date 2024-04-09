import React, { useEffect, useRef } from 'react';
import './Shopinfo.css';

function ShopInfo() {
  const mapRef = useRef(null);

  useEffect(() => {
    const { naver } = window;
    
    // 사용자의 현재 위치를 가져오는 함수
    const getCurrentLocation = (options = {}) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const initMap = async () => {
      if (mapRef.current && naver) {
        try {
          // 사용자의 현재 위치를 가져옵니다.
          const position = await getCurrentLocation();
          const { latitude, longitude } = position.coords;
          
          const location = new naver.maps.LatLng(latitude, longitude);
          const map = new naver.maps.Map(mapRef.current, {
            center: location, // 지도의 중심을 사용자의 현재 위치로 설정
            zoom: 17, // 지도 확대 정도
          });
          
          // 사용자의 현재 위치에 마커를 추가합니다.
          new naver.maps.Marker({
            position: location,
            map,
          });
        } catch (error) {
          console.error("Geolocation is not supported by this browser.", error);
          // Geolocation API 사용이 불가능할 경우, 기본 위치를 설정할 수 있습니다.
          // 여기서는 lat, lng 변수를 사용하여 기본 위치를 지정합니다.
          const lat = 37.3595704;
          const lng = 127.105399;
          const location = new naver.maps.LatLng(lat, lng);
          const map = new naver.maps.Map(mapRef.current, {
            center: location,
            zoom: 17,
          });
          new naver.maps.Marker({
            position: location,
            map,
          });
        }
      }
    };

    initMap();
  }, []); // 의존성 배열을 비워서 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.

  return (
    <div className="map-container">
      <div className="map-content">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
}

export default ShopInfo;
