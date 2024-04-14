import React, { useState, useEffect, useRef } from 'react';
import './map.css';
import SearchSection from './MainPage/SearchSection';

function MapInfo() {

  const handleSearch = (searchTerm) => {
    console.log("검색 실행:", searchTerm);
};

  const mapRef = useRef(null);
  const searchLocation = () => {
    const { naver } = window;
    const searchInput = document.getElementById('searchInput').value;
  
    naver.maps.Service.geocode({
      query: searchInput
    }, function (status, response) {
      if (status !== naver.maps.Service.Status.OK || !response.result || response.result.items.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
      }
  
      const item = response.result.items[0];
      const newLocation = new naver.maps.LatLng(item.point.y, item.point.x);
      const map = new naver.maps.Map(mapRef.current, {
        center: newLocation,
        zoom: 15,
      });
  
      new naver.maps.Marker({
        position: newLocation,
        map,
      });
    });
  };

  useEffect(() => {
    const { naver } = window;

    const getCurrentLocation = (options = {}) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const initMap = async () => {
      if (mapRef.current && naver) {
        try {
          const position = await getCurrentLocation();
          const { latitude, longitude } = position.coords;
          
          const location = new naver.maps.LatLng(latitude, longitude);
          const map = new naver.maps.Map(mapRef.current, {
            center: location, 
            zoom: 15, 
          });
          
          // 사용자의 현재 위치에 마커를 추가합니다.
          new naver.maps.Marker({
            position: location,
            map,
          });
        } catch (error) {
          const lat = 37.3595704;
          const lng = 127.105399;
          const location = new naver.maps.LatLng(lat, lng);
          const map = new naver.maps.Map(mapRef.current, {
            center: location,
            zoom: 15,
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
    <>
    <SearchSection 
    placeholder="지역을 검색하여 카페를 찾으세요 예시.(경북 구미시)"
    onSearch={handleSearch}
    />
    <div className="map-container">
      <div className="map-content">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
    </>
  );
}

export default MapInfo;
