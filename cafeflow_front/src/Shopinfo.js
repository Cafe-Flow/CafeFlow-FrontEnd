import React, { useEffect, useRef } from 'react';
import './App.css';

function ShopInfo() {

    const lat = 37.3595704;
    const lng = 127.105399;

function Map({ lat, lng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const { naver } = window;
    if (mapRef.current && naver) {
      const location = new naver.maps.LatLng(lat, lng);
      const map = new naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 17, // 지도 확대 정도
      });
      new naver.maps.Marker({
        position: location,
        map,
      });
    }
  }, [lat, lng]); 

  return (<div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>);

}

return (    
    <div className="map-container">
    <div className="map-content">
        <Map lat={lat} lng={lng} />
    </div>
</div>
);

}
export default ShopInfo;
