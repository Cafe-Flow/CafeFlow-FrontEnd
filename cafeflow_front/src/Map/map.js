/* global naver */
import React, { useState, useEffect, useRef } from "react";
import "./map.css";
import SearchSection from "../MainPage/SearchSection";
import { useNavermaps } from "react-naver-maps";
import MarkerClustering from "./MarkerClustering.js";

function MapInfo() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const dummyMarkersRef = useRef([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    currentPage * resultsPerPage - resultsPerPage,
    currentPage * resultsPerPage
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [cluster, setCluster] = useState(null);
  const navermaps = useNavermaps();

  const htmlMarker1 = {
    content: '<div class="custom-cluster1">1</div>',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker2 = {
    content: '<div class="custom-cluster2"> 2</div> ',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker3 = {
    content:
      '<div style="width: 30px; height: 30px; background-color: #00f; border-radius: 50%; text-align: center; line-height: 30px; color: white;">3</div>',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker4 = {
    content:
      '<div style="width: 30px; height: 30px; background-color: #ff0; border-radius: 50%; text-align: center; line-height: 30px; color: white;">4</div>',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker5 = {
    content:
      '<div style="width: 30px; height: 30px; background-color: #0ff; border-radius: 50%; text-align: center; line-height: 30px; color: white;">5</div>',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  function getCongestionLevel(congestion) {
    return congestion > 80 ? "high" : congestion > 50 ? "medium" : "low";
  }

  function getCongestionColor(congestion) {
    return congestion > 80 ? "red" : congestion > 50 ? "yellow" : "blue";
  }

  function createDummyData(center, count, distance) {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 360; // 랜덤 각도
      const latChange = distance * Math.sin((angle * Math.PI) / 180);
      const lngChange = distance * Math.cos((angle * Math.PI) / 180);
      const congestion = Math.floor(Math.random() * 101);
      positions.push({
        lat: center.lat() + latChange,
        lng: center.lng() + lngChange,
        congestion,
      });
    }
    return positions;
  }

  useEffect(() => {
    const mapOptions = {
      center: new navermaps.LatLng(37.5666103, 126.9783882),
      logoControl: false,
      mapDataControl: false,
      scaleControl: false,
      tileDuration: 300,
      zoom: 14,
      zoomControl: true,
      zoomControlOptions: { position: 3, style: "LARGE" },
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    dummyMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    dummyMarkersRef.current = [];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(currentLocation);
          markerRef.current = new naver.maps.Marker({
            position: currentLocation,
            map: map,
            title: "Your Location",
            zIndex: 1000,
            icon: {
              content:
                '<img src="/img/marker.png" alt="내 위치" ' +
                'style="width: 32px; height: 32px;">',
              size: new naver.maps.Size(50, 52),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(25, 26),
            },
          });

          const dummyPositions = createDummyData(currentLocation, 30, 0.033);
          const markers = dummyPositions.map((pos, index) => {
            const congestionColor = getCongestionColor(pos.congestion);
            const markerContent = `
            <div class="custom-marker" data-congestion="${getCongestionLevel(
              pos.congestion
            )}">
              <p>매장 ${index + 1}</p>
              <span class="congestion-indicator" style="background-color: ${congestionColor};"></span>
            </div>`;
            return new naver.maps.Marker({
              position: new naver.maps.LatLng(pos.lat, pos.lng),
              map: map,
              icon: {
                content: markerContent,
                size: new naver.maps.Size(38, 58),
                anchor: new naver.maps.Point(19, 58),
              },
            });
          });

          const clusterOptions = {
            minClusterSize: 2,
            maxZoom: 13,
            map: map,
            markers: markers,
            disableClickZoom: false,
            gridSize: 120,
            icons: [
              htmlMarker1,
              htmlMarker2,
              htmlMarker3,
              htmlMarker4,
              htmlMarker5,
            ],
            indexGenerator: [31, 40, 50, 60, 100],
            stylingFunction: (clusterMarker, count) => {
              clusterMarker
                .getElement()
                .querySelector("div:first-child").innerText = count;
            },
          };
          const newCluster = new MarkerClustering(clusterOptions);
          setCluster(newCluster);
        },
        (error) => {
          console.error("오류 : ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [navermaps]);

  function createDummyMarkers(map, count) {
    const markers = [];
    for (let i = 0; i < count; i++) {
      const position = new navermaps.LatLng(
        37.5666103 + Math.random() * 0.1 - 0.05, // Random latitude within a range
        126.9783882 + Math.random() * 0.1 - 0.05 // Random longitude within a range
      );

      const marker = new navermaps.Marker({
        position,
        map: map,
        title: `Marker ${i + 1}`,
        icon: {
          content: '<div class="custom-marker">매장 ' + (i + 1) + "</div>",
          size: new navermaps.Size(38, 58),
          anchor: new navermaps.Point(19, 58),
        },
      });
      markers.push(marker);
    }
    return markers;
  }

  const searchLocation = (searchInput) => {
    naver.maps.Service.geocode(
      {
        query: searchInput,
      },
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          console.error("API 요청에 실패했습니다.", response);
          alert("API 요청 중 문제가 발생했습니다.");
          return;
        }

        if (response.v2.addresses.length === 0) {
          console.log("검색 결과가 없습니다.", response);
          alert("검색 결과가 없습니다.");
          return;
        }

        const item = response.v2.addresses[0];
        console.log("검색 결과:", response.v2.addresses);
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
      }
    );
  };

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(currentLocation);
            if (!markerRef.current) {
              markerRef.current = new naver.maps.Marker({
                position: currentLocation,
                map: mapInstanceRef.current,
              });
            } else {
              markerRef.current.setPosition(currentLocation);
            }
          }
        },
        (error) => {
          console.error("Geolocation error: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  function Pagination({ resultsPerPage, totalResults, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} className="page-link">
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
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={searchResults.length}
        paginate={paginate}
      />
    </>
  );
}

export default MapInfo;
