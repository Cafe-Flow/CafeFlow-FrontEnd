/* global naver */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./map.css";
import SearchSection from "./SearchSection";
import ResultList from "./ResultList";
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
  const stompClientRef = useRef(null);
  const [isListVisible, setIsListVisible] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentMarkers = visibleMarkers.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

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

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const toggleListTrue = () => {
    setIsListVisible(true);
  };

  const handleLocationButtonClick = (map, dummyMarkersRef) => {
    setMarkersData([]);
    setVisibleMarkers([]);
    setSearchResults([]);
    setIsListVisible(true);
    updateMarkers(map, dummyMarkersRef.current);
  };

  const connectWebSocket = () => {
    if (stompClientRef.current || isConnecting) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    setIsConnecting(true);
    
    const socket = new SockJS("/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      () => {
        stompClient.subscribe("/topic/cafe", (message) => {
          const updatedCafe = JSON.parse(message.body);
          const traffic = updatedCafe.traffic === "YELLOW" ? "BLUE" : updatedCafe.traffic;
          console.log("Received message:", message);
          updateMarkerTraffic(
            updatedCafe.cafeId,
            traffic,
            updatedCafe.watingTime
          );
        });
        console.log("WebSocket connected");
        setIsConnecting(false);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        setIsConnecting(false);
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
          watingTime: marker.watingTime,
          reviewCount: marker.reviewCount,
          reviewsRating: marker.reviewsRating,
          image: marker.image,
        });
      } else {
        hideMarker(marker);
      }
    });

    setVisibleMarkers(visibleMarkersData);
    setCurrentPage(1);
  };

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
      icon: {
        content:
          '<img src="/img/marker.png" alt="내 위치" ' +
          'style="width: 32px; height: 32px;">',
        size: new naver.maps.Size(50, 52),
        origin: new naver.maps.Point(0, 0),
        anchor: new navermaps.Point(48, 48),
      },
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
      controlWrapper.style.marginBottom = "140px";

      const locationButton = document.getElementById("current-location-btn");
      locationButton.addEventListener("click", () =>
        handleLocationButtonClick(map, dummyMarkersRef)
      );

      naver.maps.Event.addListener(map, "zoom_changed", () => {
        const zoomLevel = map.getZoom();
        if (zoomLevel <= 10) {
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
          "/api/cafe?sort-by=created-at"
        );
    const data = response.data.map((item) => ({
      ...item,
      traffic: item.traffic === "YELLOW" ? "BLUE" : item.traffic,
    }));
    setMarkersData(data);
        createMarkers(data);
      } catch (error) {
        setErrorMessage("API 호출 에러가 발생하였습니다");
        setShowError(true);
      }
    };

    fetchData();

  }, [navermaps]);

  useEffect(() => {
    connectWebSocket();
        return () => {
          disconnectWebSocket();
        };
  }, []);

  const updateMarkerTraffic = (cafeId, traffic, watingTime) => {
    setMarkersData((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === cafeId ? { ...marker, traffic, watingTime } : marker
      )
    );
    
        setVisibleMarkers((prevVisibleMarkers) =>
        prevVisibleMarkers.map((marker) =>
            marker.id === cafeId ? { ...marker, traffic, watingTime } : marker
        )
    );

    dummyMarkersRef.current.forEach((marker) => {
      if (marker.id === cafeId) {
        const newTraffic = traffic;
        marker.traffic = newTraffic;
        marker.watingTime = watingTime;

        const markerContent = `
         <div class="custom-marker" data-congestion="${marker.traffic}">
          <p>${marker.name}</p>
          <span class="congestion-indicator" style="background-color: ${marker.traffic};"></span>
        </div>`;

        marker.setIcon({
          content: markerContent,
          size: new naver.maps.Size(21, 21),
          anchor: new navermaps.Point(38, 48),
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
          anchor: new navermaps.Point(38, 48),
        },
      });
      marker.id = item.id;
      marker.memberId = item.memberId;
      marker.name = item.name;
      marker.description = item.description;
      marker.address = item.address;
      marker.traffic = item.traffic;
      marker.watingTime = item.watingTime;
      marker.reviewCount = item.reviewCount;
      marker.reviewsRating = item.reviewsRating;
      marker.image = item.image;

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
          watingTime: item.watingTime,
          reviewCount: item.reviewCount,
          reviewsRating: item.reviewsRating,
          image: item.image,
        });
      });

      return marker;
    });

    const clusterOptions = {
      minClusterSize: 2,
      maxZoom: 20,
      map: mapInstanceRef.current,
      markers: markers,
      disableClickZoom: false,
      gridSize: 100,
      icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4],
      indexGenerator: [10, 20, 30, 50],
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
              anchor: new navermaps.Point(38, 48),
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
          anchor: new navermaps.Point(38, 48),
        },
      });
    }
  };

  return (
    <>
      <div className="map-container-top">
        <SearchSection
          placeholder="지역을 검색하여 카페를 찾으세요 예시.(경북 구미시)"
          onSearch={searchLocation}
          searchResults={searchResults}
          onResultClick={handleResultClick}
        />
      </div>
      <div className="map-container">
        <div className="map-content">
          <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", userSelect: "none" }}
          ></div>
        </div>
        <div className="congestion-sentence">
          <h6>
            원활
            <span style={{ backgroundColor: "green" }}></span> 적정
            <span style={{ backgroundColor: "blue" }}></span> 혼잡
            <span style={{ backgroundColor: "red" }}></span>{" "}
          </h6>
        </div>
        <div className="congestion-sentence-add">
          <p>사용중인 좌석</p>
          <p> ~30%이내 | ~70%이내 | ~100%</p>
        </div>
        <div
          className={`result-list-container ${isListVisible ? "" : "hidden"}`}
          id="result-list-container"
        >
          <ResultList
            markersData={currentMarkers}
            onMarkerClick={handleMarkerClick}
            isListVisible={isListVisible}
          />
        </div>
        <button
          className={`toggle-button ${isListVisible ? "visible" : "hidden"}`}
          onClick={toggleListVisibility}
        >
          {isListVisible ? "◀" : "▶"}
        </button>
      </div>
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
