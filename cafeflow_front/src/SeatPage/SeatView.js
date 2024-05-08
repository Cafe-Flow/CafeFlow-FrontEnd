// SeatView.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatView.css'; // You can define your own CSS for SeatView

function SeatView({ seats }) { // Accept idx as a prop

    return (
        <div id="background">
            <div style={{ display: "flex", flexDirection: "row", transform: "scale(0.8)" }}>
                <div id="outerContainer">
                    <div id="container">
                      <div class="seatlog"></div>
                        {seats.map(seat => (
                            <div
                                key={seat.id}
                                className="draggable"
                                style={{
                                    width: seat.seatAngle === "HORIZONTAL" ? 100 : seat.seatSize * 50,
                                    height: seat.seatAngle === "HORIZONTAL" ? seat.seatSize * 50 : 100,
                                    left: seat.seatCoordinates.x,
                                    top: seat.seatCoordinates.y,
                                    backgroundColor: seat.seatHasPlug ? "#1abc9c" : "#d3c2a0"
                                }}
                            >
                                {seat.seatNumber}
                                <div>
                                    Position: {seat.seatCoordinates.x}, {seat.seatCoordinates.y}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatView;
