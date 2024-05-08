import React, { useState } from 'react';
import './SeatRegister.css';
import useSeatStore from './SeatStore';

function SeatRegister({ existingSeats, onSeatData }) {
    const seats = useSeatStore((state) => state.seats); // Get seats from the store
    const setSeats = useSeatStore((state) => state.setSeats); // Get function to update seats from the store

    const addSeat = (size) => {
        const newSeat = {
            id: seats.length + 1, // 기존 좌석의 개수에 1을 더하여 새로운 좌석의 id를 생성
            size: size,
            orientation: "HORIZONTAL",
            position: { x: 0, y: 0 },
            plug: false
        };

        setSeats([...seats, newSeat]); // 기존의 좌석 데이터와 새로운 좌석을 합쳐서 업데이트
    };

    const togglePlug = (id) => {
        setSeats(seats.map(seat => {
            if (seat.id === id) { 
                return {
                    ...seat,
                    plug: !seat.plug
                };
            }
            return seat;
        }));
    };    

    const rotateSeat = (id) => {
        setSeats(seats.map(seat => {
            if (seat.id === id) {
                return {
                    ...seat,
                    orientation: seat.orientation === "HORIZONTAL" ? "VERTICAL" : "HORIZONTAL"
                };
            }
            return seat;
        }));
    };

    const deleteSeat = (id) => {
        setSeats(seats.filter(seat => seat.id !== id));
    };

    const updateSeatPosition = (id, x, y) => {
        setSeats(seats.map(seat => {
            if (seat.id === id) {
                return { ...seat, position: { x: x, y: y } };
            }
            return seat;
        }));
    };

    const handleDragStart = (e, id) => {
        const index = seats.findIndex(seat => seat.id === id);
        const offsetX = e.clientX - seats[index].position.x;
        const offsetY = e.clientY - seats[index].position.y;

        const handleDrag = (e) => {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            updateSeatPosition(id, x, y);
        };

        const handleDragEnd = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    const handleSeatData = () => {
        onSeatData(seats); // 새로운 좌석 데이터만을 부모 컴포넌트로 전달
    };

    return (
        <div id="background">
            <div style={{ display: "flex", flexDirection: "row", transform: "scale(0.8)" }}>
                <div id="outerContainer">
                    <div id="container">
                        {seats.map(seat => (
                            <div
                                key={seat.id}
                                className="draggable"
                                style={{
                                    width: seat.orientation === "HORIZONTAL" ? 100 : seat.size * 50,
                                    height: seat.orientation === "HORIZONTAL" ? seat.size * 50 : 100,
                                    left: seat.position.x,
                                    top: seat.position.y,
                                    backgroundColor: seat.plug ? "#1abc9c" : "#d3c2a0"
                                }}
                                onMouseDown={(e) => handleDragStart(e, seat.id)}
                            >
                                {seat.id}
                                <button className="rotate-btn" onClick={() => rotateSeat(seat.id)}>↻</button>
                                <button className="delete-btn" onClick={() => deleteSeat(seat.id)}>X</button>
                                <button className="plug-btn" onClick={() => togglePlug(seat.id)}>
                                    {seat.plug ? "🔌" : "Off"}
                                </button>
                                <div>
                                    Position: {seat.position.x}, {seat.position.y}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginLeft: "20px" }}>
                        <div id="buttons">
                            <button onClick={() => addSeat(2)}>2인 좌석 생성</button>
                            <button onClick={() => addSeat(4)}>4인 좌석 생성</button>
                            <button onClick={() => addSeat(6)}>6인 좌석 생성</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatRegister;
