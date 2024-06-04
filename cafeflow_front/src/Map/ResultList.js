import React from "react";

function getCongestionLevel(congestion) {
  return congestion > 80 ? "혼잡" : congestion > 50 ? "적정" : "원활";
}

function getCongestionColor(congestion) {
  return congestion > 80 ? "red" : congestion > 50 ? "blue" : "green";
}

function ResultList({ markersData, onMarkerClick }) {
  const allResults = markersData;

  return (
    <ul className="search-results">
      {allResults.length === 0 ? (
        <li>
          <h5>결과가 없습니다.</h5>
        </li>
      ) : (
        allResults.map((item, index) => (
          <li key={index} onClick={() => onMarkerClick(item)}>
            <span className="si-goo">ㅇㅇ시 / ㅁㅁ구</span>
            <span className="maejang-name">
              {item.title} - {getCongestionLevel(item.congestion)}{" "}
              <span
                className="congestion-indicator"
                style={{
                  backgroundColor: getCongestionColor(item.congestion),
                  marginLeft: "10px",
                }}
              ></span>
            </span>
            <button>조회</button>
          </li>
        ))
      )}
    </ul>
  );
}
export default ResultList;
