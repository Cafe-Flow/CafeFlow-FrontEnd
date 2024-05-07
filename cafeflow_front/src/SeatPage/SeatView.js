import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./SeatRegister.css";

function SeatView({ idx }) { // idx prop을 받아옴
  const [seats, setSeats] = useState([]);
  
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cafe/${idx}/seat-register`
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error); 
      }
    };

    fetchSeats();
  }, [idx]); // idx가 변경될 때마다 호출

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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatView;
