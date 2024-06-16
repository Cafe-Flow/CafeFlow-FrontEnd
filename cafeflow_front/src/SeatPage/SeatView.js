import React, { useState, useEffect } from 'react';
import './SeatView.css'; // You can define your own CSS for SeatView
import axios from 'axios';
import Stomp from 'stompjs';

function SeatView({ seats, cafeId }) {
    const [seatStatuses, setSeatStatuses] = useState({}); // State to manage seat statuses
    
    useEffect(() => {
        // Connect to WebSocket server
        const socket = new WebSocket('ws://cafeflow.store:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            // Subscribe to the topic for seat updates
            stompClient.subscribe(`/topic/cafe/${cafeId}/seat`, (message) => {
                const seatUpdate = JSON.parse(message.body);
                // Update seatStatus in seatStatuses state
                setSeatStatuses(prevSeatStatuses => ({
                    ...prevSeatStatuses,
                    [seatUpdate.seatNumber]: seatUpdate.seatStatus
                }));
            });
        });

        return () => {
            // Disconnect WebSocket on component unmount
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [cafeId]);

    // Function to handle seat click
    const handleSeatClick = (seatNumber) => {
        // Toggle seat status between "AVAILABLE" and "OCCUPIED"
        const newStatus = seatStatuses[seatNumber] === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";

        // Send seat status update to the server
        const seatUpdate = {
            seatStatus: newStatus,
            seatNumber: seatNumber
        };

        // Create WebSocket connection
        const socket = new WebSocket('ws://cafeflow.store:8080/ws');
        const stompClient = Stomp.over(socket);
        
        stompClient.connect({}, () => {
            // Send the seat status update to the destination queue
            stompClient.send(`/app/cafe/${cafeId}/seat`, {}, JSON.stringify(seatUpdate));
        });
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
                                    top: seat.seatCoordinates.y,
                                    backgroundColor: seatStatuses[seat.seatNumber] === "OCCUPIED" ? "#d3c2a0" : "#1abc9c" // Change background color based on seatStatus
                                }}
                                onClick={() => handleSeatClick(seat.seatNumber)} // Attach click event handler
                            >
                                <div>{seatStatuses[seat.seatNumber]}</div> {/* Display seat status */}
                                {seat.seatNumber}
                                <button className="plug-btn">
                                    {seat.seatHasPlug ? "🔌" : "Off"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatView;
