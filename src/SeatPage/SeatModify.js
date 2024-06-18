import React, { useState, useEffect } from 'react';
import './SeatRegister.css';

function SeatModify() {
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        // 등록된 좌석 정보를 가져오는 함수 호출
        fetchSeats();
    }, []);

    const fetchSeats = () => {
        // 등록된 좌석 정보를 가져오는 API 호출
        fetch('/api/seats')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); 
                }
                return response.json();
            })
            .then(data => {
                setSeats(data);
            })
            .catch(error => console.error('Error:', error));
    };

    const updateSeat = (id, newData) => {
        // 좌석 정보를 수정하는 API 호출
        const url = `/api/seats/${id}`;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData)
        };

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Seat updated:', data);
                // 수정된 좌석 정보를 UI에 반영하려면 상태를 업데이트하거나 다시 API 호출하여 새로운 데이터를 가져와야 함
            })
            .catch(error => console.error('Error:', error));
    };

    // 좌석 정보를 수정하는 함수
    const handleUpdateSeat = (id, newData) => {
        updateSeat(id, newData);
    };

    return (
        <div id="background">
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div id="outerContainer">
                    <div id="container">
                        {seats.map(seat => (
                            <div
                                key={seat.id}
                                className="draggable"
                                style={{
                                    width: seat.seatAngle === "HORIZONTAL" ? 100 : seat.seatSize * 50,
                                    height: seat.seatAngle === "HORIZONTAL" ? seat.seatSize * 50 : 100,
                                    left: seat.seatCoordinates.x,
                                    top: seat.seatCoordinates.y
                                }}
                            >
                                {seat.seatNumber}
                                <button className="rotate-btn" onClick={() => console.log('Rotate seat:', seat.id)}>↻</button>
                                <button className="delete-btn" onClick={() => console.log('Delete seat:', seat.id)}>X</button>
                                {/* 좌석 정보 수정 기능을 넣는 버튼 */}
                                <button onClick={() => handleUpdateSeat(seat.id, { seatStatus: seat.seatStatus === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE" })}>Toggle Status</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatModify;
