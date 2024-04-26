/* global naver */

import React, { useState, useEffect, useRef } from 'react';
import './map.css';
import SearchSection from './MainPage/SearchSection';

function MapInfo() {

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const searchLocation = (searchInput) => {
      naver.maps.Service.geocode({
        query: searchInput
      }, function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          console.error('API 요청에 실패했습니다.', response);
          alert('API 요청 중 문제가 발생했습니다.');
          return;
        }
        
        if (response.v2.addresses.length === 0) {
          console.log('검색 결과가 없습니다.', response);
          alert('검색 결과가 없습니다.');
          return;
        }
        
        const item = response.v2.addresses[0];
        console.log('검색 결과:', response.v2.addresses);
        const newLocation = new naver.maps.LatLng(item.y, item.x);
        setSearchResults(response.v2.addresses);
        setCurrentPage(1); 

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(newLocation);

          if (markerRef.current) {
            markerRef.current.setPosition(newLocation);
          } else {
            markerRef.current = new naver.maps.Marker({
              position: newLocation,
              map: mapInstanceRef.current,
            });
          }
        }

      });
  };

  
  useEffect(() => {
    const { naver } = window;

    // 지도 인스턴스 생성
    if (mapRef.current && !mapInstanceRef.current) {
      const initialMap = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 13
      });
      mapInstanceRef.current = initialMap;
    }

    // 사용자 정의 컨트롤 추가
    const locationBtnHtml = '<button class="custom-location-btn" onClick={searchNearby}>현 위치 검색</button>';
    const customControl = new naver.maps.CustomControl(locationBtnHtml, {
      position: naver.maps.Position.TOP_RIGHT
    });

    customControl.setMap(mapInstanceRef.current);
    naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const currentLocation = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
          mapInstanceRef.current.setCenter(currentLocation);
        }, (error) => {
          console.error("Geolocation error: ", error);
        });
      }
    });

    // 현 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (mapInstanceRef.current) {
          const currentLocation = new naver.maps.LatLng(lat, lng);
          mapInstanceRef.current.setCenter(currentLocation);
        }
      }, (error) => {
        console.error("Geolocation error: ", error);
      });
    }
  }, []);


  const handleSelect = (item) => {
    const newLocation = new naver.maps.LatLng(item.y, item.x);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newLocation);
      if (markerRef.current) {
        markerRef.current.setPosition(newLocation);
      } else {
        markerRef.current = new naver.maps.Marker({
          position: newLocation,
          map: mapInstanceRef.current,
        });
      }
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

function SearchResultList({ results, onSelect }) {
  if (!results.length) {
    return <div>검색 결과가 없습니다</div>;
  }

  return (
    <ul className="search-results">
      {results.map((result, index) => (
        <li key={index} onClick={() => onSelect(result)}>
          {result.roadAddress} - {result.jibunAddress}
        </li>
      ))}
    </ul>
  );
}

const searchNearby = () => {
  if (mapInstanceRef.current) {
    const center = mapInstanceRef.current.getCenter();
    console.log("현재 지도 중심 좌표:", center.lat(), center.lng());
  }
};

  function Pagination({ resultsPerPage, totalResults, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className='pagination'>
          {pageNumbers.map(number => (
            <li key={number} className='page-item'>
              <a onClick={() => paginate(number)} className='page-link'>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <>
    <SearchSection 
    placeholder="지역을 검색하여 카페를 찾으세요 예시.(경북 구미시)"
    onSearch={searchLocation}
    />
    <div className="map-container">

      <div className="map-content">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
    <SearchResultList results={currentResults} onSelect={handleSelect} />
      <Pagination resultsPerPage={resultsPerPage} totalResults={searchResults.length} paginate={paginate} />
    </>
  );
}

export default MapInfo;
