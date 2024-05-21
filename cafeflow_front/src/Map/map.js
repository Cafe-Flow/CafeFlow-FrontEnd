/* global naver */
import React, { useState, useEffect, useRef } from "react";
import { MdOutlineAutorenew } from "react-icons/md";
import "./map.css";
import SearchSection from "../MainPage/SearchSection";
import ResultList from "./ResultList";
import Pagination from "./Pagination";
import { useNavermaps } from "react-naver-maps";
import MarkerClustering from "./MarkerClustering";

function MapInfo() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const dummyMarkersRef = useRef([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8);
  const [markersData, setMarkersData] = useState([]);
  const [cluster, setCluster] = useState(null);
  const navermaps = useNavermaps();

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const currentMarkers = markersData.slice(
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
    content: '<div class="custom-cluster2"> 2</div> ',
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
      const angle = Math.random() * 360;
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

  const showMarker = (map, marker) => {
    marker.setMap(map);
  };

  const hideMarker = (marker) => {
    marker.setMap(null);
  };

  const updateMarkers = (map, markers) => {
    const mapBounds = map.getBounds();

    markers.forEach((marker) => {
      const position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {
        showMarker(map, marker);
        console.log("show");
      } else {
        hideMarker(marker);
        console.log("hide");
      }
    });
  };

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
    mapInstanceRef.current = map;

    var locationBtnHtml =
      '<div class="custom-control-button" id="current-location-btn"> 🔄 현재 위치에서 검색</div>';

    var customControl = new naver.maps.CustomControl(locationBtnHtml, {
      position: naver.maps.Position.BOTTOM_CENTER,
    });

    naver.maps.Event.once(map, "init", function () {
      customControl.setMap(map);

      const controlWrapper = customControl.getElement().parentNode;
      controlWrapper.style.marginBottom = "40px";

      const locationButton = document.getElementById("current-location-btn");
      locationButton.addEventListener("click", () => {
        updateMarkers(map, dummyMarkersRef.current);
        console.log("실행");
      });
    });

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

          const dummyPositions = createDummyData(currentLocation, 15, 0.015);
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
                anchor: new naver.maps.Point(58, 40),
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
            icons: [htmlMarker1, htmlMarker2],
            indexGenerator: [31, 40],
            stylingFunction: (clusterMarker, count) => {
              clusterMarker
                .getElement()
                .querySelector("div:first-child").innerText = count;
            },
          };
          const newCluster = new MarkerClustering(clusterOptions);
          setCluster(newCluster);

          const markerData = markers.map((marker, index) => ({
            id: index + 1,
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
            title: `${index + 1}`,
            description: `Description for Marker ${index + 1}`,
            congestion: dummyPositions[index].congestion,
          }));
          setMarkersData(markerData);

          dummyMarkersRef.current = markers;
        },
        (error) => {
          console.error("오류 : ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [navermaps]);

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

  const handleMarkerClick = (marker) => {
    const newLocation = new navermaps.LatLng(marker.lat, marker.lng);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newLocation);
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
          }
        },
        (error) => {
          console.error("Error getting current position: ", error);
        }
      );
    }
  };

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
      <ResultList
        results={currentResults}
        onSelect={handleSelect}
        markersData={currentMarkers}
        onMarkerClick={handleMarkerClick}
      />
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={searchResults.length + markersData.length}
        paginate={paginate}
      />
    </>
  );
}

export default MapInfo;
