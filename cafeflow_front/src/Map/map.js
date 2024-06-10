/* global naver */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./map.css";
import SearchSection from "./SearchSection";
import ResultList from "./ResultList";
import Pagination from "./Pagination";
import { useNavermaps } from "react-naver-maps";
import MarkerClustering from "./MarkerClustering";
import CustomError from "../Component/CustomError";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function MapInfo() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userLocationMarkerRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const dummyMarkersRef = useRef([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8);
  const [markersData, setMarkersData] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [cluster, setCluster] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const customControlRef = useRef(null);
  const navermaps = useNavermaps();
  const [isChecking, setIsChecking] = useState(false);
  const [dots, setDots] = useState("");
  const stompClientRef = useRef(null);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentMarkers = visibleMarkers.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const htmlMarker1 = {
    content: '<div class="custom-cluster1">1</div>',
    size: new navermaps.Size(30, 30),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker2 = {
    content: '<div class="custom-cluster2">2</div>',
    size: new navermaps.Size(40, 40),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker3 = {
    content: '<div class="custom-cluster3">4</div>',
    size: new navermaps.Size(50, 50),
    anchor: new navermaps.Point(15, 15),
  };

  const htmlMarker4 = {
    content: '<div class="custom-cluster4">4</div>',
    size: new navermaps.Size(60, 60),
    anchor: new navermaps.Point(15, 15),
  };

  function convertCoords(x, y) {
    const xString = x.toString();
    const yString = y.toString();
    const mapx = parseFloat(xString.slice(0, 3) + "." + xString.slice(3));
    const mapy = parseFloat(yString.slice(0, 2) + "." + yString.slice(2));
    return { mapx, mapy };
  }

  const showMarker = (map, marker) => {
    marker.setMap(map);
  };

  const hideMarker = (marker) => {
    marker.setMap(null);
  };

  const handleLocationButtonClick = (map, dummyMarkersRef) => {
    setMarkersData([]);
    setVisibleMarkers([]);
    setSearchResults([]);

    updateMarkers(map, dummyMarkersRef.current);
  };

  const handleSimulateButtonClick = () => {
    setIsChecking((prevIsChecking) => {
      if (!prevIsChecking) {
        connectWebSocket();
      } else {
        disconnectWebSocket();
      }
      return !prevIsChecking;
    });
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      () => {
        stompClient.subscribe("/topic/cafe", (message) => {
          const updatedCafe = JSON.parse(message.body);
          console.log("Received message:", message);
          updateMarkerTraffic(updatedCafe.cafeId, updatedCafe.traffic);
        });
        console.log("WebSocket connected");
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    stompClientRef.current = stompClient;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    }
  };

  const updateMarkers = (map, markers) => {
    const mapBounds = map.getBounds();
    const visibleMarkersData = [];

    markers.forEach((marker) => {
      const position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {
        showMarker(map, marker);

        const addressParts = marker.address.split(" ");
        const address =
          addressParts.length >= 2
            ? `${addressParts[0]} ${addressParts[1]}`
            : marker.address;
        const detailAddress = marker.address;

        visibleMarkersData.push({
          id: marker.id,
          memberId: marker.memberId,
          lat: position.lat(),
          lng: position.lng(),
          name: marker.name,
          address: address,
          detailAddress: detailAddress,
          description: marker.description,
          traffic: marker.traffic,
        });
      } else {
        hideMarker(marker);
      }
    });

    setVisibleMarkers(visibleMarkersData);
    setCurrentPage(1);
  };

  useEffect(() => {
    let interval;
    if (isChecking) {
      interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length >= 3) {
            return "";
          }
          return prevDots + ".";
        });
      }, 500);
    } else {
      setDots("");
    }
    return () => clearInterval(interval);
  }, [isChecking]);

  useEffect(() => {
    const mapOptions = {
      center: new navermaps.LatLng(36.14591781218163, 128.3935552490008),
      logoControl: false,
      mapDataControl: false,
      scaleControl: false,
      tileDuration: 300,
      zoom: 14,
      zoomControl: true,
      zoomControlOptions: { position: 3, style: "LARGE" },
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    var locationBtnHtml =
      '<div class="custom-control-button" id="current-location-btn"> ↻ 현재 화면에서 검색</div>';

    var customControl = new naver.maps.CustomControl(locationBtnHtml, {
      position: naver.maps.Position.BOTTOM_CENTER,
    });

    customControlRef.current = customControl;

    naver.maps.Event.once(map, "init", function () {
      customControl.setMap(map);

      const controlWrapper = customControl.getElement().parentNode;
      controlWrapper.style.marginBottom = "40px";

      const locationButton = document.getElementById("current-location-btn");
      locationButton.addEventListener("click", () =>
        handleLocationButtonClick(map, dummyMarkersRef)
      );

      naver.maps.Event.addListener(map, "zoom_changed", () => {
        const zoomLevel = map.getZoom();
        if (zoomLevel <= 11) {
          customControlRef.current.getElement().style.display = "none";
        } else {
          customControlRef.current.getElement().style.display = "block";
        }
      });
    });

    dummyMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    dummyMarkersRef.current = [];

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/cafe?sort-by=created-at"
        );
        const data = response.data;
        setMarkersData(data);
        createMarkers(data);
      } catch (error) {
        setErrorMessage("API 호출 에러가 발생하였습니다");
        setShowError(true);
      }
    };

    fetchData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(currentLocation);
          userLocationMarkerRef.current = new naver.maps.Marker({
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
              anchor: new naver.maps.Point(17, 26),
            },
          });
        },
        (error) => {
          console.error("오류 : ", error);
        }
      );
    } else {
      setErrorMessage("사용자 위치 추적 에러");
      setShowError(true);
    }
  }, [navermaps]);

  const updateMarkerTraffic = (cafeId, traffic) => {
    dummyMarkersRef.current.forEach((marker) => {
      if (marker.id === cafeId) {
        const newTraffic = traffic;
        marker.traffic = newTraffic;

        const markerContent = `
          <div class="custom-marker" data-congestion="${newTraffic}">
            <p>${marker.name}</p>
            <span class="congestion-indicator" style="background-color: ${newTraffic};"></span>
          </div>`;

        marker.setIcon({
          content: markerContent,
          size: new naver.maps.Size(38, 58),
          anchor: new navermaps.Point(58, 40),
        });
      }
    });
  };

  const createMarkers = (data) => {
    const markers = data.map((item) => {
      const { mapx, mapy } = convertCoords(item.mapx, item.mapy);
      const markerContent = `
        <div class="custom-marker" data-congestion="${item.traffic}">
          <p>${item.name}</p>
          <span class="congestion-indicator" style="background-color: ${item.traffic};"></span>
        </div>`;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(mapy, mapx),
        map: mapInstanceRef.current,
        icon: {
          content: markerContent,
          size: new naver.maps.Size(38, 58),
          anchor: new navermaps.Point(58, 40),
        },
      });
      marker.id = item.id;
      marker.memberId = item.memberId;
      marker.name = item.name;
      marker.description = item.description;
      marker.address = item.address;
      marker.traffic = item.traffic;

      naver.maps.Event.addListener(marker, "click", () => {
        handleMarkerClick({
          id: item.id,
          memberId: item.memberId,
          lat: mapy,
          lng: mapx,
          name: item.name,
          address: item.address,
          description: item.description,
          traffic: item.traffic,
        });
      });

      return marker;
    });

    const clusterOptions = {
      minClusterSize: 2,
      maxZoom: 15,
      map: mapInstanceRef.current,
      markers: markers,
      disableClickZoom: false,
      gridSize: 100,
      icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4],
      indexGenerator: [26, 51, 76, 101],
      stylingFunction: (clusterMarker, count) => {
        clusterMarker.getElement().querySelector("div:first-child").innerText =
          count;
      },
    };

    const newCluster = new MarkerClustering(clusterOptions);
    setCluster(newCluster);

    dummyMarkersRef.current = markers;
    updateMarkers(mapInstanceRef.current, markers);
  };

  const searchLocation = (searchInput) => {
    naver.maps.Service.geocode(
      {
        query: searchInput,
      },
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          console.error("API 요청에 실패했습니다.", response);
          setErrorMessage("API 요청 중 문제가 발생했습니다.");
          setShowError(true);
          return;
        }

        if (response.v2.addresses.length === 0) {
          console.log("검색 결과가 없습니다.", response);
          setErrorMessage("올바른 형식으로 검색 해주세요! (EX.경북 구미시)");
          setShowError(true);
          return;
        }

        const item = response.v2.addresses[0];
        const newLocation = new naver.maps.LatLng(item.y, item.x);
        setSearchResults(response.v2.addresses);
        setCurrentPage(1);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(newLocation);

          if (searchMarkerRef.current) {
            searchMarkerRef.current.setMap(null);
          }

          searchMarkerRef.current = new naver.maps.Marker({
            position: newLocation,
            map: mapInstanceRef.current,
            title: "Search Result",
            zIndex: 1000,
            icon: {
              content:
                '<img src="/img/search-marker.png" alt="검색 결과" ' +
                'style="width: 32px; height: 32px;">',
              size: new naver.maps.Size(25, 26),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(15, 26),
            },
          });
        }
      }
    );
  };

  const handleMarkerClick = (marker) => {
    const newLocation = new navermaps.LatLng(marker.lat, marker.lng);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newLocation);
      mapInstanceRef.current.setZoom(14);
    }
  };

  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new navermaps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(currentLocation);
            mapInstanceRef.current.setZoom(14);
          }
        },
        (error) => {
          setErrorMessage("사용자 위치 추적 에러");
          setShowError(true);
        }
      );
    }
  };

  const handleResultClick = (result) => {
    const newLocation = new naver.maps.LatLng(result.y, result.x);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newLocation);
      mapInstanceRef.current.setZoom(14);
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
      }
      searchMarkerRef.current = new naver.maps.Marker({
        position: newLocation,
        map: mapInstanceRef.current,
        title: "Search Result",
        zIndex: 1000,
        icon: {
          content:
            '<img src="/img/search-marker.png" alt="검색 결과" ' +
            'style="width: 32px; height: 32px;">',
          size: new naver.maps.Size(25, 26),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(15, 26),
        },
      });
    }
  };

  return (
    <>
      <SearchSection
        placeholder="지역을 검색하여 카페를 찾으세요 예시.(경북 구미시)"
        onSearch={searchLocation}
        searchResults={searchResults}
        onResultClick={handleResultClick}
      />
      <div className="simulate-button-content">
        <button
          className={`simulate-button ${isChecking ? "active" : ""}`}
          onClick={handleSimulateButtonClick}
        >
          실시간 확인
        </button>
        {isChecking && (
          <>
            <div className="loading-indicator"></div>
            <div className="loading-container">
              <span>실시간 집계 중입니다{dots}</span>
            </div>
          </>
        )}
      </div>
      <div className="map-container">
        <div className="map-content">
          <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", userSelect: "none" }}
          ></div>
        </div>
        <div className="congestion-sentence">
          <button onClick={moveToCurrentLocation}>↻ 내 위치</button>
          <h6>
            원활
            <span
              className="congestion-indicator1"
              style={{ backgroundColor: "green" }}
            ></span>{" "}
            적정
            <span
              className="congestion-indicator1"
              style={{ backgroundColor: "blue" }}
            ></span>{" "}
            혼잡
            <span
              className="congestion-indicator1"
              style={{ backgroundColor: "red" }}
            ></span>{" "}
          </h6>
        </div>
      </div>
      <ResultList
        markersData={currentMarkers}
        onMarkerClick={handleMarkerClick}
      />
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={visibleMarkers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <CustomError
        show={showError}
        handleClose={() => setShowError(false)}
        handleConfirm={() => setShowError(false)}
      >
        {errorMessage}
      </CustomError>
    </>
  );
}

export default MapInfo;
