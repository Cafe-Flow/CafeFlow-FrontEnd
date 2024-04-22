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
  
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const map = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(lat, lng),
            zoom: 15
          });
  
          const latlng = new naver.maps.LatLng(lat, lng);
          const contentString = [
          '<div class="custom-window">',
          '<p class="window-head">혼잡도</p>',
          '<p class="window-cafe">카페명</p>',
          '<p class="window-review">별점</p>',
          '</div>',
          ].join('');
        
          const infoWindow = new naver.maps.InfoWindow({
            content: contentString,

            maxWidth: 500,
            backgroundColor: "#D5C4A1",
            borderColor: "#D5C4A1",
            borderWidth: 1,
            anchorSize: new naver.maps.Size(10, 10),
            anchorColor: "#D5C4A1",
            pixelOffset: new naver.maps.Point(19, -20)

        });
  
          infoWindow.open(map, latlng);
        });
      }
    };
  
    getCurrentLocation();
  }, []);

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
