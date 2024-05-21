import React from "react";

function getCongestionLevel(congestion) {
  return congestion > 80 ? "혼잡" : congestion > 50 ? "적정" : "원활";
}

function ResultList({ results, onSelect, markersData, onMarkerClick }) {
  const allResults = [...results, ...markersData];

  if (allResults.length === 0) {
    return <div>검색 결과가 없습니다</div>;
  }

  return (
    <ul className="search-results">
      {allResults.map((item, index) => {
        if (item.roadAddress) {
          return (
            <li key={index} onClick={() => onSelect(item)}>
              {item.roadAddress} - {item.jibunAddress}
            </li>
          );
        } else {
          return (
            <li key={index} onClick={() => onMarkerClick(item)}>
              매장 {item.title} - {getCongestionLevel(item.congestion)}
            </li>
          );
        }
      })}
    </ul>
  );
}

export default ResultList;
